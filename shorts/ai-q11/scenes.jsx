import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
const popA = (at = 0) => [{ property: "opacity", from: 0, to: 1, at, duration: 0.15 }, { property: "scale", from: 0.6, to: 1, at, duration: 0.3, easing: "bounce" }];
const fadeA = (d = 0.25) => [{ property: "opacity", from: 0, to: 1, at: 0, duration: d }];
const Rev = ({ at, d, x, w, dd, children }) => { const T = dd * 1080 / Math.max(10, w); const a0 = Math.max(0, at - T * x / 1080);
  const len = Math.max(0.3, d - a0);
  return <frame at={a0} duration={len} width={1080} height={1920} layout="none" reveal={{ from: "left", at: 0, duration: Math.min(T, len - 0.03), easing: "linear" }}>{children}</frame>; };
const MBox = ({ C, x, y, w = 260, h = 90, text, tone = "a", size = 44, at = 0, out, dur }) => {
  bb({ k: "box", n: text, x: x - w / 2, y: y - h / 2, w: w + 9, h: h + 9, t0: at, t1: out ?? dur });
  const f = tone === "hot" ? C.coral : tone === "b" ? C.cobalt : C.chip, tc = tone === "a" ? C.chipText : C.ink;
  return <Layer at={at} dur={dur} out={out} anim={popA(0)} sfx="pop">
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} radius={14} fill={f} strokeColor={C.navy} strokeWidth={4} />
    <text x={x - w / 2} y={y - size * 0.62} width={w} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={size} color={tc}>{text}</text>
  </Layer>; };
