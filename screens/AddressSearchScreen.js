import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../styles/color";
import { commonStyles } from "../styles/commonStyles";
import { normalizeFont } from "../utils/responsive";

// 공식 가이드(https://postcode.map.kakao.com/guide)의 현재 경로.
// 예전 경로(spi.maps.daum.net)는 2026-05에 삭제됨
const POSTCODE_SCRIPT_URL =
  "https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

// HTML을 올려 둘 가짜 출처(origin). 실제로 이 주소에 요청하지는 않는다.
// 우편번호 스크립트는 location.protocol + host로 iframe의 응답 대상(origin)을 정하는데,
// baseUrl 없이 HTML을 넣으면 about:blank("about://")가 되어 선택 결과·resize 메시지가
// 부모 페이지에 도착하지 않는다 (검색은 되는데 선택이 안 먹는 증상)
const PAGE_BASE_URL = "https://gopssl.com/";

// 우편번호 서비스가 쓰는 주소. 이 밖의 주소로는 이동시키지 않는다
const POSTCODE_HOSTS = ["postcode.map.kakao.com", "t1.kakaocdn.net"];

// 스크립트 로드 + 첫 화면 표시까지 기다리는 최대 시간
const LOAD_TIMEOUT_MS = 15000;

// 키·서버 없이 카카오 우편번호 서비스를 embed 모드로 띄운다.
// 웹뷰에서는 window.open(팝업)이 안 되는 경우가 있어 가이드 권장대로 embed를 쓴다
const POSTCODE_HTML = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
<style>
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
  #wrap { width: 100%; height: 100%; }
</style>
</head>
<body>
<div id="wrap"></div>
<script>
  function send(msg) {
    window.ReactNativeWebView.postMessage(JSON.stringify(msg));
  }

  // 도로명 주소 참고항목: 가이드 예제와 같은 규칙
  // (법정동은 동/로/가로 끝날 때만, 건물명은 공동주택일 때만)
  function extraOf(data) {
    var extra = "";
    if (data.bname !== "" && /[동로가]$/g.test(data.bname)) {
      extra += data.bname;
    }
    if (data.buildingName !== "" && data.apartment === "Y") {
      extra += (extra !== "" ? ", " + data.buildingName : data.buildingName);
    }
    return extra !== "" ? " (" + extra + ")" : "";
  }

  function start() {
    var Postcode =
      (window.kakao && window.kakao.Postcode) ||
      (window.daum && window.daum.Postcode);
    if (!Postcode) {
      send({ type: "error", reason: "postcode-undefined" });
      return;
    }
    new Postcode({
      width: "100%",
      height: "100%",
      // 우편번호 화면(iframe)이 처음 그려질 때 크기를 알려 온다 → 실제로 뜬 것으로 보고 ready
      onresize: function () {
        if (!readySent) {
          readySent = true;
          send({ type: "ready" });
        }
      },
      oncomplete: function (data) {
        // 도로명 우선, 없으면 지번
        var road = data.roadAddress || data.autoRoadAddress || "";
        var jibun = data.jibunAddress || data.autoJibunAddress || "";
        send({
          type: "complete",
          zonecode: data.zonecode,
          roadAddress: road,
          jibunAddress: jibun,
          buildingName: data.buildingName,
          userSelectedType: data.userSelectedType,
          address: road ? road + extraOf(data) : jibun,
        });
      },
    }).embed(document.getElementById("wrap"), { autoClose: false });
  }

  var readySent = false;

  var s = document.createElement("script");
  s.src = "${POSTCODE_SCRIPT_URL}";
  s.onload = start;
  s.onerror = function () { send({ type: "error", reason: "script-load" }); };
  document.head.appendChild(s);
