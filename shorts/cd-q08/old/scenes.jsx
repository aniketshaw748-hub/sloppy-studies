import { Box, Arrow, Ico, Head, Label, Check, Ring } from "./prims.jsx";
const P = { root: [540, 440], e1: [220, 700], plus: [540, 700], t3: [860, 700], t2: [220, 960], f3: [860, 960], f2: [220, 1220], d3: [860, 1220], d2: [220, 1480] };
const L = { root: ["E", 5], e1: ["E", 2], plus: ["+", null], t3: ["T", 3], t2: ["T", 2], f3: ["F", 3], f2: ["F", 2], d3: ["3", null], d2: ["2", null] };
const EDGES = [["root", "e1"], ["root", "plus"], ["root", "t3"], ["e1", "t2"], ["t2", "f2"], ["f2", "d2"], ["t3", "f3"], ["f3", "d3"]];
const tree = (d, pl, va) => [
  ...EDGES.filter(([a, b]) => pl(b) != null).map(([a, b]) => <Arrow key={"e" + b} dur={d} x1={P[a][0]} y1={P[a][1] + 66} x2={P[b][0]} y2={P[b][1] - 66} at={pl(b)} head={false} width={5} />),
  ...Object.keys(P).filter(id => pl(id) != null).map(id => <Box key={id} dur={d} x={P[id][0]} y={P[id][1]} w={250} h={130} label={L[id][0]} size={64} tone={L[id][1] == null ? "b" : "a"} at={pl(id)} out={va(id) != null && va(id) > pl(id) ? va(id) : undefined} />),
  ...Object.keys(P).filter(id => va(id) != null).map(id => <Box key={"v" + id} dur={d} x={P[id][0]} y={P[id][1]} w={250} h={130} label={L[id][0]} sub={"val = " + L[id][1]} size={56} tone="hot" at={va(id)} />),
];
export const SCENES = ({ S, ctx, C }) => [
  // 1 hook: tree gets numbers and computes
  S(null, (r, d) => [
    <Head dur={d} text={"TREE + NUMBERS"} y={190} size={150} />,
    <Arrow dur={d} x1={540} y1={766} x2={220} y2={934} head={false} width={6} at={0.4} />,
    <Arrow dur={d} x1={540} y1={766} x2={540} y2={934} head={false} width={6} at={0.5} />,
    <Arrow dur={d} x1={540} y1={766} x2={860} y2={934} head={false} width={6} at={0.6} />,
    <Box dur={d} x={540} y={700} w={300} h={140} label="E" size={72} at={0.3} out={r("number")} />,
    <Box dur={d} x={220} y={1000} w={300} h={140} label="E" size={72} at={0.7} out={r("number") + 0.2} />,
    <Box dur={d} x={540} y={1000} w={300} h={140} label="+" size={72} tone="b" at={0.8} />,
    <Box dur={d} x={860} y={1000} w={300} h={140} label="T" size={72} at={0.9} out={r("number") + 0.4} />,
    <Box dur={d} x={540} y={700} w={300} h={140} label="E" sub="val = 5" size={64} tone="hot" at={r("number")} />,
    <Box dur={d} x={220} y={1000} w={300} h={140} label="E" sub="val = 2" size={64} tone="hot" at={r("number") + 0.2} />,
    <Box dur={d} x={860} y={1000} w={300} h={140} label="T" sub="val = 3" size={64} tone="hot" at={r("number") + 0.4} />,
    <Ring dur={d} x={540} y={700} r={200} at={r("computes")} />,
  ]),
  // 2 definition
  S("That is", (r, d) => [
    <Box dur={d} x={540} y={420} w={760} h={150} label="PARSE TREE" size={76} at={0.2} />,
    <Label dur={d} text="+" x={540} y={520} w={200} size={120} at={r("attribute")} />,
    <Box dur={d} x={540} y={800} w={860} h={170} label="values on every node" size={60} tone="hot" at={r("attribute")} />,
    <Arrow dur={d} x1={540} y1={900} x2={540} y2={1000} at={r("filled")} color={C.coral} width={12} />,
    <Label dur={d} text="filled in by semantic rules" x={540} y={1060} w={980} size={50} at={r("semantic")} />,
    <Box dur={d} x={540} y={1280} w={900} h={190} label="ANNOTATED PARSE TREE" size={64} tone="b" at={r("annotated") + 0.1} />,
  ]),
  // 3 the rule
  S("Example", (r, d) => [
    <Head dur={d} text="ONE RULE" y={190} size={170} />,
    <Box dur={d} x={540} y={620} w={900} h={150} label="E -> E1 + T" size={76} at={r("E")} />,
    <Box dur={d} x={260} y={980} w={440} h={140} label="E1.val" size={60} at={r("equals") + 0.4} />,
    <Box dur={d} x={820} y={980} w={440} h={140} label="T.val" size={60} at={r("equals") + 1.9} />,
    <Label dur={d} text="+" x={540} y={1010} w={140} size={110} at={r("equals") + 1.4} />,
    <Arrow dur={d} x1={260} y1={1060} x2={450} y2={1260} at={r("equals") + 2.1} color={C.coral} width={10} />,
    <Arrow dur={d} x1={820} y1={1060} x2={630} y2={1260} at={r("equals") + 2.1} color={C.coral} width={10} />,
    <Box dur={d} x={540} y={1350} w={560} h={150} label="E.val" size={68} tone="hot" at={r("dot")} />,
  ]),
  // 4 input 2+3, digits give F.val
  S("Input", (r, d) => [
    ...tree(d, id => 0.2 + ["root", "e1", "plus", "t3", "t2", "f3", "f2", "d3", "d2"].indexOf(id) * 0.15, id => id === "f2" ? r("val") : id === "f3" ? r("and") : null),
  ]),
  // 5 values climb up
  S("Values climb", (r, d) => [
    ...tree(d, () => 0, id => id === "f2" || id === "f3" ? 0 : id === "t2" ? r("climb") : id === "e1" ? r("climb") + 0.5 : id === "t3" ? r("climb") + 0.9 : id === "root" ? r("eval") : null),
    <Arrow dur={d} x1={1030} y1={1450} x2={1030} y2={520} at={r("climb")} color={C.coral} width={14} />,
  ]),
  // 6 synthesized: child -> parent
  S("Synthesized", (r, d) => [
    <Head dur={d} text="SYNTHESIZED" y={170} size={120} />,
    ...tree(d, () => 0, id => (L[id][1] != null ? 0 : null)),
    ...EDGES.filter(([a, b]) => L[b][1] != null).map(([a, b], i) => <Arrow key={"u" + b} dur={d} x1={P[b][0] + 60} y1={P[b][1] - 70} x2={P[a][0] + 60} y2={P[a][1] + 70} at={r("flow") + i * 0.12} color={C.coral} width={12} />),
  ]),
  // 7 memory
  S("Memory", (r, d) => [
    <Box dur={d} x={540} y={620} w={760} h={190} label="parse tree" size={84} at={0.2} />,
    <Label dur={d} text="+" x={540} y={760} w={200} size={150} at={r("plus")} />,
    <Box dur={d} x={540} y={1050} w={760} h={190} label="numbers" size={84} tone="hot" at={r("numbers")} />,
  ]),
  // 8 closer
  S("Write that", (r, d) => [
    <Ico dur={d} ctx={ctx} name="pen-line" x={540} y={650} size={300} at={0} />,
    <Head dur={d} text={"5 MARKS"} y={950} size={230} at={r("Five")} />,
    <Check dur={d} x={540} y={1380} size={240} at={r("secured")} />,
  ], { zoom: 1.08 }),
];
