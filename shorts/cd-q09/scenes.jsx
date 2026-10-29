import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Layer, Table, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
import { C } from "./theme.jsx";
const FADE = [{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.18 }];
// open-top container (a stack)
const Cont = ({ dur, x1, x2, y1, y2, at }) => <Layer at={at} dur={dur} anim={FADE}><path d={`M ${x1} ${y1} L ${x1} ${y2} L ${x2} ${y2} L ${x2} ${y1}`} x={0} y={0} width={1080} height={1920} stroke={{ width: 7, color: C.navy, cap: "round" }} /></Layer>;
const CAM1 = (y) => ({ cam: [{ t: 0, x: 540, y, z: 1.0 }, { t: 1, x: 540, y, z: 1.0 }] });
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Why is LR parsing good and attractive? Also explain its demerits.", n: 9, marks: 5, y: 520 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "attractive", x: 540, y: 780, z: 1.05 }] }),

  // 2a. from zero: shift = put the next token on the stack
  S("let's start", (r, d) => {
    const t1 = r("puts"), t2 = r("stack") + 0.1;
    return [
      <Head key="h" dur={d} text="shift" y={165} size={130} sub="tokens go onto a stack" at={0.1} />,
      <Label key="in" dur={d} text="input, read from the left" x={540} y={400} w={900} size={36} color={C.coral} at={r("input")} />,
      <Box key="a1" dur={d} x={240} y={520} w={200} h={110} size={60} label="id" tone="b" at={r("input")} out={t1} />,
      <Box key="a2" dur={d} x={540} y={520} w={200} h={110} size={60} label="+" tone="b" at={r("input") + 0.15} out={t2} />,
      <Box key="a3" dur={d} x={840} y={520} w={200} h={110} size={60} label="id" tone="b" at={r("input") + 0.3} />,
      <Cont key="c" dur={d} x1={380} x2={700} y1={1040} y2={1390} at={0.4} />,
      <Mascot key="k1" dur={d} at={t1} out={t1 + 0.9} size={170} tag="id" pts={[{ t: t1, x: 240, y: 520, look: [0, 1] }, { t: t1 + 0.88, x: 540, y: 1296, look: [0, 1] }]} />,
      <Box key="s1" dur={d} x={540} y={1300} w={300} h={104} size={56} label="id" tone="b" at={t1 + 0.92} />,
      <Mascot key="k2" dur={d} at={t2} out={t2 + 0.9} size={170} tag="+" pts={[{ t: t2, x: 540, y: 520, look: [0, 1] }, { t: t2 + 0.88, x: 540, y: 1150, look: [0, 1] }]} />,
      <Box key="s2" dur={d} x={540} y={1182} w={300} h={104} size={56} label="+" tone="b" at={t2 + 0.92} />,
      <Label key="l" dur={d} text="shift" x={860} y={1180} w={300} size={80} color={C.coral} at={r("shift")} />,
    ];
  }, { hold: "shift", holdY: 900, ...CAM1(900) }),

  // 2b. reduce = fuse the top bricks into one bigger block (Lego)
  S("think of lego", (r, d) => [
    <Head key="h" dur={d} text="Lego" y={165} size={130} sub="clip, then fuse" at={0.1} />,
    <Cont key="c" dur={d} x1={380} x2={700} y1={480} y2={1130} at={0.3} />,
    <Box key="b1" dur={d} x={540} y={1060} w={280} h={90} size={50} label="E" tone="b" at={r("clip")} out={r("fuse")} />,
    <Box key="b2" dur={d} x={540} y={960} w={280} h={90} size={50} label="+" tone="b" at={r("clip") + 0.5} out={r("fuse")} />,
    <Box key="b3" dur={d} x={540} y={860} w={280} h={90} size={50} label="T" tone="b" at={r("clip") + 1.0} out={r("fuse")} />,
    <Label key="k" dur={d} text="a known shape: E → E + T" x={540} y={420} w={900} size={42} color={C.coral} at={r("known")} />,
    <Box key="f" dur={d} x={540} y={955} w={280} h={300} size={110} label="E" tone="hot" at={r("fuse")} />,
    <Label key="l" dur={d} text="reduce" x={860} y={1000} w={300} size={80} color={C.coral} at={r("reduce")} />,
  ], { hold: "reduce", holdY: 800, ...CAM1(800) }),

  // 3. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 480, size: 74, w: 960 },
      { text: "1.  why LR is attractive", x: 190, y: 680, size: 56, w: 840, align: "left", at: r("why lr") },
      { text: "2.  its demerits", x: 190, y: 860, size: 56, w: 840, align: "left", at: r("its demerits") } ] }),
    <Check key="k1" dur={d} x={130} y={708} size={70} at={r("why lr") + 1.9} />,
    <Check key="k2" dur={d} x={130} y={888} size={70} at={r("its demerits") + 0.9} />,
  ]),

  // 4. merit 1: handles almost every programming language
  S("reason one", (r, d) => [
    <Head key="h" dur={d} text="reason 1" y={165} size={120} sub="almost every language" at={0.1} />,
    ...[["expressions", 230, 540], ["loops", 720, 540], ["functions", 230, 700], ["declarations", 720, 700]].flatMap(([l, x, y], i) => [
      <Box key={"b" + i} dur={d} x={x} y={y} w={340} h={100} size={40} label={l} tone="a" at={r("programming") + i * 0.35} />,
      <Check key={"c" + i} dur={d} x={x + 210} y={y} size={50} at={r("programming") + i * 0.35 + 0.3} />,
    ]),
    <Label key="l" dur={d} text="has a CFG? LR can parse it" x={540} y={900} w={980} size={44} color={C.coral} at={r("context") + 0.3} />,
  ], { hold: "parse it", holdY: 780, ...CAM1(780) }),

  // 5. merit 2: no backtracking, as fast as the simple methods
  S("reason two", (r, d) => [
    <Head key="h" dur={d} text="reason 2" y={165} size={120} sub="never backtracks" at={0.1} />,
    <Box key="r1" dur={d} x={170} y={560} w={240} h={100} size={44} label="shift" tone="a" at={r("most")} />,
    <Arrow key="a1" dur={d} x1={292} y1={560} x2={378} y2={560} color={C.cobalt} width={7} at={r("most") + 0.3} />,
    <Box key="r2" dur={d} x={500} y={560} w={240} h={100} size={44} label="reduce" tone="a" at={r("most") + 0.3} />,
    <Arrow key="a2" dur={d} x1={622} y1={560} x2={708} y2={560} color={C.cobalt} width={7} at={r("most") + 0.6} />,
    <Box key="r3" dur={d} x={830} y={560} w={240} h={100} size={44} label="accept" tone="b" at={r("most") + 0.6} />,
    <Label key="l1" dur={d} text="LR: always forward" x={540} y={680} w={900} size={40} color={C.coral} at={r("most") + 0.9} />,
    <Box key="g1" dur={d} x={170} y={960} w={240} h={100} size={44} label="guess" tone="a" at={r("guesses")} />,
    <Arrow key="ga" dur={d} x1={292} y1={960} x2={378} y2={960} color={C.cobalt} width={7} at={r("guesses") + 0.3} />,
    <Box key="g2" dur={d} x={500} y={960} w={240} h={100} size={44} label="stuck" tone="hot" at={r("guesses") + 0.3} />,
    <Arrow key="gb" dur={d} x1={500} y1={1030} x2={170} y2={1030} color={C.coral} width={7} at={r("goes back")} />,
    <Label key="gl" dur={d} text="go back" x={335} y={1060} w={300} size={38} color={C.coral} at={r("goes back")} />,
    <XMark key="x" dur={d} x={770} y={960} size={100} at={r("goes back") + 0.5} />,
    <Label key="l2" dur={d} text="LR never does this" x={540} y={1200} w={900} size={44} color={C.coral} at={r("goes back") + 0.5} />,
    <Label key="l3" dur={d} text="and it is just as fast" x={540} y={1320} w={900} size={44} at={r("fast")} />,
  ], { hold: "simple methods", holdY: 880, ...CAM1(880) }),

  // 6. merit 3: more powerful than LL
  S("reason three", (r, d) => [
    <Head key="h" dur={d} text="reason 3" y={165} size={120} sub="more powerful than LL" at={0.1} />,
    ...Sketch({ dur: d, at: r("every"), items: [{ oval: [540, 990, 230, 150], label: "LL", size: 60 }] }),
    ...Sketch({ dur: d, at: r("lr can"), items: [{ oval: [540, 990, 440, 360] }, { text: "LR", x: 540, y: 660, size: 60, w: 400, color: C.coral }] }),
    <Label key="l" dur={d} text="but not the other way round" x={540} y={1420} w={980} size={40} color={C.coral} at={r("other way")} />,
  ], { hold: "other way", holdY: 900, ...CAM1(900) }),

  // 7. merit 4: errors caught early
  S("reason four", (r, d) => [
    <Head key="h" dur={d} text="reason 4" y={165} size={120} sub="errors caught early" at={0.1} />,
    <Box key="t1" dur={d} x={150} y={520} w={200} h={110} size={60} label="id" tone="b" at={r("catches")} />,
    <Box key="t2" dur={d} x={400} y={520} w={200} h={110} size={60} label="+" tone="b" at={r("catches") + 0.15} />,
    <Box key="t3" dur={d} x={650} y={520} w={200} h={110} size={60} label="*" tone="hot" at={r("catches") + 0.3} />,
    <Box key="t4" dur={d} x={900} y={520} w={200} h={110} size={60} label="id" tone="ghost" at={r("catches") + 0.45} />,
    <Mascot key="k" dur={d} size={150} tag="id" pts={[{ t: r("catches"), x: 150, y: 740, look: [1, 0] }, { t: r("early"), x: 150, y: 740, look: [1, 0] }, { t: r("possible"), x: 400, y: 740, look: [1, 0] }, { t: r("very"), x: 650, y: 740, look: [1, 0], mood: "shock" }]} />,
    <XMark key="x" dur={d} x={650} y={625} size={60} at={r("token")} />,
    <Label key="l" dur={d} text="stops on the very token" x={540} y={950} w={980} size={44} color={C.coral} at={r("stops")} />,
  ], { hold: "making sense", holdY: 800, ...CAM1(800) }),

  // 8. demerit 1: tables by hand = too much work, so use a generator
  S("now the demerits", (r, d) => {
    const t0 = r("building");
    const rows = [["0", "s3", "", ""], ["1", "", "s4", "acc"], ["2", "", "r2", "r2"], ["3", "", "r3", "r3"], ["4", "s3", "", ""], ["5", "", "r1", "r1"]];
    return [
      <Head key="h" dur={d} text="demerit 1" y={165} size={110} sub="too much work by hand" at={0.1} />,
      ...Table({ dur: d, x: 60, y: 430, w: 960, cols: ["state", "id", "+", "$"], rows, rowH: 86, fs: 42, at: t0 - 0.2, cellAt: rows.map((_, ri) => [0, 1, 2, 3].map((ci) => t0 + ri * 0.4 + ci * 0.05)) }),
      <Arrow key="a" dur={d} x1={540} y1={1215} x2={540} y2={1130} color={C.coral} width={8} at={r("generator") - 0.1} />,
      <Box key="y" dur={d} x={540} y={1280} w={680} h={120} size={40} label="parser generator (YACC)" tone="hot" at={r("generator")} />,
    ];
  }, { hold: "like yacc", holdY: 880, ...CAM1(880) }),

  // 9. demerit 2: the tables are huge (canonical LR(1))
  S("two the tables", (r, d) => [
    <Head key="h" dur={d} text="demerit 2" y={165} size={110} sub="the tables are huge" at={0.1} />,
    <Box key="b1" dur={d} x={290} y={1150} w={380} h={200} size={40} label="SLR / LALR" tone="a" at={r("tables")} />,
    <Label key="s1" dur={d} text="small" x={290} y={1290} w={380} size={50} color={C.coral} at={r("tables") + 0.3} />,
    <Box key="b2" dur={d} x={770} y={970} w={380} h={560} size={38} label="canonical LR(1)" tone="hot" at={r("canonical")} />,
    <Label key="s2" dur={d} text="huge" x={770} y={1290} w={380} size={50} color={C.coral} at={r("canonical") + 0.3} />,
  ], { hold: "lr1", holdY: 880, ...CAM1(880) }),

  // 10. demerit 3: ambiguous grammars -> conflicts -> rewrite
  S("three ambiguous", (r, d) => [
    <Head key="h" dur={d} text="demerit 3" y={165} size={110} sub="ambiguous means conflicts" at={0.1} />,
    <Box key="c" dur={d} x={540} y={560} w={560} h={110} size={44} label="state 5 on '+'" tone="a" at={r("ambiguous")} />,
    <Arrow key="a1" dur={d} x1={440} y1={620} x2={310} y2={800} color={C.cobalt} width={7} at={r("conflicts")} />,
    <Arrow key="a2" dur={d} x1={640} y1={620} x2={770} y2={800} color={C.cobalt} width={7} at={r("conflicts")} />,
    <Box key="s" dur={d} x={290} y={860} w={300} h={110} size={56} label="shift" tone="hot" at={r("conflicts")} />,
    <Box key="r" dur={d} x={790} y={860} w={300} h={110} size={56} label="reduce" tone="hot" at={r("conflicts") + 0.2} />,
    <Label key="w" dur={d} text="which one?" x={540} y={720} w={400} size={40} color={C.coral} at={r("conflicts") + 0.4} />,
    <Mascot key="k" dur={d} size={160} tag="+" pts={[{ t: r("conflicts"), x: 540, y: 1040, look: [-1, 0], mood: "think" }, { t: r("conflicts") + 0.9, x: 540, y: 1040, look: [1, 0], mood: "shock" }, { t: r("rewrite"), x: 540, y: 1040, look: [0, 1], mood: "idle" }]} />,
    <Box key="rw" dur={d} x={540} y={1290} w={700} h={120} size={46} label="rewrite the grammar" tone="b" at={r("rewrite")} />,
  ], { hold: "the grammar", holdY: 900, ...CAM1(900) }),

  // 11. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 170, fs: 36, title: "WRITE THIS · 5 MARKS", points: [
      "Merit: parses nearly all programming-language grammars.",
      "Merit: no backtracking, yet as fast as simple methods.",
      "Merit: more powerful than LL.",
      "Merit: detects errors as early as possible.",
      "Demerit: too much work to build by hand; needs a generator like YACC.",
      "Demerit: tables are huge (canonical LR(1)).",
      "Demerit: ambiguous grammars give conflicts." ],
      times: [r("nearly"), r("no backtracking"), r("more powerful"), r("early errors"), r("hard by"), r("big tables"), r("conflicts")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  // 12. memory trick + payoff
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "powerful,", x: 540, y: 540, size: 120, w: 960 },
      { text: "but heavy", x: 540, y: 690, size: 120, w: 960, color: C.coral },
      { line: [140, 860, 940, 860], color: C.cobalt },
      { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("five marks") } ] }),
    <Check key="ck" dur={d} x={540} y={1330} size={180} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "marks", x: 540, y: 1000, z: 1.06 }] }),
];
