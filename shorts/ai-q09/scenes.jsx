import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
const fadeA = (d = 0.25) => [{ property: "opacity", from: 0, to: 1, at: 0, duration: d }];
const Rev = ({ at, d, x, w, dd, children }) => { const T = dd * 1080 / Math.max(10, w); const a0 = Math.max(0, at - T * x / 1080);
  const len = Math.max(0.3, d - a0);
  return <frame at={a0} duration={len} width={1080} height={1920} layout="none" reveal={{ from: "left", at: 0, duration: Math.min(T, len - 0.03), easing: "linear" }}>{children}</frame>; };
const Xm = ({ x, y, size = 64, at, out, dur, color }) => { const h = size / 2; return <Layer at={at} dur={dur} out={out} anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.1 }, { property: "scale", from: 0.55, to: 1, at: 0, duration: 0.3, easing: "bounce" }]} sfx="wrong"><path d={`M ${x - h} ${y - h} L ${x + h} ${y + h} M ${x + h} ${y - h} L ${x - h} ${y + h}`} x={0} y={0} width={1080} height={1920} stroke={{ width: 20, color, cap: "round" }} /></Layer>; };
const Hi = ({ C, x, y, w, h, at, out, dur }) => <Layer at={at} dur={dur} out={out} anim={fadeA(0.2)} sfx="ping"><rect x={x} y={y} width={w} height={h} radius={14} fill="#00000000" strokeColor={C.coral} strokeWidth={9} /></Layer>;
// state-space landscape as bars: height = score
const BX = i => 140 + i * 100, BASE = 1000, UNIT = 48, top = s => BASE - s * UNIT;
const Bars = ({ C, d, scores, at = 0, step = 0.07, hot = [], k = "b" }) => scores.flatMap((s, i) => {
  const t = at + i * step;
  return [
    <Layer key={k + "r" + i} at={t} dur={d} anim={fadeA(0.2)} sfx="pop">
      <rect x={BX(i) - 42} y={top(s)} width={84} height={s * UNIT} radius={8} fill={hot.includes(i) ? C.coral : C.cobalt} strokeColor={C.navy} strokeWidth={4} />
    </Layer>,
    <Box key={k + "c" + i} dur={d} x={BX(i)} y={BASE + 60} w={80} h={70} label={String(s)} size={44} at={t} tone={hot.includes(i) ? "hot" : "a"} />,
  ];
});
const PL = [2, 4, 6, 6, 6, 6, 6, 9, 5];   // plateau landscape: idx 2..6 flat, real peak at idx 7
const HILL = [2, 3, 5, 7, 9, 8, 6, 4, 2];
// bot hopping over bars: steps = [[landingTime, barIndex, mood, look]]
const botPts = (sc, t0, i0, steps, mood0 = "idle") => {
  const P = (t, i, mood, look, dy = 0) => ({ t, x: BX(i), y: top(sc[i]) - 62 - dy, mood: mood || "think", look: look || [0, 0] });
  const out = [P(t0, i0, mood0)]; let pi = i0, pt = t0;
  steps.forEach(([t, i, mood, look]) => {
    if (t - 0.5 > pt + 0.02) out.push(P(t - 0.5, pi, out[out.length - 1].mood, out[out.length - 1].look));
    out.push({ t: t - 0.22, x: (BX(pi) + BX(i)) / 2, y: Math.min(top(sc[pi]), top(sc[i])) - 62 - 60, mood: mood || "think", look: look || [0, 0] });
    out.push(P(t, i, mood, look)); pi = i; pt = t; });
  return out;
};
const hillY = x => 1000 - 420 * Math.exp(-Math.pow((x - 640) / 250, 2));
const hillD = Array.from({ length: 47 }, (_, i) => 80 + i * 20).map((x, i) => (i ? "L " : "M ") + x + " " + hillY(x).toFixed(1)).join(" ");
const hp = (t, x, mood, look) => ({ t, x, y: hillY(x) - 72, mood, look });
// tiny landscape thumbnails (260x180 box at x0,y0)
const Thumb = ({ C, x0, y0, pts, color, at, dur }) => <Layer at={at} dur={dur} anim={fadeA(0.3)} sfx="pop">
  <path d={pts.map((p, i) => (i ? "L " : "M ") + (x0 + p[0]) + " " + (y0 + p[1])).join(" ")} x={0} y={0} width={1080} height={1920} stroke={{ width: 9, color, cap: "round" }} />
</Layer>;

