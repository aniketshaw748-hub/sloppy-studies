import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Layer, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
import { C } from "./theme.jsx";
// ---- helpers: item text (dot amber, lookahead green) and state boxes ----
const CWM = 0.602;
const FADE = [{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.18 }];
const POP = [{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.12 }, { property: "scale", from: 0.55, to: 1, at: 0, duration: 0.38, easing: [0.34, 1.56, 0.64, 1] }];
function Itx({ dur, x, y, fs = 40, line, at = 0, out, reg = true, on }) {
  const [core, la] = line.split(" , "); const cw = fs * CWM; const parts = [];
  const [a, b] = core.split("•");
  parts.push([a.replace(/\s+$/, ""), 0, C.navy]);
  if (b !== undefined) { parts.push(["•", a.length, C.coral]); if (b) parts.push([b, a.length + 1, C.navy]); }
  if (la !== undefined) { parts.push([",", core.length + 1, C.navy]); parts.push([la, core.length + 3, C.cobalt]); }
  const total = la !== undefined ? core.length + 3 + la.length : core.length;
  if (reg) bb({ k: "label", n: line, x, y, w: total * cw, h: fs * 1.25, t0: at, t1: out ?? dur, on });
  return <Layer at={at} dur={dur} out={out} anim={FADE}>
    {parts.map(([s, off, col], i) => s ? <text key={i} x={x + off * cw} y={y} width={s.length * cw + 12} fontFamily={C.fMono} fontWeight={700} fontSize={fs} color={col}>{s}</text> : null)}
  </Layer>;
}
const Ul = ({ dur, x, y, fs, idx, at }) => <Layer at={at} dur={dur} sfx="ping" anim={FADE}><rect x={x + idx * fs * CWM + 3} y={y + fs * 1.1} width={fs * CWM - 6} height={7} radius={3} fill={C.coral} /></Layer>;
const dotXY = (x, y, fs, line) => [x + (line.split("•")[0].length + 0.5) * fs * CWM, y + fs * 0.62];
function St({ dur, x, y, w, title, lines, at = 0, out, fs = 34, lat, on }) {
  const rh = fs * 1.4, h = 14 + rh * ((title ? 1 : 0) + lines.length) + 12, L = x - w / 2 + 18;
  bb({ k: "box", n: title || lines[0], x: x - w / 2, y, w: w + 9, h: h + 9, t0: at, t1: out ?? dur, on });
  return [
    <Layer key="b" at={at} dur={dur} out={out} anim={POP} sfx="pop">
      <rect x={x - w / 2 + 9} y={y + 9} width={w} height={h} radius={10} fill={C.navy} opacity={0.9} />
      <rect x={x - w / 2} y={y} width={w} height={h} radius={10} fill={C.chip} strokeColor={C.navy} strokeWidth={4} />
      {title ? <text x={L} y={y + 14} width={w - 36} fontFamily={C.fMono} fontWeight={700} fontSize={fs} color={C.coral}>{title}</text> : null}
    </Layer>,
    ...lines.map((ln, i) => <Itx key={i} dur={dur} out={out} x={L} y={y + 14 + rh * ((title ? 1 : 0) + i)} fs={fs} line={ln} at={lat ? lat[i] : at + 0.25 + i * 0.12} reg={false} />),
  ];
}
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Construct the sets of LR(0) items and LR(1) items for E→BB, B→bB, B→c.", n: 7, marks: 5, y: 520 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "items", x: 540, y: 780, z: 1.05 }] }),

  // 2. from zero: a grammar is recipes; an item is a recipe with a bookmark (the dot)
  S("let's start", (r, d) => [
    <Head key="h" dur={d} text="the item" y={170} size={140} sub="a recipe with a bookmark" at={0.1} />,
    ...Sketch({ dur: d, at: r("grammar"), speed: 3200, items: [
      { rect: [160, 480, 760, 110], label: "E → BB", size: 64 },
      { rect: [160, 620, 760, 110], label: "B → bB", size: 64 },
      { rect: [160, 760, 760, 110], label: "B → c", size: 64 } ] }),
    <Label key="g" dur={d} text="the grammar = 3 recipes" x={540} y={905} w={900} size={44} color={C.coral} at={r("recipes")} />,
    <Itx key="i1" dur={d} x={140} y={1010} fs={84} line="E → •BB" at={r("bookmark")} />,
    <Ring key="rg" dur={d} x={dotXY(140, 1010, 84, "E → •BB")[0]} y={dotXY(140, 1010, 84, "E → •BB")[1]} r={32} at={r("dot")} />,
    <Label key="c1" dur={d} text="nothing read" x={520} y={1030} w={500} size={50} align="left" at={r("nothing")} />,
    <Itx key="i2" dur={d} x={140} y={1150} fs={84} line="E → BB•" at={r("the end")} />,
    <Label key="c2" dur={d} text="recipe complete" x={520} y={1170} w={520} size={50} align="left" at={r("recipe complete")} />,
  ], { hold: "complete", holdY: 800, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "bookmark", x: 540, y: 880, z: 1.04 }] }),

  // 3. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 470, size: 74, w: 960 },
      { text: "1.  LR(0) item sets", x: 190, y: 640, size: 58, w: 880, align: "left", at: r("item sets") },
      { text: "no lookahead", x: 250, y: 730, size: 44, w: 700, align: "left", color: C.cobalt, at: r("without") },
      { text: "2.  LR(1) item sets", x: 190, y: 900, size: 58, w: 880, align: "left", at: r("that carry") },
      { text: "with a lookahead symbol", x: 250, y: 990, size: 44, w: 800, align: "left", color: C.cobalt, at: r("lookahead symbol") } ] }),
    <Check key="k1" dur={d} x={130} y={668} size={70} at={r("called") + 0.4} />,
    <Check key="k2" dur={d} x={130} y={928} size={70} at={r("symbol") + 0.9} />,
  ]),

  // 4. step 0: augment with a new start rule
  S("first add", (r, d) => [
    <Head key="h" dur={d} text="augment" y={170} size={140} sub="add a new start rule" at={0.1} />,
    ...Sketch({ dur: d, at: r("start rule"), items: [{ rect: [190, 620, 700, 170], label: "E' → E", size: 96 }] }),
    <Label key="l" dur={d} text="new start rule" x={540} y={840} w={800} size={52} color={C.coral} at={r("e dash")} />,
    <Box key="m1" dur={d} x={290} y={1050} w={420} h={130} size={56} label="closure" tone="a" at={r("then two")} />,
    <Box key="m2" dur={d} x={790} y={1050} w={420} h={130} size={56} label="goto" tone="b" at={r("moves") + 0.5} />,
  ], { hold: "then two", holdY: 760 }),

  // 5. closure
  S("closure", (r, d) => [
    <Head key="h" dur={d} text="closure" y={170} size={140} sub="dot before B: add B rules" at={0.1} />,
    <Itx key="i" dur={d} x={290} y={470} fs={72} line="E → •BB" at={0.3} />,
    <Ul key="ul" dur={d} x={290} y={470} fs={72} idx={5} at={r("before")} />,
    <Arrow key="a1" dur={d} x1={400} y1={580} x2={400} y2={690} color={C.cobalt} width={7} at={r("add every")} />,
    <Itx key="i1" dur={d} x={290} y={720} fs={72} line="B → •bB" at={r("recipe")} />,
    <Itx key="i2" dur={d} x={290} y={840} fs={72} line="B → •c" at={r("recipe") + 0.4} />,
    <Label key="l" dur={d} text="every B recipe, dot at the front" x={540} y={990} w={960} size={44} color={C.coral} at={r("with the dot")} />,
  ], { hold: "front", holdY: 700 }),

  // 6. goto
  S("go to move", (r, d) => [
    <Head key="h" dur={d} text="goto" y={170} size={140} sub="move the dot over one symbol" at={0.1} />,
    <Itx key="i" dur={d} x={290} y={470} fs={72} line="E → •BB" at={0.3} />,
    <Arrow key="a" dur={d} x1={400} y1={580} x2={400} y2={690} color={C.cobalt} width={7} at={r("dot")} />,
    <Label key="ob" dur={d} text="over B" x={430} y={618} w={300} size={36} align="left" color={C.coral} at={r("dot")} />,
    <Itx key="i2" dur={d} x={290} y={720} fs={72} line="E → B•B" at={r("over")} />,
    <Ring key="rg" dur={d} x={dotXY(290, 720, 72, "E → B•B")[0]} y={dotXY(290, 720, 72, "E → B•B")[1]} r={28} at={r("over") + 0.3} />,
  ], { hold: "symbol", holdY: 700 }),

  // 7. state 0
  S("state 0", (r, d) => [
    ...St({ dur: d, x: 540, y: 260, w: 900, fs: 60, title: "state 0", at: 0.15,
      lines: ["E' → •E", "E → •BB", "B → •bB", "B → •c"], lat: [r("e dash"), r("e goes to dot"), r("b goes to dot"), r("to dot c")] }),
    <Label key="t1" dur={d} text="← the start rule" x={640} y={373} w={380} size={30} align="left" color={C.coral} at={r("e dash") + 0.4} />,
    <Label key="t2" dur={d} text="← dot before E" x={640} y={457} w={380} size={30} align="left" color={C.coral} at={r("e goes to dot") + 0.4} />,
    <Label key="t3" dur={d} text="← dot before B" x={640} y={541} w={380} size={30} align="left" color={C.coral} at={r("b goes to dot") + 0.4} />,
    <Label key="t4" dur={d} text="← dot before B" x={640} y={625} w={380} size={30} align="left" color={C.coral} at={r("to dot c") + 0.4} />,
    <Label key="gh" dur={d} text="the grammar" x={540} y={960} w={800} size={42} color={C.coral} at={0.4} />,
    <Itx key="g1" dur={d} x={300} y={1040} fs={50} line="E → BB" at={0.6} />,
    <Itx key="g2" dur={d} x={300} y={1120} fs={50} line="B → bB" at={0.75} />,
    <Itx key="g3" dur={d} x={300} y={1200} fs={50} line="B → c" at={0.9} />,
  ], { hold: "dot c", holdY: 800, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "e goes", x: 540, y: 820, z: 1.04 }] }),

  // 8. the graph of states
  S("go to over e", (r, d) => {
    const t = (n) => r("state " + n);
    const X = [170, 400, 630, 860];
    const ch = [
      { n: 1, x: X[0], title: "I1", lines: ["E' → E•"], sym: "E", sx: 430 },
      { n: 2, x: X[1], title: "I2", lines: ["E → B•B", "B → •bB", "B → •c"], sym: "B", sx: 500 },
      { n: 3, x: X[2], title: "I3", lines: ["B → b•B", "B → •bB", "B → •c"], sym: "b", sx: 580 },
      { n: 4, x: X[3], title: "I4", lines: ["B → c•"], sym: "c", sx: 650 },
    ];
    return [
      ...St({ dur: d, x: 540, y: 160, w: 270, fs: 34, title: "I0", at: 0.1, lines: ["E' → •E", "E → •BB", "B → •bB", "B → •c"], lat: [0.4, 0.5, 0.6, 0.7] }),
      ...ch.flatMap((c) => [
        <Arrow key={"a" + c.n} dur={d} x1={c.sx} y1={430} x2={c.x} y2={690} color={C.cobalt} width={6} at={t(c.n) - 0.7} />,
        <Label key={"l" + c.n} dur={d} text={c.sym} x={(c.sx + c.x) / 2 + 24} y={540} w={60} size={36} align="left" color={C.coral} at={t(c.n) - 0.6} />,
        ...St({ dur: d, x: c.x, y: 700, w: 215, fs: 34, title: c.title, lines: c.lines, at: t(c.n) - 0.1 }),
      ]),
      <Arrow key="a5" dur={d} x1={400} y1={925} x2={400} y2={1120} color={C.cobalt} width={6} at={t(5) - 0.7} />,
      <Label key="lb5" dur={d} text="B" x={425} y={1005} w={60} size={36} align="left" color={C.coral} at={t(5) - 0.6} />,
      ...St({ dur: d, x: 400, y: 1130, w: 215, fs: 34, title: "I5", lines: ["E → BB•"], at: t(5) - 0.1 }),
      <Arrow key="a6" dur={d} x1={630} y1={925} x2={630} y2={1120} color={C.cobalt} width={6} at={t(6) - 0.7} />,
      <Label key="lb6" dur={d} text="B" x={655} y={1005} w={60} size={36} align="left" color={C.coral} at={t(6) - 0.6} />,
      ...St({ dur: d, x: 630, y: 1130, w: 215, fs: 34, title: "I6", lines: ["B → bB•"], at: t(6) - 0.1 }),
      <Label key="l2" dur={d} text="b → I3, c → I4" x={235} y={1010} w={330} size={30} color={C.coral} at={r("other moves")} />,
      <Label key="l3" dur={d} text="b → I3, c → I4" x={835} y={1010} w={330} size={30} color={C.coral} at={r("other moves") + 0.4} />,
      <Label key="n7" dur={d} text="7 sets" x={540} y={1300} w={700} size={96} color={C.coral} at={r("7 sets")} />,
    ];
  }, { hold: "so lr0", holdY: 880, cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "state 2", x: 540, y: 760, z: 1.02 }, { t: "state 5", x: 540, y: 880, z: 1.0 }] }),

  // 9. LR(1): the lookahead idea
  S("now lr1", (r, d) => [
    <Head key="h" dur={d} text="lookahead" y={170} size={130} sub="symbol allowed to come next" at={0.1} />,
    <Itx key="i0" dur={d} x={140} y={520} fs={76} line="B → •c" at={0.3} out={r("lookahead")} />,
    <Itx key="i1" dur={d} x={140} y={520} fs={76} line="B → •c , b" at={r("lookahead")} />,
    <Arrow key="a" dur={d} x1={598} y1={730} x2={598} y2={625} color={C.coral} width={7} at={r("lookahead") + 0.3} />,
    <Label key="l" dur={d} text="lookahead" x={598} y={750} w={400} size={46} color={C.coral} at={r("lookahead") + 0.3} />,
    <Mascot key="tok" dur={d} size={170} tag="b" pts={[{ t: 0, x: 860, y: 640, look: [-1, 0], mood: "idle" }, { t: r("symbol"), x: 860, y: 640, look: [-1, 0], mood: "think" }, { t: r("next"), x: 860, y: 640, look: [-1, 0], mood: "happy" }]} />,
  ], { hold: "next", holdY: 700 }),

  // 10. LR(1) state 0
  S("state 0 starts", (r, d) => [
    ...St({ dur: d, x: 540, y: 260, w: 700, fs: 56, title: "state 0", at: 0.15,
      lines: ["E' → •E , $", "E → •BB , $", "B → •bB , b/c", "B → •c , b/c"], lat: [r("starts"), r("dollar"), r("inherit"), r("inherit") + 0.5] }),
    <Label key="q" dur={d} text={"after the 1st B comes the 2nd B,\nso it starts with b or c"} x={540} y={820} w={960} size={44} color={C.coral} at={r("what can")} />,
  ], { hold: "b or c", holdY: 800 }),

  // 11. the same cores split by lookahead
  S("states 3", (r, d) => {
    const rows = [
      { y: 300, n: "3", core: ["B → b•B", "B → •bB", "B → •c"], at: r("3") },
      { y: 620, n: "4", core: ["B → c•"], at: r("4") },
      { y: 840, n: "6", core: ["B → bB•"], at: r("6") },
    ];
    const t1 = r("once with"), t2 = r("once with dollar");
    return [
      ...rows.flatMap((w, i) => [
        ...St({ dur: d, x: 135, y: w.y, w: 180, fs: 34, title: "I" + w.n, lines: w.core, at: w.at }),
        ...St({ dur: d, x: 411, y: w.y, w: 302, fs: 34, title: "b/c", lines: w.core.map((s) => s + " , b/c"), at: t1 + i * 0.25 }),
        ...St({ dur: d, x: 731, y: w.y, w: 262, fs: 34, title: "$", lines: w.core.map((s) => s + " , $"), at: t2 + i * 0.25 }),
      ]),
      <Label key="s" dur={d} text="7 + 3 = 10 sets" x={540} y={1120} w={900} size={80} color={C.coral} at={r("10 sets")} />,
    ];
  }, { hold: "so lr1", holdY: 800, cam: [{ t: 0, x: 540, y: 620, z: 1.0 }, { t: "once with", x: 540, y: 640, z: 1.0 }] }),

  // 12. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 34, title: "WRITE THIS · 5 MARKS", points: [
      "Augment: E' → E (new start rule).",
      "LR(0) I0: E'→•E, E→•BB, B→•bB, B→•c",
      "I1: E'→E•   I4: B→c•   I5: E→BB•   I6: B→bB•",
      "I2: E→B•B, B→•bB, B→•c   I3: B→b•B, B→•bB, B→•c",
      "LR(0) = 7 sets (I0 to I6).",
      "LR(1) I0: E'→•E,$  E→•BB,$  B→•bB,b/c  B→•c,b/c",
      "Same cores, lookahead b/c or $: I3/I6, I4/I7, I8/I9.",
      "LR(1) = 10 sets (I0 to I9)." ],
      times: [r("augment"), r("lr0"), r("lr0") + 0.5, r("lr0") + 1.0, r("7 states"), r("lr1"), r("lr1") + 0.5, r("10 states")] }),
  ], { cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: 1, x: 540, y: 880, z: 1.0 }] }),

  // 13. memory trick + payoff
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "7 grows to 10", x: 540, y: 560, size: 90, w: 960 },
      { line: [140, 700, 940, 700], color: C.coral },
      { text: "lookahead splits 3 states", x: 540, y: 780, size: 56, w: 960, color: C.cobalt },
      { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("5 marks") } ] }),
    <Check key="ck" dur={d} x={540} y={1360} size={180} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "5 marks", x: 540, y: 1000, z: 1.06 }] }),
];