</script>
</body>
</html>`;

const AddressSearchScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const backScreen = route?.params?.backScreen;
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [reloadKey, setReloadKey] = useState(0);
  const timeoutRef = useRef(null);

  const clearLoadTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // 로드할 때마다 타임아웃을 건다 (비행기 모드 등에서 스크립트가 영영 안 올 때 대비)
  useEffect(() => {
    clearLoadTimeout();
    timeoutRef.current = setTimeout(() => {
      setStatus((prev) => (prev === "loading" ? "error" : prev));
    }, LOAD_TIMEOUT_MS);
    return clearLoadTimeout;
  }, [reloadKey]);

  // 폼 화면으로 결과를 돌려준다. 폼 화면은 스택에 그대로 있으므로 popTo로 돌아가며 params만 합친다
  const returnToForm = useCallback(
    (params) => {
      if (backScreen) {
        navigation.popTo(backScreen, params, { merge: true });
      } else {
        navigation.goBack();
      }
    },
    [backScreen, navigation]
  );

  const handleMessage = (event) => {
    let msg;
    try {
      msg = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }

    if (msg.type === "ready") {
      clearLoadTimeout();
      setStatus("ready");
    } else if (msg.type === "error") {
      clearLoadTimeout();
      setStatus("error");
    } else if (msg.type === "complete" && msg.address) {
      returnToForm({
        selectedAddress: {
          addressName: msg.address,
          zipCode: msg.zonecode || "",
        },
      });
    }
  };

  const handleLoadError = () => {
    clearLoadTimeout();
    setStatus("error");
  };

  // 검색 결과·하단 링크가 다른 페이지나 외부 브라우저로 나가지 않게 막는다.
  // 처음 넣은 HTML과 우편번호 서비스 주소만 허용한다.
  // (Android는 iframe 요청에도 isTopFrame을 믿을 수 없어서 프레임 여부 대신 주소로 판단)
  const handleShouldStartLoad = (request) => {
    const url = request.url || "";
    if (url === PAGE_BASE_URL) return true;
    if (url.startsWith("about:") || url.startsWith("data:")) return true;
    const host = url.match(/^https:\/\/([^/?#]+)/)?.[1];
    return !!host && POSTCODE_HOSTS.includes(host);
  };

  const handleRetry = () => {
    setStatus("loading");
    setReloadKey((k) => k + 1);
  };

  const handleManualInput = () => {
    returnToForm({ manualAddress: true });
  };

  return (
    <View
      style={[
        styles.pageContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.purple} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주소 검색</Text>
      </View>

      <View style={styles.separatorLine} />

      <View style={styles.webviewContainer}>
        {status !== "error" && (
          <WebView
            key={reloadKey}
            source={{ html: POSTCODE_HTML, baseUrl: PAGE_BASE_URL }}
            originWhitelist={["*"]}
            javaScriptEnabled
            domStorageEnabled
            onMessage={handleMessage}
            onError={handleLoadError}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            // Android: target=_blank 링크가 새 창 대신 같은 웹뷰로 오게 해서 위에서 막는다
            setSupportMultipleWindows={false}
            // iOS: 새 창 요청은 무시 (외부 브라우저로 넘기지 않음)
            onOpenWindow={() => {}}
            style={styles.webview}
          />
        )}

        {status === "loading" && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={colors.purple} />
          </View>
        )}

        {status === "error" && (
          <View style={styles.errorContainer}>
            <Ionicons
              name="cloud-offline-outline"
              size={40}
              color={colors.purple}
            />
            <Text style={styles.errorTitle}>주소 검색을 불러오지 못했어요</Text>
            <Text style={styles.errorText}>
              네트워크 상태를 확인하고 다시 시도하거나,{"\n"}주소를 직접
              입력해 주세요.
            </Text>
            <View style={styles.errorButtons}>
              <TouchableOpacity
                style={[styles.button, styles.outlineButton]}
                onPress={handleRetry}
              >
                <Text style={[styles.buttonText, { color: colors.purple }]}>
                  다시 시도
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.fillButton]}
                onPress={handleManualInput}
              >
                <Text style={[styles.buttonText, { color: "#fff" }]}>
                  직접 입력
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default AddressSearchScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 8,
  },
  backButton: {
    paddingRight: 4,
  },
  headerTitle: {
    fontFamily: "NanumSquareB",
    fontSize: normalizeFont(16),
    letterSpacing: -0.5,
    color: colors.purple,
  },
  separatorLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#fff",
    ...commonStyles.dropShadow,
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  errorTitle: {
    fontFamily: "NanumSquareB",
    fontSize: normalizeFont(16),
    color: colors.purple,
    letterSpacing: -0.5,
  },
  errorText: {
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(14),
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
  errorButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.purple,
  },
  fillButton: {
    backgroundColor: colors.purple,
  },
  buttonText: {
    fontFamily: "tjM",
    fontSize: normalizeFont(14),
    letterSpacing: -0.5,
  },
});
