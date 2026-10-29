import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Layer, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
import { C } from "./theme.jsx";
const CWM = 0.602;
const FADE = [{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.18 }];
const POP = [{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.12 }, { property: "scale", from: 0.55, to: 1, at: 0, duration: 0.38, easing: [0.34, 1.56, 0.64, 1] }];
function Itx({ dur, x, y, fs = 40, line, at = 0, out, reg = true, on, col }) {
  const cw = fs * CWM;
  if (reg) bb({ k: "label", n: line, x, y, w: line.length * cw, h: fs * 1.25, t0: at, t1: out ?? dur, on });
  return <Layer at={at} dur={dur} out={out} anim={FADE}>
    <text x={x} y={y} width={line.length * cw + 14} fontFamily={C.fMono} fontWeight={700} fontSize={fs} color={col || C.navy}>{line}</text>
  </Layer>;
}
function St({ dur, x, y, w, title, lines, at = 0, fs = 34, lat }) {
  const rh = fs * 1.4, h = 14 + rh * ((title ? 1 : 0) + lines.length) + 12, L = x - w / 2 + 18;
  bb({ k: "box", n: title || lines[0], x: x - w / 2, y, w: w + 9, h: h + 9, t0: at, t1: dur });
  return [
    <Layer key="b" at={at} dur={dur} anim={POP} sfx="pop">
      <rect x={x - w / 2 + 9} y={y + 9} width={w} height={h} radius={10} fill={C.navy} opacity={0.9} />
      <rect x={x - w / 2} y={y} width={w} height={h} radius={10} fill={C.chip} strokeColor={C.navy} strokeWidth={4} />
      {title ? <text x={L} y={y + 14} width={w - 36} fontFamily={C.fMono} fontWeight={700} fontSize={fs} color={C.coral}>{title}</text> : null}
    </Layer>,
    ...lines.map((ln, i) => <Itx key={i} dur={dur} x={L} y={y + 14 + rh * ((title ? 1 : 0) + i)} fs={fs} line={ln} at={lat ? lat[i] : at + 0.25 + i * 0.12} reg={false} />),
  ];
}
// one use of SDT, always on the same input  3 + 4  : input row, a rule box, then the result
const useScene = (d, o) => [
  <Head key="h" dur={d} text={o.head} y={165} size={110} sub={o.sub} at={0.1} />,
  ...["3", "+", "4"].map((s, i) => <Box key={"i" + i} dur={d} x={[240, 540, 840][i]} y={500} w={170} h={100} size={60} label={s} tone="b" at={0.3 + i * 0.12} />),
  ...[240, 540, 840].map((x, i) => <Arrow key={"a" + i} dur={d} x1={x} y1={560} x2={x} y2={696} color={C.cobalt} width={6} at={o.ruleAt - 0.1} />),
  <Box key="rule" dur={d} x={540} y={760} w={760} h={120} size={44} label={o.rule} tone="a" at={o.ruleAt} />,
  ...o.out,
];
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Discuss the applications of syntax directed translation.", n: 12, marks: 5, y: 520 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "applications", x: 540, y: 780, z: 1.05 }] }),

  // 2a. from zero: a small job attached to each grammar rule
  S("let's start", (r, d) => [
    <Head key="h" dur={d} text="SDT" y={165} size={130} sub="a small job on every rule" at={0.1} />,
    ...St({ dur: d, x: 330, y: 400, w: 520, fs: 56, title: "grammar", at: r("grammar"), lines: ["E → E + T", "E → T"] }),
    <Arrow key="a1" dur={d} x1={606} y1={527} x2={684} y2={527} color={C.cobalt} width={6} at={r("small")} />,
    <Arrow key="a2" dur={d} x1={606} y1={605} x2={684} y2={605} color={C.cobalt} width={6} at={r("small") + 0.4} />,
    <Box key="j1" dur={d} x={850} y={527} w={300} h={70} size={40} label="job" tone="a" at={r("small")} out={r("uses")} />,
    <Box key="j1h" dur={d} x={850} y={527} w={300} h={70} size={40} label="job runs" tone="hot" at={r("uses")} />,
    <Box key="j2" dur={d} x={850} y={605} w={300} h={70} size={40} label="job" tone="a" at={r("small") + 0.4} />,
    <Label key="l" dur={d} text="runs when the parser uses the rule" x={540} y={790} w={980} size={40} color={C.coral} at={r("runs")} />,
  ], { hold: "that rule", holdY: 780, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: 1, x: 540, y: 780, z: 1.0 }] }),

  // 2b. the assembly-line analogy
  S("think of an assembly", (r, d) => [
    <Head key="h" dur={d} text="assembly line" y={165} size={100} sub="each station does one job" at={0.1} />,
    <Box key="s1" dur={d} x={200} y={640} w={280} h={130} size={44} label="station 1" tone="a" at={0.4} />,
    <Box key="s2" dur={d} x={540} y={640} w={280} h={130} size={44} label="station 2" tone="a" at={0.6} />,
    <Box key="s3" dur={d} x={880} y={640} w={280} h={130} size={44} label="station 3" tone="a" at={0.8} />,
    ...Sketch({ dur: d, at: r("each"), speed: 2600, items: [{ line: [80, 960, 1000, 960], color: C.cobalt }] }),
    <Mascot key="t" dur={d} size={150} tag="3" pts={[{ t: r("each"), x: 130, y: 880, look: [1, 0] }, { t: r("little"), x: 540, y: 880, look: [1, 0], mood: "think" }, { t: r("passes"), x: 950, y: 880, look: [1, 0], mood: "happy" }]} />,
    <Label key="l" dur={d} text="one little job each" x={540} y={1080} w={900} size={44} color={C.coral} at={r("own")} />,
  ], { hold: "passes", holdY: 700, cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: 1, x: 540, y: 700, z: 1.0 }] }),

  // 3. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 480, size: 74, w: 960 },
      { text: "1.  where is it used?", x: 190, y: 680, size: 60, w: 840, align: "left", at: r("where") } ] }),
    <Check key="k1" dur={d} x={130} y={708} size={70} at={r("where") + 1.2} />,
  ]),

  // 4. the plan: one input, five uses
  S("let's follow", (r, d) => [
    <Box key="in" dur={d} x={540} y={520} w={460} h={130} size={80} label="3 + 4" tone="hot" at={r("input")} />,
    <Arrow key="a" dur={d} x1={540} y1={595} x2={540} y2={790} color={C.cobalt} width={7} at={r("through")} />,
    ...[["1 value", 200, 860], ["2 tree", 540, 860], ["3 code", 880, 860], ["4 types", 370, 1010], ["5 postfix", 710, 1010]].map(([l, x, y], i) =>
      <Box key={"u" + i} dur={d} x={x} y={y} w={300} h={100} size={44} label={l} tone="a" at={r("five") + i * 0.2} />),
  ], { hold: "uses", holdY: 800, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: 1, x: 540, y: 780, z: 1.0 }] }),

  // 5. use one: evaluate expressions
  S("use one", (r, d) => useScene(d, {
    head: "1 · evaluate", sub: "like a desk calculator", rule: "rule: add the two values", ruleAt: r("rule"),
    out: [
      <Arrow key="o1" dur={d} x1={540} y1={825} x2={540} y2={1010} color={C.coral} width={7} at={r("outputs")} />,
      <Label key="o2" dur={d} text="the parser outputs" x={590} y={900} w={440} size={38} align="left" color={C.coral} at={r("outputs")} />,
      <Box key="o3" dur={d} x={540} y={1110} w={260} h={170} size={110} label="7" tone="hot" at={r("seven")} />,
    ] }), { hold: "seven", holdY: 800, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: 1, x: 540, y: 800, z: 1.0 }] }),

  // 6. use two: build syntax trees
  S("use two", (r, d) => useScene(d, {
    head: "2 · syntax tree", sub: "build the tree", rule: "rule: make a + node", ruleAt: r("rule"),
    out: [
      <Arrow key="o1" dur={d} x1={540} y1={825} x2={540} y2={975} color={C.coral} width={7} at={r("plus")} />,
      <Box key="o2" dur={d} x={540} y={1050} w={200} h={110} size={70} label="+" tone="hot" at={r("plus")} />,
      <Arrow key="e1" dur={d} x1={500} y1={1110} x2={350} y2={1190} head={false} width={5} at={r("three")} />,
      <Arrow key="e2" dur={d} x1={580} y1={1110} x2={730} y2={1190} head={false} width={5} at={r("four")} />,
      <Box key="c1" dur={d} x={340} y={1250} w={170} h={100} size={60} label="3" tone="b" at={r("three")} />,
      <Box key="c2" dur={d} x={740} y={1250} w={170} h={100} size={60} label="4" tone="b" at={r("four")} />,
      <Label key="o3" dur={d} text="later phases use this tree" x={540} y={1410} w={980} size={38} color={C.coral} at={r("later")} />,
    ] }), { hold: "this tree", holdY: 850, cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: 1, x: 540, y: 850, z: 1.0 }] }),

  // 7. use three: intermediate code
  S("use three", (r, d) => useScene(d, {
    head: "3 · code", sub: "intermediate code", rule: "rule: emit code", ruleAt: r("rule"),
    out: [
      <Arrow key="o1" dur={d} x1={540} y1={825} x2={540} y2={1000} color={C.coral} width={7} at={r("three address")} />,
      <Label key="o2" dur={d} text="three-address code" x={590} y={890} w={440} size={36} align="left" color={C.coral} at={r("three address")} />,
      <Box key="o3" dur={d} x={540} y={1100} w={640} h={150} size={80} label="t1 = 3 + 4" tone="hot" at={r("t one")} />,
    ] }), { hold: "plus four", holdY: 800, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: 1, x: 540, y: 800, z: 1.0 }] }),

  // 8. use four: type checking
  S("use four", (r, d) => useScene(d, {
    head: "4 · types", sub: "type checking", rule: "rule: check the types", ruleAt: r("rule"),
    out: [
      <Label key="t1" dur={d} text="int" x={295} y={600} w={140} size={36} align="left" color={C.coral} at={r("types")} />,
      <Label key="t2" dur={d} text="int" x={895} y={600} w={140} size={36} align="left" color={C.coral} at={r("types")} />,
      <Arrow key="o1" dur={d} x1={540} y1={825} x2={540} y2={940} color={C.coral} width={7} at={r("integer plus integer") - 0.3} />,
      <Box key="o2" dur={d} x={540} y={1000} w={760} h={110} size={52} label="int + int → int" tone="a" at={r("integer plus integer")} />,
      <Check key="k1" dur={d} x={985} y={1000} size={60} at={r("integer plus integer") + 1.4} />,
      <Box key="o3" dur={d} x={540} y={1170} w={760} h={110} size={52} label="int + string → error" tone="hot" at={r("integer plus a")} />,
      <XMark key="x1" dur={d} x={985} y={1170} size={60} at={r("integer plus a") + 1.4} />,
    ] }), { hold: "type error", holdY: 850, cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: 1, x: 540, y: 850, z: 1.0 }] }),

  // 9. use five: infix to postfix
  S("use five", (r, d) => useScene(d, {
    head: "5 · postfix", sub: "one notation to another", rule: "rule: operands first", ruleAt: r("translating"),
    out: [
      <Arrow key="o1" dur={d} x1={540} y1={825} x2={540} y2={970} color={C.coral} width={7} at={r("infix")} />,
      <Label key="o2" dur={d} text="infix → postfix" x={590} y={880} w={440} size={38} align="left" color={C.coral} at={r("infix")} />,
      <Box key="o3" dur={d} x={540} y={1060} w={520} h={150} size={90} label="3 4 +" tone="hot" at={r("three four plus")} />,
    ] }), { hold: "four plus", holdY: 800, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: 1, x: 540, y: 800, z: 1.0 }] }),

  // 10. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 170, fs: 38, title: "WRITE THIS · 5 MARKS", points: [
      "SDT: a grammar with a rule (action) attached to each production.",
      "Evaluating expressions (desk calculator).",
      "Building syntax trees.",
      "Generating intermediate code (three-address code).",
      "Type checking.",
      "Infix to postfix conversion." ],
      times: [r("syntax directed"), r("evaluating"), r("building"), r("generating"), r("type"), r("infix")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  // 11. memory trick + payoff
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "one rule,", x: 540, y: 540, size: 120, w: 960 },
      { text: "many results", x: 540, y: 690, size: 120, w: 960, color: C.coral },
      { line: [140, 860, 940, 860], color: C.cobalt },
      { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("five marks") } ] }),
    <Check key="ck" dur={d} x={540} y={1330} size={180} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "marks", x: 540, y: 1000, z: 1.06 }] }),
];
