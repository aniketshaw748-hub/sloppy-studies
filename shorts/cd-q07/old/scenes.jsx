import { Box, Arrow, Mover, Ico, Tree, Table, Plot, Lanes, Stack, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
// one LR item set drawn as a card: title + item boxes (k = number of kernel items, drawn hot)
const Card = (d, C, { x, y, name, items, k = 1, at = 0 }) => {
  const h = 60 + items.length * 84 + 10, cy = y + h / 2;
  return [
    <Box key={"c" + name} dur={d} x={x} y={cy} w={320} h={h} tone="ghost" at={at} />,
    <Label key={"t" + name} dur={d} text={name} x={x} y={y + 8} w={300} size={40} at={at + 0.05} color={C.coral} />,
    ...items.map((s, i) => <Box key={name + i} dur={d} x={x} y={y + 95 + i * 84} w={280} h={70} label={s} size={42} tone={i < k ? "hot" : "a"} at={at + 0.12 + i * 0.07} />),
  ];
};
export const SCENES = ({ S, ctx, C }) => [
  // 1 HOOK: 7 or 10?
  S(null, (r, d) => [
    <Head key="h" dur={d} text="7 or 10?" y={170} size={200} />,
    <Label key="l0" dur={d} text="LR(0) states" x={540} y={470} size={46} at={0.2} />,
    ...[0, 1, 2, 3, 4, 5, 6].map(i => <Box key={"a" + i} dur={d} x={130 + i * 137} y={620} w={120} h={130} label={"I" + i} size={46} tone="a" at={0.2 + i * 0.07} />),
    <Label key="l1" dur={d} text="LR(1) states" x={540} y={800} size={46} at={r("10")} />,
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <Box key={"b" + i} dur={d} x={130 + (i % 5) * 205} y={960 + Math.floor(i / 5) * 175} w={175} h={140} label={"I" + i} size={46} tone="b" at={r("10") + i * 0.06} />),
    <Box key="g" dur={d} x={540} y={1400} w={940} h={130} label="E→BB  B→bB | c" size={62} tone="hot" at={r("grammar")} />,
  ], { cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "grammar", x: 540, y: 960, z: 1.0 }] }),
  // 2 AUGMENT
  S("Augment first", (r, d) => [
    <Head key="h" dur={d} text="AUGMENT" y={170} size={180} />,
    <Box key="r1" dur={d} x={540} y={700} w={640} h={120} label="E→BB" size={64} at={0.3} />,
    <Box key="r2" dur={d} x={540} y={850} w={640} h={120} label="B→bB" size={64} at={0.5} />,
    <Box key="r3" dur={d} x={540} y={1000} w={640} h={120} label="B→c" size={64} at={0.7} />,
    <Box key="r0" dur={d} x={540} y={1250} w={640} h={140} label="E'→E" size={78} tone="hot" at={r("prime")} />,
    <Arrow key="a" dur={d} x1={540} y1={1175} x2={540} y2={1080} at={r("prime") + 0.15} color={C.coral} width={10} />,
    <Label key="n" dur={d} text="new start rule" x={540} y={1360} size={44} at={r("goes")} color={C.coral} />,
  ], { cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "prime", x: 540, y: 920, z: 1.04 }] }),
  // 3 LR(0) closure of the start: I0
  S("LR0 closure", (r, d) => [
    <Box key="c" dur={d} x={540} y={800} w={900} h={780} tone="ghost" at={0.1} />,
    <Head key="h" dur={d} text="I0" y={150} size={150} sub="LR(0) items" />,
    <Box key="i1" dur={d} x={540} y={560} w={780} h={120} label="E'→•E" size={64} tone="hot" at={r("E prime")} />,
    <Box key="i2" dur={d} x={540} y={720} w={780} h={120} label="E→•BB" size={64} at={r("E dot BB")} />,
    <Box key="i3" dur={d} x={540} y={880} w={780} h={120} label="B→•bB" size={64} at={r("B dot BB")} />,
    <Box key="i4" dur={d} x={540} y={1040} w={780} h={120} label="B→•c" size={64} at={r("B dot C")} />,
    <Label key="k" dur={d} text="kernel" x={850} y={500} w={200} size={34} at={r("E prime") + 0.2} color={C.coral} />,
    <Label key="cl" dur={d} text="closure adds B-rules" x={540} y={1250} w={900} size={44} at={r("B dot BB")} color={C.coral} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "E dot BB", x: 540, y: 850, z: 1.04 }, { t: "B dot C", x: 540, y: 930, z: 1.06 }] }),
  // 4 goto: all 7 LR(0) item sets
  S("Go to on", (r, d) => [
    ...Card(d, C, { x: 200, y: 400, name: "I0", items: ["E'→•E", "E→•BB", "B→•bB", "B→•c"], at: 0.1 }),
    ...Card(d, C, { x: 200, y: 870, name: "I1", items: ["E'→E•"], at: 0.45 }),
    ...Card(d, C, { x: 540, y: 400, name: "I2", items: ["E→B•B", "B→•bB", "B→•c"], at: 0.8 }),
    ...Card(d, C, { x: 540, y: 770, name: "I5", items: ["E→BB•"], at: 2.0 }),
    ...Card(d, C, { x: 880, y: 400, name: "I3", items: ["B→b•B", "B→•bB", "B→•c"], at: 1.25 }),
    ...Card(d, C, { x: 880, y: 770, name: "I4", items: ["B→c•"], at: 1.55 }),
    ...Card(d, C, { x: 880, y: 954, name: "I6", items: ["B→bB•"], at: 2.25 }),
    <Box key="n" dur={d} x={400} y={1300} w={640} h={170} label="7 STATES" size={88} tone="hot" at={r("7 states")} />,
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "7 states", x: 540, y: 960, z: 1.0 }], cut: "whip" }),
  // 5 LR(1) adds a lookahead
  S("LR1 adds", (r, d) => [
    <Head key="h" dur={d} text="LR(1)" y={150} size={170} sub="item = LR(0) item + lookahead" />,
    <Box key="i1" dur={d} x={370} y={580} w={600} h={110} label="E'→•E" size={60} tone="hot" at={0.25} />,
    <Box key="i2" dur={d} x={370} y={720} w={600} h={110} label="E→•BB" size={60} at={0.35} />,
    <Box key="i3" dur={d} x={370} y={860} w={600} h={110} label="B→•bB" size={60} at={0.45} />,
    <Box key="i4" dur={d} x={370} y={1000} w={600} h={110} label="B→•c" size={60} at={0.55} />,
    <Box key="l1" dur={d} x={840} y={580} w={210} h={110} label="$" size={64} tone="b" at={r("Dollar")} />,
    <Box key="l2" dur={d} x={840} y={720} w={210} h={110} label="$" size={64} tone="b" at={r("Dollar") + 0.2} />,
    <Box key="l3" dur={d} x={840} y={860} w={210} h={110} label="b/c" size={56} tone="b" at={r("B or C")} />,
    <Box key="l4" dur={d} x={840} y={1000} w={210} h={110} label="b/c" size={56} tone="b" at={r("B or C") + 0.2} />,
    <Label key="f" dur={d} text="FIRST(B) = {b, c}" x={540} y={1120} w={900} size={48} at={r("after the first")} color={C.coral} />,
    <Mascot key="t" dur={d} size={270} tag="$" pts={[{ t: 0, x: 540, y: 1350, look: [0, -1], mood: "idle" }, { t: r("Dollar"), x: 540, y: 1350, look: [1, -1], mood: "think" }, { t: r("B or C"), x: 540, y: 1350, look: [1, -1], mood: "happy" }]} />,
  ], { cam: [{ t: 0, x: 530, y: 860, z: 1.0 }, { t: "Dollar", x: 530, y: 900, z: 1.03 }, { t: "after the first", x: 530, y: 980, z: 1.03 }] }),
  // 6 different lookahead => split (one example)
  S("States with different", (r, d) => [
    <Head key="h" dur={d} text="SPLIT" y={170} size={230} />,
    <Box key="core" dur={d} x={540} y={680} w={420} h={130} label="B→c•" size={70} tone="a" at={0.2} />,
    <Label key="c0" dur={d} text="LR(0): one state" x={540} y={780} w={600} size={36} at={0.3} color={C.coral} />,
    <Arrow key="a1" dur={d} x1={450} y1={860} x2={320} y2={990} at={r("different")} color={C.coral} width={9} />,
    <Arrow key="a2" dur={d} x1={630} y1={860} x2={760} y2={990} at={r("different") + 0.1} color={C.coral} width={9} />,
    <Box key="s1" dur={d} x={280} y={1080} w={420} h={130} label="B→c•, b/c" size={56} tone="b" at={r("look") + 0.1} />,
    <Box key="s2" dur={d} x={800} y={1080} w={420} h={130} label="B→c•, $" size={56} tone="hot" at={r("look") + 0.3} />,
    <Label key="sm" dur={d} text={"same core, different lookahead\n= different state"} x={540} y={1300} w={960} size={44} at={r("split")} color={C.coral} />,
  ], { cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "look", x: 540, y: 960, z: 1.04 }] }),
  // 7 the three states that split
  S("The states", (r, d) => {
    const rows = [["B→b•B", "B dot B", 560], ["B→c•", "C dot", 920], ["B→bB•", "BB dot", 1280]];
    return [
      ...rows.flatMap(([it, cue, y]) => { const t = r(cue); return [
        <Box key={"L" + it} dur={d} x={190} y={y} w={300} h={110} label={it} size={46} at={t} />,
        <Arrow key={"u" + it} dur={d} x1={350} y1={y} x2={410} y2={y - 55} at={t + 0.15} width={7} color={C.coral} />,
        <Arrow key={"v" + it} dur={d} x1={350} y1={y} x2={410} y2={y + 55} at={t + 0.15} width={7} color={C.coral} />,
        <Box key={"R1" + it} dur={d} x={705} y={y - 55} w={560} h={92} label={it + ", b/c"} size={46} tone="b" at={t + 0.3} />,
        <Box key={"R2" + it} dur={d} x={705} y={y + 55} w={560} h={92} label={it + ", $"} size={46} tone="hot" at={t + 0.45} />,
      ]; }),
      <Label key="x2" dur={d} text="each one splits in 2" x={540} y={1450} w={960} size={52} at={r("each")} color={C.coral} />,
    ];
  }, { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "C dot", x: 540, y: 900, z: 1.0 }, { t: "each", x: 540, y: 1000, z: 1.0 }] }),
  // 8 = 10 states
  S("10 states", (r, d) => [
    <Head key="h" dur={d} text="10 STATES" y={170} size={200} />,
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <Box key={"b" + i} dur={d} x={130 + (i % 5) * 205} y={700 + Math.floor(i / 5) * 175} w={175} h={140} label={"I" + i} size={46} tone={i < 7 ? "b" : "hot"} at={0.15 + (i < 7 ? i * 0.04 : 0.5 + (i - 7) * 0.2)} />),
    <Box key="eq" dur={d} x={540} y={1180} w={800} h={150} label="7 + 3 = 10" size={84} tone="hot" at={0.9} />,
  ], { cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: 1.2, x: 540, y: 920, z: 1.0 }], cut: "whip" }),
  // 9 memory: LR(1) = LR(0) + lookahead splits
  S("Memory", (r, d) => [
    <Head key="h" dur={d} text="MEMORY" y={190} size={170} />,
    <Box key="m1" dur={d} x={540} y={560} w={560} h={130} label="LR(1)" size={78} tone="hot" at={r("LR1")} />,
    <Label key="e" dur={d} text="=" x={540} y={650} w={200} size={90} at={r("is")} />,
    <Box key="m2" dur={d} x={540} y={850} w={560} h={130} label="LR(0)" size={78} at={r("LR0")} />,
    <Label key="p" dur={d} text="+" x={540} y={940} w={200} size={90} at={r("plus")} />,
    <Box key="m3" dur={d} x={540} y={1140} w={860} h={130} label="lookahead splits" size={62} tone="b" at={r("look")} />,
  ], { cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "LR0", x: 540, y: 900, z: 1.03 }, { t: "splits", x: 540, y: 960, z: 1.05 }] }),
  // 10 payoff
  S("Write that", (r, d) => [
    <Head key="h" dur={d} text="5 MARKS" y={300} size={210} at={r("marks") - 0.2} />,
    <Check key="ck" dur={d} x={540} y={760} size={240} at={r("Secured")} />,
    <Box key="s" dur={d} x={540} y={1000} w={760} h={150} label="SECURED" size={86} tone="hot" at={r("Secured")} />,
    <Mascot key="t" dur={d} size={290} tag="$" pts={[{ t: 0, x: 540, y: 1330, look: [0, -1], mood: "idle" }, { t: r("Secured"), x: 540, y: 1330, look: [0, -1], mood: "happy" }]} />,
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "Secured", x: 540, y: 960, z: 1.1 }], cut: "punch" }),
];
