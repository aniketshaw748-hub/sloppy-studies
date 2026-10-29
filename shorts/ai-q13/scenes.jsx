import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
const popA = (at = 0) => [{ property: "opacity", from: 0, to: 1, at, duration: 0.15 }, { property: "scale", from: 0.6, to: 1, at, duration: 0.3, easing: "bounce" }];
const fadeA = (d = 0.25) => [{ property: "opacity", from: 0, to: 1, at: 0, duration: d }];
const fillOf = (C, col) => col === "red" ? C.coral : col === "green" ? C.cobalt : col === "blue" ? C.navy : C.chip;
const Region = ({ C, x, y, r = 78, label, col, at = 0, out, dur }) => {
  bb({ k: "box", n: "region " + label + (col || ""), x: x - r, y: y - r, w: 2 * r + 9, h: 2 * r + 9, t0: at, t1: out ?? dur });
  return <Layer at={at} dur={dur} out={out} anim={popA(0)} sfx="pop">
    <rect x={x - r} y={y - r} width={2 * r} height={2 * r} radius={r} fill={fillOf(C, col)} strokeColor={C.navy} strokeWidth={5} />
    <text x={x - r} y={y - (col ? 54 : 36)} width={2 * r} align="center" fontFamily={C.fBody} fontWeight={C.wBody} fontSize={col ? 60 : 72} color={col ? C.ink : C.navy}>{label}</text>
    {col ? <text x={x - r} y={y + 8} width={2 * r} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={36} color={C.ink}>{col}</text> : null}
  </Layer>;
};
const Edge = ({ a, b, r = 78, at, dur }) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
  return <Arrow x1={a[0] + ux * (r + 4)} y1={a[1] + uy * (r + 4)} x2={b[0] - ux * (r + 4)} y2={b[1] - uy * (r + 4)} at={at} dur={dur} head={false} width={7} />; };
const Chip = ({ C, x, y, w = 220, h = 80, text, col, at = 0, dur }) => {
  bb({ k: "box", n: "chip " + text, x: x - w / 2, y: y - h / 2, w: w + 9, h: h + 9, t0: at, t1: dur });
  return <Layer at={at} dur={dur} anim={popA(0)} sfx="pop">
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} radius={14} fill={fillOf(C, col)} strokeColor={C.navy} strokeWidth={4} />
    <text x={x - w / 2} y={y - 22} width={w} align="center" fontFamily={C.fBody} fontWeight={C.wBody} fontSize={46} color={C.ink}>{text}</text>
  </Layer>; };
// domain table: one row per variable, chips = the values still allowed
const RY = { A: 420, B: 620, C: 820, D: 1020 }, CX = { red: 330, green: 530, blue: 730 };
const DChip = ({ C, x, y, col, at, dur, w = 170, h = 96 }) => {
  bb({ k: "box", n: "dom " + col + y, x: x - w / 2, y: y - h / 2, w: w + 9, h: h + 9, t0: at, t1: dur });
  return <Layer at={at} dur={dur} anim={popA(0)} sfx="pop">
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} radius={14} fill={fillOf(C, col)} strokeColor={C.navy} strokeWidth={4} />
    <text x={x - w / 2} y={y - 26} width={w} align="center" fontFamily={C.fBody} fontWeight={C.wBody} fontSize={46} color={C.ink}>{col}</text>
  </Layer>; };
const Cross = ({ C, x, y, at, dur, w = 170, h = 96 }) => <Layer at={at} dur={dur} anim={fadeA(0.25)} sfx="wrong">
  <rect x={x - w / 2} y={y - h / 2} width={w} height={h} radius={14} fill={C.paper} opacity={0.72} />
  <path d={`M ${x - 40} ${y - 30} L ${x + 40} ${y + 30} M ${x + 40} ${y - 30} L ${x - 40} ${y + 30}`} x={0} y={0} width={1080} height={1920} stroke={{ width: 14, color: C.coral, cap: "round" }} />