const Dot = ({ C, x, y, at, dur, color }) => <Layer at={at} dur={dur} anim={popA(0)} sfx="pop"><rect x={x - 15} y={y - 15} width={30} height={30} radius={15} fill={color} strokeColor={C.navy} strokeWidth={4} /></Layer>;
// plot frame: x0=160, width 790, baseline y=840, height 420
const PX = 160, PW = 790, PY = 840, PH = 420;
const poly = pts => pts.map((p, i) => (i ? "L " : "M ") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
const PathL = ({ d, stroke, w = 9, fill, op }) => <path d={d} x={0} y={0} width={1080} height={1920} stroke={stroke ? { width: w, color: stroke, cap: "round" } : undefined} fill={fill} opacity={op} />;
const Axes = ({ C, d, at, ticks, xname, xnx = PX + PW / 2 }) => [
  <Layer key="ax" at={at} dur={d} anim={fadeA(0.3)}><PathL d={`M ${PX} ${PY - PH - 20} L ${PX} ${PY} L ${PX + PW + 10} ${PY}`} stroke={C.navy} w={6} /></Layer>,
  <Label key="y1" dur={d} text="1" x={115} y={PY - PH - 25} w={70} size={40} at={at} />,
  <Label key="y0" dur={d} text="0" x={115} y={PY - 28} w={70} size={40} at={at} />,
  ...ticks.map(([v, X], i) => <Label key={"tk" + i} dur={d} text={String(v)} x={X} y={PY + 12} w={110} size={36} at={at + 0.1} />),
  <Label key="xn" dur={d} text={xname} x={xnx} y={PY + 62} w={700} size={38} color={C.coral} at={at + 0.1} />,
];
// fuzzifier plot (temperature 10..60)
const TX = t => PX + (t - 10) / 50 * PW, MY = m => PY - m * PH;
// fan-speed plot (0..100)
const SX = s => PX + s / 100 * PW;

export const SCENES = ({ S, ctx, C }) => [
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Explain the complete process of a fuzzy system with a block diagram.", n: 11, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "block", x: 540, y: 780, z: 1.06 }] }),

  // from zero: crisp vs fuzzy
  S("let's start", (r, d) => [
    <Head dur={d} text="crisp vs fuzzy" y={150} size={100} at={0.1} />,
    <Label dur={d} text="hot?" x={170} y={400} w={240} size={70} color={C.coral} at={r("hot")} />,
    <Box dur={d} x={540} y={430} w={240} h={100} label="yes" tone="a" size={56} at={r("yes")} />,
    <Box dur={d} x={820} y={430} w={240} h={100} label="no" tone="a" size={56} at={r("yes") + 0.5} />,
    <Ico dur={d} ctx={ctx} name="thermometer" x={130} y={640} size={130} color={C.coral} at={r("degrees")} />,
    <Label dur={d} text="30°" x={290} y={600} w={260} size={84} at={r("degrees")} />,
    <Label dur={d} text="warm" x={560} y={565} w={200} size={44} color={C.cobalt} at={r("warm")} />,
    <Label dur={d} text="hot" x={560} y={700} w={200} size={44} color={C.coral} at={r("little")} />,
    <Layer at={r("warm")} dur={d}><rect x={650} y={565} width={300} height={44} radius={22} fill={C.chip} strokeColor={C.navy} strokeWidth={4} /><rect x={650} y={700} width={300} height={44} radius={22} fill={C.chip} strokeColor={C.navy} strokeWidth={4} /></Layer>,
    <Rev at={r("warm") + 0.2} d={d} x={650} w={200} dd={0.6}><rect x={650} y={565} width={200} height={44} radius={22} fill={C.cobalt} /></Rev>,
    <Rev at={r("little") + 0.2} d={d} x={650} w={100} dd={0.5}><rect x={650} y={700} width={100} height={44} radius={22} fill={C.coral} /></Rev>,
    <Label dur={d} text="0" x={650} y={760} w={80} size={38} at={r("between")} />,
    <Label dur={d} text="1" x={950} y={760} w={80} size={38} at={r("between")} />,
    <Label dur={d} text="degrees between 0 and 1" x={540} y={850} w={960} size={50} color={C.coral} at={r("between")} />,
    <Box dur={d} x={210} y={1060} w={250} h={110} label="crisp in" tone="a" size={46} at={r("takes")} />,
    <Arrow dur={d} x1={340} y1={1060} x2={410} y2={1060} at={r("takes") + 0.4} color={C.cobalt} />,
    <Box dur={d} x={540} y={1060} w={250} h={110} label="degrees" tone="hot" size={46} at={r("takes") + 1.5} />,
    <Arrow dur={d} x1={670} y1={1060} x2={740} y2={1060} at={r("takes") + 2.4} color={C.cobalt} />,
    <Box dur={d} x={870} y={1060} w={250} h={110} label="crisp out" tone="a" size={46} at={r("gives")} />,
    <Ico dur={d} ctx={ctx} name="fan" x={540} y={1290} size={190} color={C.coral} at={r("fan") - 0.5} />,
    <Label dur={d} text="a smart fan" x={540} y={1400} w={700} size={50} at={r("fan") - 0.3} />,
  ], { hold: "smart", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "degrees", x: 540, y: 880, z: 1.03 }, { t: "takes", x: 540, y: 960, z: 1.04 }] }),

  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  the block diagram", x: 130, y: 720, size: 58, w: 880, align: "left", at: r("block") },
      { text: "2.  what each block does", x: 130, y: 880, size: 58, w: 880, align: "left", at: r("what") }] }),
    <Check dur={d} x={80} y={760} size={70} at={r("block") + 1.3} />,
    <Check dur={d} x={80} y={920} size={70} at={r("what") + 1.4} />,
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "what", x: 540, y: 860, z: 1.05 }] }),

  // the block diagram
  S("here is the diagram", (r, d) => [
    <Head dur={d} text="block diagram" y={150} size={90} at={0.1} />,
    <Box dur={d} x={380} y={330} w={400} h={110} label="crisp input" tone="a" size={46} at={r("crisp")} />,
    <Arrow dur={d} x1={380} y1={392} x2={380} y2={488} at={r("crisp") + 0.5} color={C.cobalt} />,
    <Box dur={d} x={380} y={550} w={400} h={110} label="fuzzifier" sub="block 1" tone="hot" size={46} at={r("fuzzifier")} />,
    <Arrow dur={d} x1={380} y1={612} x2={380} y2={708} at={r("fuzzifier") + 0.5} color={C.cobalt} />,
    <Box dur={d} x={380} y={770} w={400} h={110} label="inference engine" sub="block 2" tone="b" size={38} at={r("inference")} />,
    <Box dur={d} x={850} y={770} w={340} h={110} label="rule base" tone="a" size={44} at={r("rule")} />,
    <Arrow dur={d} x1={678} y1={770} x2={592} y2={770} at={r("rule") + 0.4} color={C.cobalt} />,
    <Arrow dur={d} x1={380} y1={832} x2={380} y2={928} at={r("inference") + 1.4} color={C.cobalt} />,
    <Box dur={d} x={380} y={990} w={400} h={110} label="defuzzifier" sub="block 3" tone="hot" size={46} at={r("defuzzifier")} />,
    <Arrow dur={d} x1={380} y1={1052} x2={380} y2={1148} at={r("defuzzifier") + 0.5} color={C.cobalt} />,
    <Box dur={d} x={380} y={1210} w={400} h={110} label="crisp output" tone="a" size={46} at={r("out")} />,
  ], { hold: "output", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "fuzzifier", x: 540, y: 860, z: 1.03 }, { t: "defuzzifier", x: 540, y: 920, z: 1.03 }] }),

  // block 1: fuzzifier
  S("now each block", (r, d) => [
    <Head dur={d} text="1. fuzzifier" y={150} size={90} sub="a number becomes degrees" at={0.1} />,
    ...Axes({ C, d, at: r("input") - 0.3, ticks: [[10, TX(10)], [30, TX(30)], [50, TX(50)]], xname: "temperature" }),
    <Layer key="in" at={r("input")} dur={d} anim={fadeA(0.3)} sfx="ping"><PathL d={`M ${TX(30)} ${PY} L ${TX(30)} ${PY - PH - 10}`} stroke={C.coral} w={8} /></Layer>,
    <Label dur={d} text="input = 30°" x={TX(30)} y={975} w={400} size={44} color={C.coral} at={r("input") + 0.2} />,
    <Rev at={r("fuzzifier")} d={d} x={TX(15)} w={TX(40) - TX(15)} dd={1.0}><PathL d={poly([[TX(15), PY], [TX(25), MY(1)], [TX(40), PY]])} stroke={C.cobalt} w={9} /></Rev>,
    <Rev at={r("fuzzifier") + 0.8} d={d} x={TX(25)} w={TX(55) - TX(25)} dd={1.0}><PathL d={poly([[TX(25), PY], [TX(40), MY(1)], [TX(55), PY]])} stroke={C.coral} w={9} /></Rev>,
    <Label dur={d} text="warm" x={TX(25) - 50} y={MY(1) - 65} w={200} size={40} color={C.cobalt} at={r("fuzzifier") + 0.9} />,
    <Label dur={d} text="hot" x={TX(40) + 50} y={MY(1) - 65} w={200} size={40} color={C.coral} at={r("fuzzifier") + 1.7} />,
    <Dot key="d1" C={C} dur={d} x={TX(30)} y={MY(2 / 3)} color={C.cobalt} at={r("warm")} />,
    <MBox C={C} dur={d} x={300} y={1100} w={420} h={90} text="warm = 0.67" tone="b" size={42} at={r("warm") + 0.3} />,
    <Dot key="d2" C={C} dur={d} x={TX(30)} y={MY(1 / 3)} color={C.coral} at={r("hot")} />,
    <MBox C={C} dur={d} x={780} y={1100} w={420} h={90} text="hot = 0.33" tone="hot" size={42} at={r("hot") + 0.3} />,
  ], { hold: "one third", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "fuzzifier", x: 540, y: 860, z: 1.03 }, { t: "warm", x: 540, y: 900, z: 1.04 }] }),

  // the rule base
  S("rule base holds", (r, d) => [
    <Head dur={d} text="rule base" y={170} size={120} sub="IF ... THEN ... rules" at={0.1} />,
    <Label dur={d} text="IF" x={180} y={490} w={160} size={50} color={C.coral} at={r("warm")} />,
    <Box dur={d} x={230} y={620} w={300} h={110} label="warm" tone="b" size={52} at={r("warm")} />,
    <Arrow dur={d} x1={400} y1={620} x2={520} y2={620} at={r("medium") - 0.4} color={C.cobalt} />,
    <Label dur={d} text="THEN" x={460} y={540} w={200} size={44} color={C.coral} at={r("medium") - 0.4} />,
    <Box dur={d} x={790} y={620} w={420} h={110} label="fan medium" tone="a" size={46} at={r("medium")} />,
    <Label dur={d} text="IF" x={180} y={790} w={160} size={50} color={C.coral} at={r("hot")} />,
    <Box dur={d} x={230} y={920} w={300} h={110} label="hot" tone="hot" size={52} at={r("hot")} />,
    <Arrow dur={d} x1={400} y1={920} x2={520} y2={920} at={r("fast") - 0.4} color={C.cobalt} />,
    <Label dur={d} text="THEN" x={460} y={840} w={200} size={44} color={C.coral} at={r("fast") - 0.4} />,
    <Box dur={d} x={790} y={920} w={420} h={110} label="fan fast" tone="a" size={46} at={r("fast")} />,
  ], { hold: "fast", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "warm", x: 540, y: 860, z: 1.03 }, { t: "hot", x: 540, y: 920, z: 1.04 }] }),

  // the inference engine: cut and merge
  S("inference engine fires", (r, d) => [
    <Head dur={d} text="2. inference" y={150} size={90} at={0.1} />,
    ...Axes({ C, d, at: 0.4, ticks: [[0, SX(0)], [50, SX(50)], [100, SX(100)]], xname: "fan speed" }),
    <Rev at={r("fires")} d={d} x={SX(30)} w={SX(70) - SX(30)} dd={0.9}><PathL d={poly([[SX(30), PY], [SX(50), MY(1)], [SX(70), PY]])} stroke={C.cobalt} w={7} /></Rev>,
    <Rev at={r("fires") + 0.6} d={d} x={SX(60)} w={SX(100) - SX(60)} dd={0.9}><PathL d={poly([[SX(60), PY], [SX(80), MY(1)], [SX(100), PY]])} stroke={C.coral} w={7} /></Rev>,
    <Label dur={d} text="medium" x={SX(50) - 130} y={MY(1) - 62} w={200} size={38} color={C.cobalt} at={r("fires") + 0.8} />,
    <Label dur={d} text="fast" x={SX(80) + 70} y={MY(1) - 62} w={200} size={38} color={C.coral} at={r("fires") + 1.4} />,
    <Layer at={r("medium")} dur={d} anim={fadeA(0.4)} sfx="swish"><PathL d={poly([[SX(30), PY], [SX(43.4), MY(2 / 3)], [SX(56.6), MY(2 / 3)], [SX(70), PY]]) + " Z"} fill={C.cobalt} op={0.65} /></Layer>,
    <Label dur={d} text="medium cut at 2/3" x={330} y={PY + 120} w={560} size={40} color={C.cobalt} at={r("medium") + 0.2} />,
    <Layer at={r("fast")} dur={d} anim={fadeA(0.4)} sfx="swish"><PathL d={poly([[SX(60), PY], [SX(66.7), MY(1 / 3)], [SX(93.3), MY(1 / 3)], [SX(100), PY]]) + " Z"} fill={C.coral} op={0.65} /></Layer>,
    <Label dur={d} text="fast cut at 1/3" x={780} y={PY + 120} w={560} size={40} color={C.coral} at={r("fast") + 0.2} />,
    <Rev at={r("merges")} d={d} x={SX(30)} w={SX(100) - SX(30)} dd={1.4}><PathL d={poly([[SX(30), PY], [SX(43.4), MY(2 / 3)], [SX(56.6), MY(2 / 3)], [SX(65), MY(0.25)], [SX(66.7), MY(1 / 3)], [SX(93.3), MY(1 / 3)], [SX(100), PY]])} stroke={C.navy} w={11} /></Rev>,
    <Label dur={d} text="merged into one shape" x={540} y={PY + 215} w={900} size={50} at={r("into") + 0.2} />,
  ], { hold: "into one shape", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "medium", x: 540, y: 880, z: 1.03 }, { t: "merges", x: 540, y: 920, z: 1.04 }] }),

  // block 3: defuzzifier (centroid)
  S("finally the defuzzifier", (r, d) => [
    <Head dur={d} text="3. defuzzifier" y={150} size={90} sub="a shape becomes one number" at={0.1} />,
    ...Axes({ C, d, at: 0.3, ticks: [[0, SX(0)], [50, SX(50)], [100, SX(100)]], xname: "fan speed", xnx: 300 }),
    <Layer key="sh" at={0.5} dur={d} anim={fadeA(0.4)}><PathL d={poly([[SX(30), PY], [SX(43.4), MY(2 / 3)], [SX(56.6), MY(2 / 3)], [SX(65), MY(0.25)], [SX(66.7), MY(1 / 3)], [SX(93.3), MY(1 / 3)], [SX(100), PY]]) + " Z"} fill={C.coral} op={0.45} stroke={C.navy} w={9} /></Layer>,
    <Label dur={d} text="needs one number" x={540} y={PY + 215} w={900} size={48} at={r("needs")} />,
    <Layer key="fu" at={r("balance")} dur={d} anim={popA(0)} sfx="pop"><PathL d={poly([[SX(61.4), PY + 6], [SX(61.4) - 40, PY + 80], [SX(61.4) + 40, PY + 80]]) + " Z"} fill={C.cobalt} stroke={C.navy} w={5} /></Layer>,
    <Layer key="cl" at={r("lands")} dur={d} anim={fadeA(0.3)} sfx="ping"><PathL d={`M ${SX(61.4)} ${PY} L ${SX(61.4)} ${MY(1) - 10}`} stroke={C.coral} w={8} /></Layer>,
    <Label dur={d} text="centroid ≈ 61" x={SX(61.4)} y={MY(1) - 75} w={500} size={46} font={C.fMono} color={C.coral} at={r("lands")} />,
    <Ico dur={d} ctx={ctx} name="fan" x={290} y={PY + 375} size={180} color={C.coral} at={r("runs") - 0.4} />,
    <MBox C={C} dur={d} x={720} y={PY + 375} w={420} h={110} text="fan = 61%" tone="hot" size={56} at={r("runs")} />,
  ], { hold: "runs", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "balance", x: 540, y: 880, z: 1.03 }, { t: "lands", x: 540, y: 940, z: 1.04 }] }),

  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 42, title: "WRITE THIS · 5 MARKS", points: [
      "Crisp input, fuzzifier, inference engine with rule base, defuzzifier, crisp output.",
      "Fuzzify, apply the IF-THEN rules, defuzzify."],
      times: [r("crisp"), r("fuzzify")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  S("to remember", (r, d) => [
    <Head dur={d} text="remember" y={170} size={120} at={0.05} />,
    ...Sketch({ dur: d, at: 0.4, items: [
      { text: "in = fuzzify", x: 540, y: 470, size: 78, w: 940, at: r("in") },
      { text: "think = infer", x: 540, y: 610, size: 78, w: 940, at: r("think") },
      { text: "out = defuzzify", x: 540, y: 750, size: 78, w: 940, at: r("out") },
      { text: "5 marks", x: 540, y: 960, size: 140, w: 900, color: C.coral, at: r("five") }] }),
    <Check dur={d} x={540} y={1300} size={170} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.02 }, { t: "five", x: 540, y: 900, z: 1.06 }] }),
];
