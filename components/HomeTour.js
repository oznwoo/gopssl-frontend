import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  InteractionManager,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Defs, Mask, Rect } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import colors from "../styles/color";
import { normalizeFont } from "../utils/responsive";
import { homeTourFinished, homeTourStarted } from "../store/tourSlice";

// 홈 화면 기능 안내(코치마크).
// 라이브러리 없이 직접 구현: 대상 요소를 measureInWindow로 재고, 전체 화면 Modal 위에
// react-native-svg 마스크로 구멍을 뚫어 그 요소만 밝게 보여 준다.
// - 대상 등록: useTourTarget("키")가 돌려주는 ref를 요소에 붙인다
// - 한 단계에 대상이 여러 개면(하단 탭 3개) 둘러싸는 사각형 하나로 강조한다
// - 대상이 없거나 잴 수 없으면 구멍 없이 가운데 말풍선만 보여 준다

// 안내를 봤는지는 가입 완료 여부(@viewedOnboarding)와 섞지 않는 별도 키에 계정별로 저장한다.
// 같은 기기에서 새 계정을 만들어도 그 계정에는 안내가 뜨도록 사용자 id를 붙인다.
export const homeTourDoneKey = (userId) =>
  userId ? `@homeTourDone_${userId}` : "@homeTourDone";

export const HOME_TOUR_STEPS = [
  {
    targets: ["dateHeader"],
    title: "날짜 바꾸기",
    text: "화살표를 누르거나 화면을 좌우로 밀어서\n날짜를 바꿀 수 있어요.\n가운데 날짜를 누르면 달력이 열려요.",
  },
  {
    targets: ["addButton"],
    title: "매출·손님 등록",
    text: "+ 버튼을 누르면 '매출 등록'과 '고객 등록'이 나와요.\n매출과 손님은 여기서 등록해요.",
  },
  {
    targets: ["dailyTotal"],
    title: "오늘 매출 합계",
    text: "고른 날짜의 매출 합계가 여기에 보여요.",
  },
  {
    targets: ["tab-Search", "tab-Comparision", "tab-Setting"],
    title: "아래 메뉴",
    text: "왼쪽부터 손님 찾기 · 월별 매출 비교 · 설정이에요.\n홈으로 돌아오려면 맨 왼쪽 집 모양을 눌러요.",
  },
  {
    targets: [],
    title: "준비 끝!",
    text: "이제 + 버튼을 눌러\n첫 매출을 등록해 보세요.\n\n이 안내는 설정 → '사용 가이드 다시 보기'에서\n언제든 다시 볼 수 있어요.",
  },
];

const HOLE_PADDING = 8;
const HOLE_RADIUS = 12;
const BUBBLE_GAP = 12;

const TourContext = createContext(null);

const measureNode = (ref) =>
  new Promise((resolve) => {
    const node = ref?.current;
    if (!node || typeof node.measureInWindow !== "function") {
      resolve(null);
      return;
    }
    node.measureInWindow((x, y, width, height) => {
      resolve(width > 0 && height > 0 ? { x, y, width, height } : null);
    });
  });