export const SCENES = ({ S, ctx, C }) => [
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "What is a plateau in hill climbing?", n: 9, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "plateau", x: 540, y: 780, z: 1.06 }] }),

  // from zero: climbing a hill in fog
  S("let's start", (r, d) => [
    <Head dur={d} text="from zero" y={170} size={130} sub="a hill in thick fog" at={0.1} />,
    <Rev at={r("hill")} d={d} x={80} w={920} dd={1.2}><path d={hillD} x={0} y={0} width={1080} height={1920} stroke={{ width: 10, color: C.cobalt, cap: "round" }} /></Rev>,
    <Layer at={r("fog")} dur={d} anim={fadeA(0.7)}>
      <rect x={430} y={500} width={440} height={170} radius={85} fill={C.navy} opacity={0.2} />
      <rect x={520} y={610} width={420} height={150} radius={75} fill={C.navy} opacity={0.2} />
      <rect x={380} y={630} width={400} height={140} radius={70} fill={C.navy} opacity={0.2} />
    </Layer>,
    <Label dur={d} text="can't see the top" x={330} y={520} w={560} size={44} color={C.coral} at={r("cannot")} />,
    <Ring dur={d} x={320} y={hillY(320) - 40} r={105} at={r("feel")} />,
    <Label dur={d} text="only the ground at your feet" x={540} y={1130} w={900} size={42} at={r("feel") + 0.2} out={r("rule")} />,
    <Label dur={d} text="rule: step to the higher spot" x={540} y={1130} w={900} size={50} color={C.coral} at={r("rule")} />,
    <Label dur={d} text="this is hill climbing" x={540} y={1260} w={900} size={64} at={r("hill climbing")} />,
    <Mascot dur={d} size={130} at={r("fog") - 0.3} pts={[hp(r("fog") - 0.3, 200, "idle", [1, -0.5]), hp(r("higher") - 0.4, 200, "think", [1, 0]), hp(r("higher") + 0.3, 320, "think", [1, -0.3]), hp(r("keep"), 320, "think", [1, -0.3]), hp(r("keep") + 0.6, 430, "think", [1, -0.5]), hp(r("keep") + 1.1, 540, "think", [1, -0.6]), hp(r("keep") + 1.6, 640, "think", [0, -1]), hp(r("that is hill"), 640, "happy", [0, -1])]} />,
  ], { hold: "that is hill", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "fog", x: 540, y: 880, z: 1.03 }, { t: "keep", x: 540, y: 860, z: 1.04 }] }),

  // in AI: states have scores
  S("in ai", (r, d) => [
    <Head dur={d} text="evaluation value" y={170} size={100} sub="every state has a score" at={0.1} />,
    ...Bars({ C, d, scores: HILL, at: r("state"), step: 0.09, k: "h" }),
    <Label dur={d} text="score of each state" x={540} y={1150} w={800} size={44} color={C.coral} at={r("evaluation")} />,
    <Mascot dur={d} size={110} at={r("algorithm")} pts={botPts(HILL, r("algorithm"), 1, [[r("moves") + 0.4, 2], [r("moves") + 1.0, 3], [r("better") + 0.3, 4, "happy", [0, 0]]])} />,
  ], { hold: "better", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "evaluation", x: 540, y: 880, z: 1.03 }, { t: "moves", x: 540, y: 860, z: 1.04 }] }),

  // what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 480, size: 80, w: 960 },
      { text: "1.  what a plateau is", x: 130, y: 680, size: 56, w: 880, align: "left", at: r("what") },
      { text: "2.  why it is a problem", x: 130, y: 830, size: 56, w: 880, align: "left", at: r("why") },
      { text: "3.  how we fix it", x: 130, y: 980, size: 56, w: 880, align: "left", at: r("how") }] }),
    <Check dur={d} x={80} y={715} size={70} at={r("what") + 1.0} />,
    <Check dur={d} x={80} y={865} size={70} at={r("why") + 1.0} />,
    <Check dur={d} x={80} y={1015} size={70} at={r("how") + 1.0} />,
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "how", x: 540, y: 860, z: 1.05 }] }),

  // what a plateau is
  S("a plateau is a flat", (r, d) => [
    <Head dur={d} text="plateau" y={170} size={140} sub="a flat area, same score" at={0.1} />,
    ...Bars({ C, d, scores: PL, at: 0.15, step: 0.07, k: "p" }),
    <Hi key="a" C={C} dur={d} x={288} y={688} w={504} h={326} at={r("flat")} />,
    <Hi key="b" C={C} dur={d} x={288} y={1020} w={504} h={86} at={r("same")} />,
    <Label dur={d} text="plateau" x={540} y={440} w={500} size={60} color={C.coral} at={r("area")} />,
    <Label dur={d} text="same height" x={BX(3)} y={540} w={300} size={40} at={r("left") + 0.9} out={r("right") + 0.2} />,
    <Label dur={d} text="same height" x={BX(5)} y={540} w={300} size={40} at={r("right") + 0.9} />,
    <Mascot dur={d} size={110} at={r("step") - 0.3} pts={botPts(PL, r("step") - 0.3, 4, [[r("left") + 0.4, 3, "think", [-1, 0]], [r("right") + 0.1, 4, "think", [0, 0]], [r("right") + 0.5, 5, "think", [1, 0]]])} />,
  ], { hold: "right", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "flat", x: 540, y: 880, z: 1.03 }, { t: "step", x: 540, y: 860, z: 1.04 }] }),

  // why it is a problem
  S("so here's the problem", (r, d) => [
    <Head dur={d} text="the problem" y={170} size={130} at={0.1} />,
    ...Bars({ C, d, scores: PL, at: 0.15, step: 0.03, k: "q" }),
    <Label dur={d} text="no uphill step" x={540} y={400} w={700} size={56} color={C.coral} at={r("uphill")} out={r("wanders")} />,
    <Xm dur={d} x={BX(3)} y={580} size={64} color={C.coral} at={r("uphill") + 0.3} out={r("wanders")} />,
    <Xm dur={d} x={BX(5)} y={580} size={64} color={C.coral} at={r("uphill") + 0.5} out={r("wanders")} />,
    <Label dur={d} text="which way?" x={540} y={480} w={600} size={50} at={r("direction")} out={r("wanders")} />,
    <Label dur={d} text="I'm done!" x={540} y={430} w={600} size={56} at={r("believing")} out={r("real")} />,
    <Ring dur={d} x={BX(7)} y={top(9)} r={70} at={r("real")} />,
    <Label dur={d} text="the real peak" x={BX(7)} y={400} w={420} size={46} color={C.coral} at={r("real")} />,
    <Arrow dur={d} x1={590} y1={620} x2={BX(7) - 60} y2={top(9) - 20} at={r("beyond")} color={C.coral} />,
    <Mascot dur={d} size={110} at={0.2} pts={[...botPts(PL, 0.2, 4, [[r("wanders") + 0.3, 3, "think", [-1, 0]], [r("wanders") + 0.7, 5, "think", [1, 0]], [r("wanders") + 1.1, 2, "think", [-1, 0]], [r("wanders") + 1.5, 6, "think", [1, 0]], [r("stops") - 0.1, 4, "idle", [0, 0]]]), { t: r("believing"), x: BX(4), y: top(6) - 62, mood: "happy", look: [0, 0] }, { t: r("real"), x: BX(4), y: top(6) - 62, mood: "shock", look: [1, -0.6] }]} />,
  ], { hold: "flat", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "direction", x: 540, y: 880, z: 1.03 }, { t: "stops", x: 540, y: 860, z: 1.04 }, { t: "real", x: 540, y: 880, z: 1.03 }] }),

  // three trouble spots
  S("a plateau is one", (r, d) => [
    <Head dur={d} text="3 trouble spots" y={170} size={110} at={0.1} />,
    <Thumb C={C} dur={d} x0={80} y0={520} color={C.coral} at={r("plateau") + 0.2} pts={[[0, 180], [60, 70], [200, 70], [260, 0]]} />,
    <Box dur={d} x={210} y={830} w={290} h={110} label="plateau" tone="hot" size={44} at={r("plateau") + 0.3} />,
    <Thumb C={C} dur={d} x0={410} y0={520} color={C.cobalt} at={r("local")} pts={[[0, 180], [60, 70], [110, 120], [190, 10], [260, 180]]} />,
    <Box dur={d} x={540} y={830} w={290} h={110} label="local maximum" tone="b" size={36} at={r("local") + 0.1} />,
    <Thumb C={C} dur={d} x0={740} y0={520} color={C.cobalt} at={r("ridge")} pts={[[0, 180], [40, 120], [60, 140], [110, 85], [130, 105], [180, 50], [200, 70], [260, 0]]} />,
    <Box dur={d} x={870} y={830} w={290} h={110} label="ridge" tone="b" size={44} at={r("ridge") + 0.1} />,
  ], { hold: "ridge", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "local", x: 540, y: 880, z: 1.04 }] }),

  // fix 1: sideways moves with a limit
  S("now the fixes", (r, d) => [
    <Head dur={d} text="fix 1" y={170} size={130} sub="sideways moves, with a limit" at={0.1} />,
    ...Bars({ C, d, scores: PL, at: 0.15, step: 0.03, k: "f" }),
    ...[0, 1, 2, 3, 4].map(i => <Box key={"t" + i} dur={d} x={340 + i * 110} y={1245} w={96} h={70} label={String(i + 1)} tone="hot" size={40} at={r("allow") + 0.2 + i * 0.08} out={i < 3 ? r("allow") + 0.5 + i * 0.8 : undefined} />),
    <Label dur={d} text="sideways moves allowed" x={540} y={1122} w={800} size={44} at={r("limit")} />,
    <Label dur={d} text="the limit stops endless wandering" x={540} y={1330} w={940} size={44} color={C.coral} at={r("never")} />,
    <Mascot dur={d} size={110} at={0.2} pts={botPts(PL, 0.2, 3, [[r("allow") + 0.5, 4, "think", [1, 0]], [r("allow") + 1.3, 5, "think", [1, 0]], [r("allow") + 2.1, 6, "think", [1, -0.4]], [r("allow") + 2.9, 7, "happy", [0, 0]]])} />,
  ], { hold: "forever", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "allow", x: 540, y: 890, z: 1.03 }, { t: "limit", x: 540, y: 920, z: 1.04 }] }),

  // fix 2: big random jump
  S("take a big", (r, d) => [
    <Head dur={d} text="fix 2" y={170} size={130} sub="a big random jump" at={0.1} />,
    ...Bars({ C, d, scores: PL, at: 0.15, step: 0.03, k: "j" }),
    <Hi key="j" C={C} dur={d} x={288} y={688} w={504} h={326} at={r("flat")} />,
    <Label dur={d} text="leave the flat area" x={540} y={1160} w={800} size={46} color={C.coral} at={r("leave")} />,
    <Mascot dur={d} size={110} at={0.2} pts={[...botPts(PL, 0.2, 4, []), { t: r("random") + 0.2, x: BX(4), y: top(6) - 62, mood: "think", look: [0, -1] }, { t: r("jump") + 0.15, x: 690, y: 440, mood: "shock", look: [1, 0] }, { t: r("jump") + 0.5, x: BX(7), y: top(9) - 62, mood: "happy", look: [0, 0] }]} />,
  ], { hold: "area", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "jump", x: 540, y: 880, z: 1.04 }] }),

  // fix 3: random restart
  S("random restart", (r, d) => [
    <Head dur={d} text="fix 3" y={170} size={130} sub="restart, keep the best" at={0.1} />,
    ...Bars({ C, d, scores: PL, at: 0.15, step: 0.03, k: "x" }),
    <Box dur={d} x={300} y={1230} w={400} h={100} label="run 1: 6" size={44} at={r("begin") - 0.3} />,
    <Box dur={d} x={760} y={1230} w={380} h={100} label="run 2: 9" tone="hot" size={44} at={r("place") + 0.9} />,
    <Check dur={d} x={985} y={1230} size={60} at={r("best")} />,
    <Label dur={d} text="keep the best: 9" x={540} y={1340} w={800} size={50} color={C.coral} at={r("keep")} />,
    <Mascot dur={d} size={110} at={0.2} pts={botPts(PL, 0.2, 0, [[0.55, 1, "think", [1, 0]], [0.9, 2, "think", [1, 0]], [1.25, 3, "sad", [1, 0]], [r("new") + 0.2, 8, "think", [-1, 0]], [r("place") + 0.6, 7, "happy", [0, -1]]])} />,
  ], { hold: "result", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "new", x: 540, y: 890, z: 1.03 }, { t: "keep", x: 540, y: 920, z: 1.04 }] }),

  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 42, title: "WRITE THIS · 5 MARKS", points: [
      "A plateau is a flat area where neighbouring states have equal evaluation values.",
      "No uphill move is visible, so the search wanders or stops.",
      "Fixes: sideways moves with a limit, big random jumps, random restart."],
      times: [r("a plateau"), r("no uphill"), r("fixes")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  S("to remember", (r, d) => [
    <Head dur={d} text="remember" y={170} size={120} at={0.05} />,
    ...Sketch({ dur: d, at: 0.4, items: [
      { text: "flat means blind", x: 540, y: 520, size: 100, w: 960, at: r("flat") - 0.3 },
      { line: [140, 700, 940, 700], color: C.coral },
      { text: "5 marks", x: 540, y: 860, size: 140, w: 900, color: C.coral, at: r("marks") }] }),
    <Check dur={d} x={540} y={1250} size={170} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.02 }, { t: "marks", x: 540, y: 900, z: 1.06 }] }),
];