</Layer>;
const Rows = ({ C, d, at = 0.2, step = 0.06, k = "r", only = {} }) => ["A", "B", "C", "D"].flatMap((n, i) => {
  const cols = n === "D" ? ["blue"] : ["red", "green", "blue"]; const t = at + i * step;
  return [<Box key={k + n} dur={d} x={130} y={RY[n]} w={120} h={100} label={n} tone="a" size={56} at={t} />,
    ...cols.map((c, j) => <DChip key={k + n + c} C={C} dur={d} x={CX[c]} y={RY[n]} col={c} at={t + 0.08 + j * 0.06} />)];
});

export const SCENES = ({ S, ctx, C }) => [
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Explain backtracking search and constraint propagation in CSP.", n: 13, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "propagation", x: 540, y: 780, z: 1.06 }] }),

  // from zero: a CSP on a map
  S("let's start", (r, d) => {
    const A = [250, 780], B = [520, 560], Cc = [520, 1000], D = [820, 1000];
    return [
      <Head dur={d} text="a CSP" y={150} size={90} at={0.1} />,
      <Box dur={d} x={180} y={330} w={270} h={100} label="variables" tone="hot" size={36} at={r("variables")} />,
      <Box dur={d} x={540} y={330} w={270} h={100} label="domains" tone="b" size={36} at={r("domains")} />,
      <Box dur={d} x={900} y={330} w={270} h={100} label="constraints" tone="a" size={36} at={r("constraints")} />,
      <Edge key="e1" a={A} b={B} dur={d} at={r("neighbors")} />, <Edge key="e2" a={A} b={Cc} dur={d} at={r("neighbors") + 0.25} />, <Edge key="e3" a={B} b={Cc} dur={d} at={r("neighbors") + 0.5} />, <Edge key="e4" a={Cc} b={D} dur={d} at={r("neighbors") + 0.75} />,
      <Region key="nA" C={C} dur={d} x={A[0]} y={A[1]} label="A" at={r("regions") + 1.0} />,
      <Region key="nB" C={C} dur={d} x={B[0]} y={B[1]} label="B" at={r("regions") + 1.4} />,
      <Region key="nC" C={C} dur={d} x={Cc[0]} y={Cc[1]} label="C" at={r("regions") + 1.9} />,
      <Region key="nD" C={C} dur={d} x={D[0]} y={D[1]} label="D" at={r("regions") + 2.5} out={r("fixed") + 0.4} />,
      <Region key="cD" C={C} dur={d} x={D[0]} y={D[1]} label="D" col="blue" at={r("fixed") + 0.4} />,
      <Chip key="k1" C={C} dur={d} x={270} y={1200} text="red" col="red" at={r("red")} />,
      <Chip key="k2" C={C} dur={d} x={540} y={1200} text="green" col="green" at={r("green")} />,
      <Chip key="k3" C={C} dur={d} x={810} y={1200} text="blue" col="blue" at={r("blue")} />,
      <Label dur={d} text="neighbours must differ" x={540} y={1300} w={900} size={48} color={C.coral} at={r("neighbors")} />,
    ];
  }, { hold: "fixed", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "regions", x: 540, y: 870, z: 1.0 }, { t: "neighbors", x: 540, y: 900, z: 1.0 }] }),

  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  backtracking search", x: 130, y: 720, size: 58, w: 880, align: "left", at: r("backtracking") },
      { text: "2.  constraint propagation", x: 130, y: 880, size: 58, w: 880, align: "left", at: r("propagation") }] }),
    <Check dur={d} x={80} y={760} size={70} at={r("backtracking") + 1.3} />,
    <Check dur={d} x={80} y={920} size={70} at={r("propagation") + 1.3} />,
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "propagation", x: 540, y: 860, z: 1.05 }] }),

  // backtracking: the maze, then try-check-undo
  S("first backtracking", (r, d) => [
    <Head dur={d} text="backtracking" y={150} size={90} sub="depth-first search" at={0.1} />,
    ...Sketch({ dur: d, at: r("maze"), speed: 2800, items: [{ line: [150, 640, 400, 640] }, { line: [400, 640, 650, 500] }, { line: [650, 500, 900, 500] }, { line: [400, 640, 650, 780] }, { line: [650, 780, 900, 780] }] }),
    <Label dur={d} text="dead end" x={790} y={530} w={300} size={42} color={C.coral} at={r("dead") + 0.3} />,
    <XMark dur={d} x={935} y={500} size={64} at={r("dead") + 0.5} />,
    <Label dur={d} text="last fork" x={400} y={690} w={260} size={40} at={r("fork")} />,
    <Ico dur={d} ctx={ctx} name="flag" x={950} y={855} size={90} color={C.coral} at={r("pick") + 0.9} />,
    <Mascot dur={d} size={110} at={r("maze") + 0.2} pts={[{ t: r("maze") + 0.2, x: 150, y: 568, look: [1, 0], mood: "idle" }, { t: r("maze") + 0.8, x: 400, y: 568, look: [1, 0], mood: "think" }, { t: r("maze") + 1.4, x: 650, y: 428, look: [1, 0], mood: "think" }, { t: r("dead") + 0.5, x: 900, y: 428, look: [1, 0], mood: "shock" }, { t: r("walk") + 0.2, x: 900, y: 428, look: [-1, 0], mood: "sad" }, { t: r("fork") + 0.2, x: 400, y: 568, look: [1, 0.4], mood: "think" }, { t: r("pick") + 0.5, x: 650, y: 708, look: [1, 0], mood: "think" }, { t: r("pick") + 0.9, x: 900, y: 708, look: [1, 0], mood: "happy" }]} />,
    <Box dur={d} x={200} y={1150} w={270} h={110} label="fill a variable" tone="a" size={34} at={r("fills")} />,
    <Arrow dur={d} x1={340} y1={1150} x2={400} y2={1150} at={r("checks") - 0.3} color={C.cobalt} />,
    <Box dur={d} x={540} y={1150} w={270} h={110} label="check the rules" tone="b" size={34} at={r("checks")} />,
    <Arrow dur={d} x1={680} y1={1150} x2={740} y2={1150} at={r("undoes") - 0.4} color={C.cobalt} />,
    <Label dur={d} text="rule broken" x={710} y={1030} w={300} size={36} color={C.coral} at={r("undoes") - 0.4} />,
    <Box dur={d} x={880} y={1150} w={270} h={110} label="undo last choice" tone="hot" size={34} at={r("undoes")} />,
    <Arrow dur={d} x1={880} y1={1210} x2={880} y2={1290} head={false} at={r("undoes") + 0.5} color={C.coral} />,
    <Arrow dur={d} x1={880} y1={1290} x2={200} y2={1290} head={false} at={r("undoes") + 0.7} color={C.coral} />,
    <Arrow dur={d} x1={200} y1={1290} x2={200} y2={1215} at={r("undoes") + 0.9} color={C.coral} />,
  ], { hold: "choice", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "maze", x: 540, y: 820, z: 1.03 }, { t: "fills", x: 540, y: 960, z: 1.03 }] }),

  // watch: backtracking on the map problem
  S("watch", (r, d) => {
    const L = 250, R_ = 760, Y = [340, 520, 700, 880];
    return [
      <Head dur={d} text="backtracking" y={150} size={90} at={0.1} />,
      <Arrow key="la" dur={d} x1={L} y1={Y[0] + 50} x2={L} y2={Y[1] - 50} head={false} at={r("green") - 0.3} />,
      <Arrow key="lb" dur={d} x1={L} y1={Y[1] + 50} x2={L} y2={Y[2] - 50} head={false} at={r("blue")} />,
      <Arrow key="lc" dur={d} x1={L} y1={Y[2] + 50} x2={L} y2={Y[3] - 50} head={false} at={r("but") + 0.3} />,
      <Arrow key="ra" dur={d} x1={L + 120} y1={Y[0] + 50} x2={R_ - 60} y2={Y[1] - 50} head={false} at={r("tries") - 0.2} />,
      <Arrow key="rb" dur={d} x1={R_} y1={Y[1] + 50} x2={R_} y2={Y[2] - 50} head={false} at={r("takes")} />,
      <Arrow key="rc" dur={d} x1={R_} y1={Y[2] + 50} x2={R_} y2={Y[3] - 50} head={false} at={r("stays")} />,
      <Box dur={d} x={L} y={Y[0]} w={300} h={100} label="A = red" tone="a" size={44} at={r("gets red")} />,
      <Box dur={d} x={L} y={Y[1]} w={300} h={100} label="B = green" tone="a" size={44} at={r("green") - 0.2} />,
      <Box dur={d} x={L} y={Y[2]} w={300} h={100} label="C = blue" tone="a" size={44} at={r("blue")} />,
      <Box dur={d} x={L} y={Y[3]} w={300} h={100} label="D = blue" tone="hot" size={44} at={r("but") + 0.3} />,
      <XMark dur={d} x={L + 205} y={Y[3]} size={70} at={r("dead")} />,
      <Label dur={d} text="C and D both blue: clash" x={330} y={Y[3] + 75} w={560} size={38} color={C.coral} at={r("dead") - 0.5} />,
      <Box dur={d} x={R_} y={Y[1]} w={300} h={100} label="B = blue" tone="a" size={44} at={r("tries")} />,
      <Box dur={d} x={R_} y={Y[2]} w={300} h={100} label="C = green" tone="a" size={44} at={r("takes")} />,
      <Box dur={d} x={R_} y={Y[3]} w={300} h={100} label="D = blue" tone="hot" size={44} at={r("stays")} />,
      <Check dur={d} x={R_ + 205} y={Y[3]} size={70} at={r("stays") + 0.6} />,
      <Label dur={d} text="try · check · undo" x={540} y={1070} w={900} size={66} color={C.coral} at={r("try")} />,
      <Mascot dur={d} size={110} at={r("gets red")} pts={[{ t: r("gets red"), x: 545, y: Y[0], look: [-1, 0], mood: "think" }, { t: r("green") - 0.2, x: 545, y: Y[1], look: [-1, 0], mood: "think" }, { t: r("blue"), x: 545, y: Y[2], look: [-1, 0], mood: "think" }, { t: r("but") + 0.3, x: 545, y: Y[3], look: [-1, 0], mood: "think" }, { t: r("dead"), x: 545, y: Y[3], look: [-1, 0], mood: "shock" }, { t: r("back"), x: 545, y: Y[2], look: [-1, 0], mood: "sad" }, { t: r("again"), x: 545, y: Y[1], look: [-1, 0], mood: "sad" }, { t: r("tries"), x: 545, y: Y[1], look: [1, 0], mood: "think" }, { t: r("takes"), x: 545, y: Y[2], look: [1, 0], mood: "think" }, { t: r("stays"), x: 545, y: Y[3], look: [1, 0], mood: "happy" }]} />,
    ];
  }, { hold: "undo", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "blue", x: 540, y: 880, z: 1.03 }, { t: "dead", x: 540, y: 900, z: 1.04 }, { t: "tries", x: 540, y: 880, z: 1.03 }] }),

  // propagation: cross values out of domains early
  S("constraint propagation finds", (r, d) => [
    <Head dur={d} text="propagation" y={150} size={90} sub="cross values out early" at={0.1} />,
    ...Rows({ C, d, at: r("crossing") - 0.2, step: 0.35, k: "a" }),
    <Label dur={d} text="values still allowed" x={540} y={1150} w={900} size={46} at={r("domains")} />,
    <Label dur={d} text="before we try them" x={540} y={1240} w={900} size={52} color={C.coral} at={r("before")} />,
  ], { hold: "them", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "crossing", x: 540, y: 900, z: 1.03 }] }),

  S("d can only", (r, d) => [
    <Head dur={d} text="arc consistency" y={150} size={90} at={0.1} />,
    ...Rows({ C, d, at: 0.2, step: 0.05, k: "b" }),
    <Arrow dur={d} x1={130} y1={872} x2={130} y2={968} at={r("touches")} color={C.cobalt} />,
    <Label dur={d} text="C touches D" x={420} y={910} w={400} size={38} at={r("touches")} out={r("consistency")} />,
    <Cross C={C} dur={d} x={CX.blue} y={RY.C} at={r("cross") + 0.3} />,
    <Label dur={d} text="arc consistency" x={540} y={1150} w={900} size={60} color={C.coral} at={r("consistency")} />,
    <Arrow dur={d} x1={CX.red} y1={872} x2={690} y2={970} at={r("partner")} color={C.coral} />,
    <Arrow dur={d} x1={CX.green} y1={872} x2={705} y2={970} at={r("partner") + 0.2} color={C.coral} />,
    <Label dur={d} text="every value needs a partner that fits" x={540} y={1240} w={980} size={44} at={r("every")} />,
  ], { hold: "fits", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "touches", x: 540, y: 920, z: 1.03 }, { t: "consistency", x: 540, y: 930, z: 1.04 }] }),

  S("now a takes", (r, d) => [
    <Head dur={d} text="no backtracking" y={150} size={90} at={0.1} />,
    ...Rows({ C, d, at: 0.2, step: 0.05, k: "c" }),
    <Cross C={C} dur={d} x={CX.blue} y={RY.C} at={0.7} />,
    <Label dur={d} text="A = red" x={925} y={RY.A - 28} w={200} size={42} color={C.coral} at={r("red") + 0.3} />,
    <Cross C={C} dur={d} x={CX.red} y={RY.B} at={r("leaves") - 0.1} />,
    <Cross C={C} dur={d} x={CX.red} y={RY.C} at={r("leaves") + 0.1} />,
    <Label dur={d} text="C = green" x={925} y={RY.C - 28} w={200} size={42} color={C.coral} at={r("only") + 0.3} />,
    <Cross C={C} dur={d} x={CX.green} y={RY.B} at={r("green") + 0.8} />,
    <Label dur={d} text="B = blue" x={925} y={RY.B - 28} w={200} size={42} color={C.coral} at={r("blue") + 0.1} />,
    <Label dur={d} text="D = blue" x={925} y={RY.D - 28} w={200} size={42} color={C.coral} at={r("decided")} />,
    <Check dur={d} x={540} y={1210} size={120} at={r("decided") + 0.2} />,
    <Label dur={d} text="all decided, no backtracking" x={540} y={1300} w={960} size={50} color={C.coral} at={r("backtracking") - 0.2} />,
  ], { hold: "backtracking", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "leaves", x: 540, y: 900, z: 1.03 }, { t: "green", x: 540, y: 920, z: 1.04 }] }),

  // together
  S("together", (r, d) => [
    <Head dur={d} text="together" y={170} size={110} at={0.1} />,
    <Box dur={d} x={130} y={620} w={120} h={100} label="C" tone="a" size={56} at={0.4} />,
    ...["red", "green", "blue"].map((c, i) => <DChip key={"t" + c} C={C} dur={d} x={CX[c]} y={620} col={c} at={0.5 + i * 0.08} />),
    ...["red", "green", "blue"].map((c, i) => <Cross key={"x" + c} C={C} dur={d} x={CX[c]} y={620} at={1.0 + i * 0.2} />),
    <Label dur={d} text="empty domain" x={540} y={760} w={900} size={64} color={C.coral} at={r("empty")} />,
    <Ico dur={d} ctx={ctx} name="undo-2" x={540} y={1000} size={180} color={C.coral} at={r("back")} />,
    <Label dur={d} text="back up at once" x={540} y={1130} w={900} size={56} at={r("back") + 0.1} />,
  ], { hold: "once", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "back", x: 540, y: 900, z: 1.04 }] }),

  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 42, title: "WRITE THIS · 5 MARKS", points: [
      "Backtracking: depth-first search that assigns one variable at a time and undoes a choice on a violation.",
      "Propagation: removing inconsistent values from domains, for example by arc consistency."],
      times: [r("backtracking"), r("propagation")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  S("to remember", (r, d) => [
    <Head dur={d} text="remember" y={170} size={120} at={0.05} />,
    ...Sketch({ dur: d, at: 0.4, items: [
      { text: "backtracking: try, check, undo", x: 540, y: 470, size: 52, w: 980, at: r("try") - 0.2 },
      { text: "propagation: cross out first", x: 540, y: 620, size: 52, w: 980, at: r("cross") - 0.2 },
      { text: "5 marks", x: 540, y: 860, size: 140, w: 900, color: C.coral, at: r("five") }] }),
    <Check dur={d} x={540} y={1250} size={170} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.02 }, { t: "five", x: 540, y: 900, z: 1.06 }] }),
];
