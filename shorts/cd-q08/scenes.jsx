import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Layer, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
import { C } from "./theme.jsx";
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
// the example parse tree for 3*5+4 (E -> E+T | T, T -> T*F | F, F -> digit)
const TN = [
  { id: "E0", l: "E", x: 640, y: 470, v: "19" },
  { id: "E1", l: "E", x: 335, y: 660, par: "E0", v: "15" },
  { id: "P", l: "+", x: 640, y: 660, par: "E0", term: 1 },
  { id: "T4", l: "T", x: 950, y: 660, par: "E0", v: "4" },
  { id: "T2", l: "T", x: 335, y: 850, par: "E1", v: "15" },
  { id: "F7", l: "F", x: 950, y: 850, par: "T4", v: "4" },
  { id: "T3", l: "T", x: 130, y: 1040, par: "T2", v: "3" },
  { id: "M", l: "*", x: 335, y: 1040, par: "T2", term: 1 },
  { id: "F5", l: "F", x: 540, y: 1040, par: "T2", v: "5" },
  { id: "D4", l: "4", x: 950, y: 1040, par: "F7", term: 1, v: "4" },
  { id: "F6", l: "F", x: 130, y: 1230, par: "T3", v: "3" },
  { id: "D5", l: "5", x: 540, y: 1230, par: "F5", term: 1, v: "5" },
  { id: "D3", l: "3", x: 130, y: 1420, par: "F6", term: 1, v: "3" },
];
const treeNodes = (d, { ann = {}, pre = [], base = 0.1 }) => TN.flatMap((n) => {
  const lv = Math.round((n.y - 470) / 190), t0 = base + lv * 0.12, out = [];
  if (n.par) { const p = TN.find((q) => q.id === n.par); out.push(<Arrow key={"e" + n.id} dur={d} x1={p.x} y1={p.y + 60} x2={n.x} y2={n.y - 62} head={false} width={5} at={t0} />); }
  if (pre.includes(n.id)) out.push(<Box key={n.id + "p"} dur={d} x={n.x} y={n.y} w={150} h={110} size={56} label={n.l} sub={"val=" + n.v} tone="hot" at={t0} />);
  else {
    const ta = ann[n.id];
    out.push(<Box key={n.id} dur={d} x={n.x} y={n.y} w={150} h={110} size={56} label={n.l} tone={n.term ? "b" : "a"} at={t0} out={ta} />);
    if (ta != null) out.push(<Box key={n.id + "a"} dur={d} x={n.x} y={n.y} w={150} h={110} size={56} label={n.l} sub={"val=" + n.v} tone="hot" at={ta} />);
  }
  return out;
});
const CAMF = { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] };
// the small 3-node tree  E -> E + T  used to explain the idea
const mini = (d, base) => [
  <Box key="m0" dur={d} x={540} y={620} w={190} h={120} size={64} label="E" tone="a" at={base} />,
  <Arrow key="me1" dur={d} x1={500} y1={684} x2={260} y2={798} head={false} width={5} at={base + 0.4} />,
  <Arrow key="me2" dur={d} x1={540} y1={684} x2={540} y2={798} head={false} width={5} at={base + 0.5} />,
  <Arrow key="me3" dur={d} x1={580} y1={684} x2={820} y2={798} head={false} width={5} at={base + 0.6} />,
  <Box key="m1" dur={d} x={240} y={860} w={190} h={120} size={64} label="E" tone="a" at={base + 0.4} />,
  <Box key="m2" dur={d} x={540} y={860} w={190} h={120} size={64} label="+" tone="b" at={base + 0.5} />,
  <Box key="m3" dur={d} x={840} y={860} w={190} h={120} size={64} label="T" tone="a" at={base + 0.6} />,
];
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Define annotated parse tree, with an example.", n: 8, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "example", x: 540, y: 780, z: 1.05 }] }),

  // 2. from zero: a parse tree is the grammar rules drawn as a family tree
  S("let's start", (r, d) => [
    <Head key="h" dur={d} text="parse tree" y={165} size={120} sub="the rules the compiler used" at={0.1} />,
    <Label key="x" dur={d} text="3 * 5 + 4" x={540} y={410} w={700} size={70} at={r("sum")} />,
    ...mini(d, r("draws")),
    <Label key="p" dur={d} text="parent" x={680} y={600} w={300} size={46} align="left" color={C.coral} at={r("family")} />,
    <Label key="c" dur={d} text="children" x={540} y={1010} w={500} size={46} color={C.coral} at={r("family") + 0.5} />,
  ], { hold: "think", holdY: 760, cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "that is", x: 540, y: 760, z: 1.03 }] }),

  // 3. the name tag idea: an attribute is a value stored on a node
  S("now imagine", (r, d) => [
    <Head key="h" dur={d} text="name tags" y={165} size={120} sub="a number on every node" at={0.1} />,
    ...mini(d, 0.2),
    <Box key="g1" dur={d} x={240} y={1060} w={220} h={90} size={40} label="val=3" tone="hot" at={r("name tag")} />,
    <Arrow key="g1a" dur={d} x1={240} y1={922} x2={240} y2={1012} head={false} width={5} at={r("name tag")} />,
    <Box key="g2" dur={d} x={840} y={1060} w={220} h={90} size={40} label="val=4" tone="hot" at={r("name tag") + 0.3} />,
    <Arrow key="g2a" dur={d} x1={840} y1={922} x2={840} y2={1012} head={false} width={5} at={r("name tag") + 0.3} />,
    <Box key="g3" dur={d} x={850} y={620} w={220} h={90} size={40} label="val=7" tone="hot" at={r("name tag") + 0.6} />,
    <Arrow key="g3a" dur={d} x1={637} y1={620} x2={738} y2={620} head={false} width={5} at={r("name tag") + 0.6} />,
    <Label key="l" dur={d} text="attribute = info stored on a node" x={540} y={1250} w={980} size={36} color={C.coral} at={r("attribute")} />,
  ], { hold: "stored", holdY: 800 }),

  // 4. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 480, size: 74, w: 960 },
      { text: "1.  the definition", x: 190, y: 680, size: 60, w: 840, align: "left", at: r("definition") },
      { text: "2.  an example", x: 190, y: 860, size: 60, w: 840, align: "left", at: r("example") } ] }),
    <Check key="k1" dur={d} x={130} y={708} size={70} at={r("definition") + 0.9} />,
    <Check key="k2" dur={d} x={130} y={888} size={70} at={r("example") + 0.9} />,
  ]),

  // 5. the definition
  S("here is the definition", (r, d) => [
    <Head key="h" dur={d} text="definition" y={165} size={120} at={0.1} />,
    <Box key="b0" dur={d} x={540} y={520} w={900} h={130} size={64} label="annotated parse tree" tone="hot" at={r("annotated")} />,
    <Label key="eq" dur={d} text="=" x={540} y={620} w={200} size={70} color={C.coral} at={r("a parse tree")} />,
    <Box key="b1" dur={d} x={290} y={820} w={420} h={130} size={56} label="parse tree" tone="a" at={r("a parse tree")} />,
    <Label key="pl" dur={d} text="+" x={540} y={795} w={120} size={80} color={C.coral} at={r("attribute")} />,
    <Box key="b2" dur={d} x={790} y={820} w={420} h={150} size={48} label="values" sub="at every node" tone="b" at={r("attribute")} />,
    <Label key="al" dur={d} text="also called a decorated parse tree" x={540} y={1030} w={980} size={42} color={C.coral} at={r("decorated")} />,
  ], { hold: "also called", holdY: 760 }),

  // 6. the grammar and the attribute val
  S("now the example", (r, d) => [
    ...St({ dur: d, x: 540, y: 220, w: 900, fs: 58, title: "grammar", at: 0.2,
      lines: ["E → E + T | T", "T → T * F | F", "F → digit"], lat: [r("e goes"), r("t goes"), r("f goes")] }),
    <Label key="l" dur={d} text="every symbol carries an attribute" x={540} y={680} w={980} size={42} color={C.coral} at={r("each symbol")} />,
    <Box key="v1" dur={d} x={180} y={850} w={260} h={120} size={56} label="E.val" tone="b" at={r("attribute")} />,
    <Box key="v2" dur={d} x={520} y={850} w={260} h={120} size={56} label="T.val" tone="b" at={r("attribute") + 0.3} />,
    <Box key="v3" dur={d} x={860} y={850} w={260} h={120} size={56} label="F.val" tone="b" at={r("attribute") + 0.6} />,
    <Label key="m" dur={d} text="val = the value of that part" x={540} y={1020} w={980} size={42} at={r("val")} />,
  ], { hold: "called val", holdY: 760, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 1, x: 540, y: 760, z: 1.0 }] }),

  // 7. the plain tree
  S("the tree for", (r, d) => [
    <Head key="h" dur={d} text="the parse tree" y={165} size={100} sub="for 3 * 5 + 4" at={0.1} />,
    ...treeNodes(d, { base: 0.4 }),
    <Label key="n" dur={d} text="no values yet" x={830} y={1350} w={400} size={40} color={C.coral} at={r("no values")} />,
  ], { hold: "no values", ...CAMF }),

  // 8. fill in the left branch from the bottom: digits, F, T
  S("now we fill", (r, d) => [
    <Head key="h" dur={d} text="fill in values" y={165} size={100} sub="from the bottom up" at={0.1} />,
    ...treeNodes(d, { base: 0.1, ann: { D3: r("3"), D5: r("5"), D4: r("and 4"), F6: r("f is 3"), F5: r("f is 5"), T3: r("then t") + 0.2, T2: r("3 times") } }),
    <Ring key="rg" dur={d} x={335} y={850} r={84} at={r("is 15")} />,
  ], { hold: "is 15", ...CAMF }),

  // 9. the right branch, then the root
  S("on the right", (r, d) => [
    <Head key="h" dur={d} text="go to the right" y={165} size={100} sub="then up to the top" at={0.1} />,
    ...treeNodes(d, { base: 0.1, pre: ["D3", "D5", "D4", "F6", "F5", "T3", "T2", "E1"], ann: { F7: r("f is 4"), T4: r("t is 4"), E0: r("e adds") } }),
    <Label key="a" dur={d} text="answer = 19" x={830} y={1350} w={400} size={56} color={C.coral} at={r("answer")} />,
    <Ring key="rg" dur={d} x={640} y={470} r={84} at={r("answer")} />,
  ], { hold: "the answer", ...CAMF }),

  // 10. values flow up: synthesized attributes
  S("values flow", (r, d) => [
    <Head key="h" dur={d} text="flow up" y={165} size={100} sub="children to parent" at={0.1} />,
    ...treeNodes(d, { base: 0.1, pre: TN.filter((n) => !n.term || n.id.startsWith("D")).map((n) => n.id) }),
    ...TN.filter((n) => n.par).map((n) => { const p = TN.find((q) => q.id === n.par); const lv = Math.round((n.y - 470) / 190);
      return <Arrow key={"u" + n.id} dur={d} x1={n.x} y1={n.y - 62} x2={p.x} y2={p.y + 62} color={C.coral} width={8} at={r("flow") + 0.2 + (5 - lv) * 0.28} />; }),
    <Label key="s" dur={d} text={"synthesized\nattributes"} x={820} y={1390} w={440} size={44} color={C.coral} at={r("synthesized")} />,
  ], { hold: "attributes", ...CAMF }),

  // 11. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 170, fs: 36, title: "WRITE THIS · 5 MARKS", points: [
      "Annotated parse tree: a parse tree with attribute values shown at every node (decorated parse tree).",
      "Grammar E→E+T|T, T→T*F|F, F→digit; each symbol has attribute val. Rule: E.val = E1.val + T.val.",
      "Tree for 3*5+4: leaves 3, 5, 4 → F.val = 3, 5 → T.val = 15 → F, T = 4 → E.val = 15+4 = 19. Values flow up: synthesized attributes." ],
      times: [r("the definition"), r("the rule"), r("then draw")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  // 12. memory trick + payoff
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "a parse tree", x: 540, y: 540, size: 84, w: 960 },
      { text: "wearing name tags", x: 540, y: 670, size: 70, w: 960, color: C.cobalt },
      { line: [140, 810, 940, 810], color: C.coral },
      { text: "5 marks", x: 540, y: 930, size: 150, w: 900, at: r("five marks") } ] }),
    <Check key="ck" dur={d} x={540} y={1330} size={180} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "marks", x: 540, y: 1000, z: 1.06 }] }),
];