const unionRect = (rects) => {
  const valid = rects.filter(Boolean);
  if (valid.length === 0) return null;
  const left = Math.min(...valid.map((r) => r.x));
  const top = Math.min(...valid.map((r) => r.y));
  const right = Math.max(...valid.map((r) => r.x + r.width));
  const bottom = Math.max(...valid.map((r) => r.y + r.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
};

export const HomeTourProvider = ({ children }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);
  const targetsRef = useRef({});
  // 좌표 기준점: 앱 화면 전체를 감싸는 View (화면 맨 위 (0, 0)에 붙어 있다).
  // Android(Fabric)의 measureInWindow는 "상태바를 뺀 보이는 영역" 기준이라 edge-to-edge에서
  // y가 상태바 높이만큼 작게 나온다(RootShadowNode의 viewportOffset). 대상과 같은 트리에 있는
  // 기준점을 같이 재서 빼면 그 차이가 상쇄되어 "화면 맨 위 기준" 좌표가 된다.
  // 오버레이 Modal 안에서 재면 안 된다: Modal은 RootNodeKind라 viewportOffset이 붙지 않는다.
  // iOS는 기준점이 (0, 0)으로 나와 기존 동작과 같다.
  const anchorRef = useRef(null);
  const [stepIndex, setStepIndex] = useState(-1);
  // 어느 단계의 측정 결과인지 같이 들고 있어야 단계가 바뀌는 순간 이전 구멍이 비치지 않는다
  const [measured, setMeasured] = useState({ index: -1, rect: null });

  const register = useCallback((key, ref) => {
    targetsRef.current[key] = ref;
  }, []);

  const unregister = useCallback((key, ref) => {
    if (targetsRef.current[key] === ref) delete targetsRef.current[key];
  }, []);

  const start = useCallback(() => {
    dispatch(homeTourStarted());
    setMeasured({ index: -1, rect: null });
    setStepIndex(0);
  }, [dispatch]);

  // 건너뛰기와 끝까지 보기 모두 "봤음"으로 저장한다
  const finish = useCallback(async () => {
    setStepIndex(-1);
    dispatch(homeTourFinished());
    try {
      await AsyncStorage.setItem(homeTourDoneKey(userId), "true");
    } catch (e) {
      console.error("안내 완료 상태 저장 실패:", e?.message);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (stepIndex < 0) return;
    let cancelled = false;
    const keys = HOME_TOUR_STEPS[stepIndex].targets;
    Promise.all([
      measureNode(anchorRef),
      ...keys.map((key) => measureNode(targetsRef.current[key])),
    ]).then(([anchor, ...rects]) => {
      if (cancelled) return;
      const rect = unionRect(rects);
      const ox = anchor?.x ?? 0;
      const oy = anchor?.y ?? 0;
      setMeasured({
        index: stepIndex,
        rect: rect && { ...rect, x: rect.x - ox, y: rect.y - oy },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [stepIndex]);

  const value = useMemo(
    () => ({ register, unregister, start }),
    [register, unregister, start]
  );

  return (
    <TourContext.Provider value={value}>
      <View ref={anchorRef} collapsable={false} style={styles.anchor}>
        {children}
      </View>
      <TourOverlay
        visible={stepIndex >= 0}
        stepIndex={stepIndex}
        rect={measured.index === stepIndex ? measured.rect : undefined}
        onPrev={() => setStepIndex((i) => Math.max(0, i - 1))}
        onNext={() =>
          stepIndex >= HOME_TOUR_STEPS.length - 1
            ? finish()
            : setStepIndex((i) => i + 1)
        }
        onSkip={finish}
      />
    </TourContext.Provider>
  );
};

// 안내 대상 요소에 붙일 ref. Provider 밖(예: 테스트)에서는 그냥 빈 ref로 동작한다.
export const useTourTarget = (key) => {
  const ctx = useContext(TourContext);
  const ref = useRef(null);
  useEffect(() => {
    if (!ctx) return undefined;
    ctx.register(key, ref);
    return () => ctx.unregister(key, ref);
  }, [ctx, key]);
  return ref;
};

// 홈 화면에서 호출: 안내 요청이 있고, 홈이 보이고, 데이터 로딩이 끝나면 안내를 시작한다.
// 신규 가입 요청(replay=false)은 이 계정이 이미 봤다면 띄우지 않고 요청만 지운다.
export const useHomeTourAutoStart = (ready, onBeforeStart) => {
  const ctx = useContext(TourContext);
  const onBeforeStartRef = useRef(onBeforeStart);
  onBeforeStartRef.current = onBeforeStart;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const requested = useSelector((state) => state.tour.requested);
  const replay = useSelector((state) => state.tour.replay);
  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (!ctx || !requested || !ready || !isFocused) return undefined;
    let cancelled = false;
    let timer = null;

    const task = InteractionManager.runAfterInteractions(async () => {
      if (!replay) {
        let done = null;
        try {
          done = await AsyncStorage.getItem(homeTourDoneKey(userId));
        } catch (e) {
          // 읽기 실패 시에는 안내를 띄우는 쪽으로 (한 번 더 보는 편이 못 보는 것보다 낫다)
        }
        if (cancelled) return;
        if (done) {
          dispatch(homeTourFinished());
          return;
        }
      }
      onBeforeStartRef.current?.();
      // 화면 전환 애니메이션·레이아웃이 끝난 뒤에 재야 위치가 정확하다
      timer = setTimeout(() => {
        if (!cancelled) ctx.start();
      }, 300);
    });

    return () => {
      cancelled = true;
      task.cancel();
      if (timer) clearTimeout(timer);
    };
  }, [ctx, requested, replay, ready, isFocused, userId, dispatch]);
};

const TourOverlay = ({ visible, stepIndex, rect, onPrev, onNext, onSkip }) => {
  const [size, setSize] = useState(null);
  if (!visible) return null;

  const step = HOME_TOUR_STEPS[stepIndex];
  const isLast = stepIndex === HOME_TOUR_STEPS.length - 1;
  const ready = rect !== undefined && size !== null;

  const hole = rect
    ? {
        x: rect.x - HOLE_PADDING,
        y: rect.y - HOLE_PADDING,
        width: rect.width + HOLE_PADDING * 2,
        height: rect.height + HOLE_PADDING * 2,
      }
    : null;

  // 구멍이 화면 아래쪽에 있으면 말풍선을 위에, 위쪽에 있으면 아래에 둔다
  let bubblePosition = styles.bubbleCenter;
  if (hole && size) {
    const holeCenter = hole.y + hole.height / 2;
    bubblePosition =
      holeCenter > size.height / 2
        ? { bottom: size.height - hole.y + BUBBLE_GAP }
        : { top: hole.y + hole.height + BUBBLE_GAP };
  }

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      // Android edge-to-edge: Modal도 상태바·내비게이션 바 아래까지 그려야
      // measureInWindow 좌표(화면 맨 위 기준)와 오버레이 좌표가 일치한다
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onSkip}
    >
      <View
        style={styles.root}
        onLayout={(e) => setSize(e.nativeEvent.layout)}
      >
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Defs>
            <Mask id="tourHole">
              <Rect x="0" y="0" width="100%" height="100%" fill="white" />
              {ready && hole && (
                <Rect
                  x={hole.x}
                  y={hole.y}
                  width={hole.width}
                  height={hole.height}
                  rx={HOLE_RADIUS}
                  ry={HOLE_RADIUS}
                  fill="black"
                />
              )}
            </Mask>
          </Defs>
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.65)"
            mask="url(#tourHole)"
          />
        </Svg>

        {ready && hole && (
          <View
            pointerEvents="none"
            style={[
              styles.holeBorder,
              {
                left: hole.x,
                top: hole.y,
                width: hole.width,
                height: hole.height,
              },
            ]}
          />
        )}

        {ready && (
          <View style={[styles.bubble, bubblePosition]}>
            <View style={styles.bubbleHeader}>
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.counter}>
                {stepIndex + 1} / {HOME_TOUR_STEPS.length}
              </Text>
            </View>
            <Text style={styles.text}>{step.text}</Text>
            <View style={styles.buttonRow}>
              {isLast ? (
                <View />
              ) : (
                <TouchableOpacity onPress={onSkip} hitSlop={10}>
                  <Text style={styles.skipText}>건너뛰기</Text>
                </TouchableOpacity>
              )}
              <View style={styles.navButtons}>
                {stepIndex > 0 && (
                  <TouchableOpacity
                    onPress={onPrev}
                    style={[styles.navButton, styles.prevButton]}
                  >
                    <Text style={[styles.navText, styles.prevText]}>이전</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onNext} style={styles.navButton}>
                  <Text style={styles.navText}>
                    {isLast ? "시작하기" : "다음"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  anchor: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
  holeBorder: {
    position: "absolute",
    borderRadius: HOLE_RADIUS,
    borderWidth: 2,
    borderColor: "#fff",
  },
  bubble: {
    position: "absolute",
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: { elevation: 8 },
    }),
  },
  bubbleCenter: {
    top: "35%",
  },
  bubbleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "nanumSquareEB",
    fontSize: normalizeFont(18),
    letterSpacing: -0.5,
    color: colors.purple,
  },
  counter: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(13),
    color: colors.lightPurple,
  },
  text: {
    fontFamily: "nanumSquareR",
    fontSize: normalizeFont(16),
    lineHeight: normalizeFont(24),
    letterSpacing: -0.5,
    color: "#2E2B1C",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  skipText: {
    fontFamily: "nanumSquareB",
    fontSize: normalizeFont(15),
    color: colors.lightPurple,
    textDecorationLine: "underline",
  },
  navButtons: {
    flexDirection: "row",
    gap: 8,
  },
  navButton: {
    backgroundColor: colors.purple,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  prevButton: {
    backgroundColor: colors.backgroundPurple,
  },
  navText: {
    fontFamily: "nanumSquareEB",
    fontSize: normalizeFont(15),
    color: "#fff",
  },
  prevText: {
    color: colors.purple,
  },
});
