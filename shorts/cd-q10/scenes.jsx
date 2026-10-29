import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Layer, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
import { C } from "./theme.jsx";
const CWM = 0.602;
const FADE = [{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.18 }];
function Itx({ dur, x, y, fs = 40, line, at = 0, out, reg = true, on, col }) {
  const cw = fs * CWM;
  if (reg) bb({ k: "label", n: line, x, y, w: line.length * cw, h: fs * 1.25, t0: at, t1: out ?? dur, on });
  return <Layer at={at} dur={dur} out={out} anim={FADE}>
    <text x={x} y={y} width={line.length * cw + 14} fontFamily={C.fMono} fontWeight={700} fontSize={fs} color={col || C.navy}>{line}</text>
  </Layer>;
}
const Ul = ({ dur, x, y, fs, idx, len = 1, at }) => <Layer at={at} dur={dur} sfx="ping" anim={FADE}><rect x={x + idx * fs * CWM + 3} y={y + fs * 1.1} width={len * fs * CWM - 6} height={8} radius={4} fill={C.coral} /></Layer>;
// open-top container (a stack)
const Cont = ({ dur, x1, x2, y1, y2, at }) => <Layer at={at} dur={dur} anim={FADE}><path d={`M ${x1} ${y1} L ${x1} ${y2} L ${x2} ${y2} L ${x2} ${y1}`} x={0} y={0} width={1080} height={1920} stroke={{ width: 7, color: C.navy, cap: "round" }} /></Layer>;
const POP = [{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.12 }, { property: "scale", from: 0.55, to: 1, at: 0, duration: 0.38, easing: [0.34, 1.56, 0.64, 1] }];
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
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Explain viable prefixes.", n: 10, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "prefixes", x: 540, y: 780, z: 1.05 }] }),

  // 2. from zero: the parser reads left to right and keeps what it has read on a stack
  S("let's start", (r, d) => {
    const t1 = r("keeps"), t2 = r("stack") + 0.2;
    return [
      <Head key="h" dur={d} text="the stack" y={165} size={120} sub="what we have read so far" at={0.1} />,
      <Label key="in" dur={d} text="input, read left to right" x={540} y={400} w={800} size={36} color={C.coral} at={r("sentence")} />,
      <Box key="a1" dur={d} x={240} y={520} w={200} h={110} size={60} label="id" tone="b" at={r("sentence")} out={t1} />,
      <Box key="a2" dur={d} x={540} y={520} w={200} h={110} size={60} label="+" tone="b" at={r("sentence") + 0.15} out={t2} />,
      <Box key="a3" dur={d} x={840} y={520} w={200} h={110} size={60} label="id" tone="b" at={r("sentence") + 0.3} />,
      <Cont key="c" dur={d} x1={380} x2={700} y1={1040} y2={1390} at={0.4} />,
      <Mascot key="k1" dur={d} at={t1} out={t1 + 0.9} size={170} tag="id" pts={[{ t: t1, x: 240, y: 520, look: [0, 1] }, { t: t1 + 0.88, x: 540, y: 1296, look: [0, 1] }]} />,
      <Box key="s1" dur={d} x={540} y={1300} w={300} h={104} size={56} label="id" tone="b" at={t1 + 0.92} />,
      <Mascot key="k2" dur={d} at={t2} out={t2 + 0.9} size={170} tag="+" pts={[{ t: t2, x: 540, y: 520, look: [0, 1] }, { t: t2 + 0.88, x: 540, y: 1150, look: [0, 1] }]} />,
      <Box key="s2" dur={d} x={540} y={1182} w={300} h={104} size={56} label="+" tone="b" at={t2 + 0.92} />,
      <Label key="l" dur={d} text="like holding words in your hand" x={540} y={1450} w={960} size={40} color={C.coral} at={r("hand")} />,
    ];
  }, { hold: "phrase", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  // 3. reduce: the piece on top that matches a right side is the handle
  S("when the top", (r, d) => [
    <Head key="h" dur={d} text="reduce" y={165} size={130} sub="swap right side for left" at={0.1} />,
    <Itx key="rule" dur={d} x={378} y={420} fs={90} line="T → id" at={0.3} />,
    <Label key="rs" dur={d} text="right side" x={650} y={548} w={300} size={38} color={C.coral} at={r("right side")} />,
    <Label key="ls" dur={d} text="left side" x={405} y={548} w={240} size={38} color={C.coral} at={r("left side")} />,
    <Cont key="c" dur={d} x1={400} x2={680} y1={800} y2={1130} at={0.3} />,
    <Box key="b1" dur={d} x={540} y={1015} w={200} h={100} size={56} label="id" tone="b" at={0.5} out={r("swaps")} />,
    <Ring key="rg" dur={d} x={540} y={1015} r={90} at={r("matches")} />,
    <Box key="b2" dur={d} x={540} y={1015} w={200} h={100} size={56} label="T" tone="hot" at={r("swaps")} />,
    <Arrow key="ha" dur={d} x1={696} y1={1015} x2={662} y2={1015} color={C.coral} width={7} at={r("handle")} />,
    <Label key="hl" dur={d} text="handle = id" x={700} y={992} w={330} size={40} align="left" color={C.coral} at={r("handle")} />,
  ], { hold: "handle", holdY: 800 }),

  // 4. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 480, size: 74, w: 960 },
      { text: "1.  what it is", x: 190, y: 680, size: 60, w: 840, align: "left", at: r("what a") },
      { text: "2.  why it matters", x: 190, y: 860, size: 60, w: 840, align: "left", at: r("why it") } ] }),
    <Check key="k1" dur={d} x={130} y={708} size={70} at={r("what a") + 1.8} />,
    <Check key="k2" dur={d} x={130} y={888} size={70} at={r("why it") + 1.3} />,
  ]),

  // 5. the tiny grammar and the form T + id
  S("take a tiny", (r, d) => [
    ...St({ dur: d, x: 540, y: 200, w: 860, fs: 58, title: "grammar", at: 0.2, lines: ["E → E + T | T", "T → id"], lat: [r("e goes"), r("t goes")] }),
    <Label key="r1" dur={d} text="id + id" x={540} y={600} w={700} size={90} at={r("parsing")} />,
    <Arrow key="a" dur={d} x1={540} y1={730} x2={540} y2={830} color={C.cobalt} width={7} at={r("we pass")} />,
    <Label key="al" dur={d} text="reduce id → T" x={590} y={755} w={450} size={38} align="left" color={C.coral} at={r("we pass")} />,
    <Label key="r2" dur={d} text="T + id" x={540} y={870} w={700} size={90} color={C.coral} at={r("the form")} />,
  ], { hold: "t plus id", holdY: 800, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: 1, x: 540, y: 800, z: 1.0 }] }),

  // 6. the handle inside T + id
  S("in it", (r, d) => [
    <Head key="h" dur={d} text="the handle" y={165} size={120} sub="in the form T + id" at={0.1} />,
    <Itx key="f" dur={d} x={324} y={430} fs={120} line="T + id" at={0.3} />,
    <Ul key="u" dur={d} x={324} y={430} fs={120} idx={0} at={r("handle")} />,
    <Label key="hl" dur={d} text="handle" x={360} y={585} w={300} size={46} color={C.coral} at={r("handle")} />,
    <Arrow key="a" dur={d} x1={540} y1={700} x2={540} y2={820} color={C.cobalt} width={7} at={r("next step")} />,
    <Label key="al" dur={d} text="reduce T → E" x={590} y={735} w={450} size={38} align="left" color={C.coral} at={r("turns")} />,
    <Itx key="g" dur={d} x={324} y={860} fs={120} line="E + id" at={r("turns") + 0.1} />,
  ], { hold: "into e", holdY: 800 }),

  // 7. the definition
  S("now the definition", (r, d) => [
    <Head key="h" dur={d} text="viable prefix" y={165} size={120} at={0.1} />,
    <Label key="fl" dur={d} text="a right-sentential form" x={540} y={520} w={900} size={44} color={C.coral} at={r("right")} />,
    <Box key="p1" dur={d} x={190} y={700} w={300} h={120} size={64} label="α" tone="a" at={r("a prefix")} />,
    <Box key="p2" dur={d} x={520} y={700} w={260} h={120} size={50} label="handle" tone="hot" at={r("right")} />,
    <Box key="p3" dur={d} x={830} y={700} w={300} h={120} size={44} label="terminals" tone="b" at={r("right") + 0.3} />,
    ...Sketch({ dur: d, at: r("does not"), items: [
      { line: [665, 600, 665, 820], dashed: true, color: C.coral },
      { line: [40, 870, 665, 870], color: C.coral }, { line: [40, 840, 40, 870], color: C.coral }, { line: [665, 840, 665, 870], color: C.coral },
      { text: "viable prefix ends here", x: 350, y: 905, size: 46, w: 640, color: C.coral } ] }),
  ], { hold: "handle", holdY: 780, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 1, x: 540, y: 760, z: 1.0 }] }),

  // 8. test the prefixes of T + id
  S("take the prefixes", (r, d) => [
    <Itx key="f" dur={d} x={180} y={290} fs={100} line="T + id" at={0.2} />,
    <Ul key="u" dur={d} x={180} y={290} fs={100} idx={0} at={0.7} />,
    <Label key="hl" dur={d} text="handle" x={210} y={430} w={240} size={38} color={C.coral} at={0.7} />,
    <Box key="b1" dur={d} x={250} y={640} w={300} h={110} size={60} label="ε" tone="a" at={r("empty")} />,
    <Check key="c1" dur={d} x={470} y={640} size={80} at={r("viable")} />,
    <Label key="t1" dur={d} text="empty: viable" x={540} y={620} w={500} size={40} align="left" at={r("viable")} />,
    <Box key="b2" dur={d} x={250} y={820} w={300} h={110} size={60} label="T" tone="a" at={r("t is")} />,
    <Check key="c2" dur={d} x={470} y={820} size={80} at={r("t is") + 0.6} />,
    <Label key="t2" dur={d} text="ends at the handle" x={540} y={800} w={500} size={40} align="left" at={r("it ends")} />,
    <Box key="b3" dur={d} x={250} y={1000} w={300} h={110} size={60} label="T +" tone="a" at={r("t plus is")} />,
    <XMark key="x3" dur={d} x={470} y={1000} size={70} at={r("not viable")} />,
    <Label key="t3" dur={d} text={"sticks out\npast the handle"} x={540} y={955} w={500} size={38} align="left" color={C.coral} at={r("it sticks")} />,
  ], { hold: "past the handle", holdY: 800, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 1, x: 540, y: 760, z: 1.0 }] }),

  // 9a. the stack always holds a viable prefix
  S("why does it", (r, d) => {
    const rows = ["id", "T", "E", "E +", "E + id", "E + T", "E"];
    return [
      <Head key="h" dur={d} text="stack contents" y={165} size={100} at={0.1} />,
      <Label key="p" dur={d} text="while parsing id + id" x={540} y={290} w={800} size={36} color={C.coral} at={0.4} />,
      ...rows.flatMap((s, i) => [
        <Box key={"r" + i} dur={d} x={330} y={410 + i * 160} w={320} h={100} size={56} label={s} tone="a" at={1.0 + i * 0.75} />,
        <Check key={"k" + i} dur={d} x={590} y={410 + i * 160} size={64} at={1.25 + i * 0.75} />,
      ]),
      <Label key="al" dur={d} text={"always a\nviable prefix"} x={850} y={760} w={380} size={44} color={C.coral} at={r("always")} />,
    ];
  }, { hold: "happened", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: 1, x: 540, y: 880, z: 1.0 }] }),

  // 9b. not a viable prefix -> error
  S("the moment", (r, d) => [
    <Head key="h" dur={d} text="error" y={165} size={150} sub="stack is not a viable prefix" at={0.1} />,
    <Cont key="c" dur={d} x1={400} x2={680} y1={760} y2={1100} at={0.2} />,
    <Box key="b" dur={d} x={540} y={1000} w={200} h={100} size={64} label="+" tone="a" at={0.5} />,
    <XMark key="x" dur={d} x={540} y={1000} size={110} at={r("not a viable")} />,
    <Mascot key="t" dur={d} size={190} tag="!" pts={[{ t: r("reports"), x: 850, y: 900, look: [-1, 0], mood: "shock" }, { t: r("reports") + 1.0, x: 850, y: 900, look: [-1, 0], mood: "shock" }]} at={r("reports")} />,
    <Label key="l" dur={d} text="syntax error" x={540} y={1250} w={800} size={64} color={C.coral} at={r("error")} />,
  ], { hold: "error", holdY: 800 }),

  // 9c. the LR(0) automaton recognises exactly the viable prefixes
  S("and the automaton", (r, d) => [
    <Head key="h" dur={d} text="LR(0)" y={165} size={140} sub="automaton of items" at={0.1} />,
    ...[["I0", 150], ["I1", 400], ["I4", 650], ["I5", 900]].map(([l, x], i) => <Box key={"s" + i} dur={d} x={x} y={640} w={170} h={100} size={56} label={l} tone={i ? "a" : "hot"} at={r("automaton") + i * 0.35} />),
    ...[["E", 275], ["+", 525], ["T", 775]].flatMap(([s, x], i) => [
      <Arrow key={"a" + i} dur={d} x1={x - 36} y1={640} x2={x + 36} y2={640} color={C.cobalt} width={7} at={r("automaton") + 0.5 + i * 0.35} />,
      <Label key={"l" + i} dur={d} text={s} x={x} y={545} w={80} size={46} color={C.coral} at={r("automaton") + 0.5 + i * 0.35} />,
    ]),
    <Label key="r" dur={d} text="reads: E + T" x={540} y={820} w={900} size={64} color={C.coral} at={r("recognizes")} />,
    <Label key="v" dur={d} text="= a viable prefix" x={540} y={960} w={900} size={56} at={r("viable prefixes")} />,
  ], { hold: "viable prefixes", holdY: 800 }),

  // 10. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 170, fs: 36, title: "WRITE THIS · 5 MARKS", points: [
      "Viable prefix: a prefix of a right-sentential form that does not go past the right end of its handle.",
      "Example: E→E+T|T, T→id. Form T+id has handle T. Viable: ε, T. Not viable: T+, T+id.",
      "Why it matters: the stack always holds a viable prefix; if not, it is an error. LR(0) DFA recognises exactly these." ],
      times: [r("the definition"), r("the example"), r("why the stack")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  // 11. memory trick + payoff
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "never past", x: 540, y: 540, size: 110, w: 960 },
      { text: "the handle", x: 540, y: 690, size: 110, w: 960, color: C.coral },
      { line: [140, 850, 940, 850], color: C.cobalt },
      { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("five marks") } ] }),
    <Check key="ck" dur={d} x={540} y={1330} size={180} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "marks", x: 540, y: 1000, z: 1.06 }] }),
];
