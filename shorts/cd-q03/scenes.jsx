import { Box, Arrow, Head, Label, Check, Ring } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  // a box in the stack (slot 0 = bottom)
  const item = (d, k, slot, label, at, out, tone, base = 1330) => <Box key={k} dur={d} x={325} y={base - slot * 118} w={300} h={104} size={56} label={label} tone={tone || "a"} at={at} out={out} />;
  const act = (d, k, verb, detail, at, out, col) => [
    <Label key={k + "v"} dur={d} text={verb} x={790} y={850} w={470} size={64} color={col || C.coral} at={at} out={out} />,
    <Label key={k + "d"} dur={d} text={detail} x={790} y={950} w={470} size={44} at={at} out={out} />];
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Explain bottom-up parsing with an example. Also discuss reduction in bottom-up parsing.", n: 3, marks: 5, y: 560 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: 5, x: 540, y: 800, z: 1.05 }] }),
    // 2. from zero: a parse tree can be built two ways; analogy = cooking (ingredients -> dish)
    S("let's start", (r, d) => {
      const t = a => a - 7.4, gone = t(20.4);
      const P = { root: [540, 480], A: [330, 690], B: [750, 690], x: [230, 900], y: [430, 900], z: [750, 900] };
      const edge = (k, a, b, at) => <Arrow key={k} dur={d} x1={P[a][0]} y1={P[a][1] + 58} x2={P[b][0]} y2={P[b][1] - 58} head={false} width={5} at={at} out={gone} />;
      const nb = (k, id, l, tone, at) => <Box key={k} dur={d} x={P[id][0]} y={P[id][1]} w={170} h={110} size={60} label={l} tone={tone} at={at} out={gone} />;
      return [
        <Label key="la" dur={d} text="a parse tree" x={540} y={190} w={900} size={70} at={t(9.4)} out={gone} />,
        nb("n0", "root", "S", "hot", t(10.6)),
        edge("e1", "root", "A", t(11.3)), nb("n1", "A", "A", "a", t(11.3)), edge("e2", "root", "B", t(11.4)), nb("n2", "B", "B", "a", t(11.4)),
        edge("e3", "A", "x", t(11.9)), nb("n3", "x", "x", "b", t(11.9)), edge("e4", "A", "y", t(12.0)), nb("n4", "y", "y", "b", t(12.0)), edge("e5", "B", "z", t(12.1)), nb("n5", "z", "z", "b", t(12.1)),
        <Arrow key="dn" dur={d} x1={980} y1={520} x2={980} y2={950} color={C.cobalt} width={10} at={t(16.0)} out={gone} />,
        <Label key="ld" dur={d} text="top-down" x={860} y={1020} w={360} size={46} color={C.cobalt} at={t(16.3)} out={gone} />,
        <Arrow key="up" dur={d} x1={90} y1={950} x2={90} y2={520} color={C.coral} width={10} at={t(18.8)} out={gone} />,
        <Label key="lu" dur={d} text="bottom-up" x={240} y={1020} w={320} size={46} at={t(19.1)} out={gone} />,
        // cooking
        <Label key="lc" dur={d} text="like cooking" x={540} y={190} w={900} size={70} at={t(20.6)} />,
        ...[["egg", 240], ["flour", 540], ["milk", 840]].map(([l, x], i) => <Box key={"g" + i} dur={d} x={x} y={960} w={190} h={110} size={54} label={l} tone="b" at={t(21.9) + i * 0.2} />),
        <Arrow key="c1" dur={d} x1={270} y1={900} x2={360} y2={800} color={C.coral} width={9} at={t(23.9)} />,
        <Arrow key="c2" dur={d} x1={500} y1={900} x2={430} y2={800} color={C.coral} width={9} at={t(24.1)} />,
        <Box key="bt" dur={d} x={390} y={740} w={230} h={110} size={54} label="batter" tone="a" at={t(24.5)} />,
        <Arrow key="c3" dur={d} x1={810} y1={900} x2={590} y2={590} color={C.coral} width={9} at={t(25.1)} />,
        <Arrow key="c4" dur={d} x1={430} y1={682} x2={500} y2={590} color={C.coral} width={9} at={t(26.7)} />,
        <Box key="ds" dur={d} x={540} y={520} w={250} h={110} size={60} label="dish" tone="hot" at={t(27.0)} />,
      ];
    }, { hold: 20.6, holdY: 760, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 13, x: 540, y: 760, z: 1.0 }] }),
    // 3. what the question wants
    S("so the question", (r, d) => {
      const t = a => a - 29.1;
      return [
        <Head key="h" dur={d} text="2 things" y={190} size={150} at={0.1} />,
        <Box key="b1" dur={d} x={480} y={620} w={780} h={140} size={50} label="1  bottom-up + example" tone="a" at={t(31.5)} />,
        <Check key="c1" dur={d} x={960} y={630} size={90} at={t(32.9)} />,
        <Box key="b2" dur={d} x={480} y={840} w={780} h={140} size={50} label="2  what a reduction is" tone="a" at={t(33.7)} />,
        <Check key="c2" dur={d} x={960} y={850} size={90} at={t(34.9)} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: 6, x: 540, y: 740, z: 1.05 }] }),
    // 4. bottom-up: tokens combine upward until only the start symbol is left
    S("bottom up parsing starts", (r, d) => {
      const t = a => a - 35.8;
      return [
        <Head key="h" dur={d} text="bottom-up" y={170} size={130} at={0.1} />,
        ...[[250, "id"], [540, "+"], [830, "id"]].map(([x, l], i) => <Box key={"k" + i} dur={d} x={x} y={1050} w={150} h={110} size={56} label={l} tone="b" at={t(37.5) + i * 0.15} />),
        <Arrow key="u1" dur={d} x1={250} y1={990} x2={250} y2={896} color={C.coral} width={9} at={t(38.6)} />,
        <Box key="t1" dur={d} x={250} y={830} w={150} h={110} size={56} label="T" tone="a" at={t(38.8)} />,
        <Arrow key="u2" dur={d} x1={830} y1={990} x2={830} y2={896} color={C.coral} width={9} at={t(39.1)} />,
        <Box key="t2" dur={d} x={830} y={830} w={150} h={110} size={56} label="T" tone="a" at={t(39.3)} />,
        <Arrow key="u3" dur={d} x1={250} y1={766} x2={470} y2={668} color={C.coral} width={9} at={t(40.2)} />,
        <Arrow key="u4" dur={d} x1={540} y1={990} x2={540} y2={680} color={C.coral} width={9} at={t(40.3)} />,
        <Arrow key="u5" dur={d} x1={830} y1={766} x2={610} y2={668} color={C.coral} width={9} at={t(40.4)} />,
        <Box key="e" dur={d} x={540} y={610} w={300} h={140} size={66} label="E" sub="start symbol" tone="hot" at={t(40.9)} />,
      ];
    }, { hold: 6.0, holdY: 820, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: 5, x: 540, y: 840, z: 1.03 }] }),
    // 5. the stack and the two moves
    S("it uses a stack", (r, d) => {
      const t = a => a - 42.9, B = 1260;
      return [
        ...[[250, "id"], [420, "+"], [590, "id"]].map(([x, l], i) => <Box key={"p" + i} dur={d} x={x} y={520} w={130} h={100} size={54} label={l} tone="b" at={t(43.0) + i * 0.12} out={i === 0 ? t(46.4) : undefined} />),
        <Label key="in" dur={d} text="input" x={850} y={495} w={300} size={46} at={t(43.2)} />,
        <Arrow key="fl" dur={d} x1={150} y1={B + 70} x2={500} y2={B + 70} head={false} width={8} at={t(43.5)} />,
        <Label key="st" dur={d} text="stack" x={325} y={B + 90} w={300} size={46} at={t(43.6)} />,
        ...act(d, "sh", "SHIFT", "push next input", t(45.9), t(49.1)),
        <Mascot key="tok" dur={d} size={120} tag="id" at={t(46.4)} out={t(47.6)} pts={[{ t: t(46.4), x: 250, y: 520, look: [0, 1], mood: "idle" }, { t: t(47.6), x: 325, y: B, look: [0, 1], mood: "idle" }]} />,
        item(d, "s0", 0, "id", t(47.7), t(51.2), "a", B),
        ...act(d, "rd", "REDUCE", "top → left side", t(49.2), undefined, C.cobalt),
        <Label key="rl" dur={d} text="T → id" x={790} y={1120} w={440} size={54} at={t(50.0)} />,
        item(d, "s1", 0, "T", t(51.3), undefined, "hot", B),
      ];
    }, { hold: 9.1, holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: 5, x: 540, y: 920, z: 1.02 }] }),
    // 6. our grammar and input
    S("our grammar", (r, d) => {
      const t = a => a - 53.2;
      return [
        <Box key="g1" dur={d} x={540} y={520} w={900} h={120} size={60} label="E → E + T | T" tone="a" at={t(54.5)} />,
        <Box key="g2" dur={d} x={540} y={700} w={900} h={120} size={60} label="T → id" tone="a" at={t(58.0)} />,
        <Box key="g3" dur={d} x={540} y={920} w={900} h={120} size={60} label="input :  id + id" tone="b" at={t(59.4)} />,
        <Label key="l1" dur={d} text="the grammar" x={540} y={330} w={900} size={60} color={C.coral} at={t(53.4)} />,
      ];
    }, { hold: 7.6, holdY: 760, cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: 6, x: 540, y: 760, z: 1.04 }] }),
    // 7. watch: shift / reduce trace on a stack
    S("watch", (r, d) => {
      const t = a => a - 61.9, B = 1330;
      const tape = [[250, "id", 63.0], [420, "+", 69.0], [590, "id", 70.3], [760, "$", null]];
      return [
        <Label key="in" dur={d} text="input" x={940} y={455} w={200} size={46} at={0.1} />,
        ...tape.map(([x, l, o], i) => <Box key={"p" + i} dur={d} x={x} y={480} w={130} h={100} size={54} label={l} tone="b" at={0.1 + i * 0.1} out={o ? t(o) : undefined} />),
        <Arrow key="fl" dur={d} x1={150} y1={1405} x2={500} y2={1405} head={false} width={8} at={0.3} />,
        <Label key="st" dur={d} text="stack" x={325} y={1425} w={300} size={46} at={0.4} />,
        // 1 shift id
        ...act(d, "a1", "SHIFT", "id", t(62.8), t(63.9)),
        <Mascot key="m1" dur={d} size={120} tag="id" at={t(63.0)} out={t(64.0)} pts={[{ t: t(63.0), x: 250, y: 480, look: [0, 1] }, { t: t(64.0), x: 325, y: B, look: [0, 1] }]} />,
        item(d, "i1", 0, "id", t(64.0), t(64.9), "a", B),
        // 2 reduce T -> id
        ...act(d, "a2", "REDUCE", "T → id", t(63.9), t(66.2), C.cobalt),
        item(d, "i2", 0, "T", t(65.0), t(67.1), "hot", B),
        // 3 reduce E -> T
        ...act(d, "a3", "REDUCE", "E → T", t(66.3), t(68.7), C.cobalt),
        item(d, "i3", 0, "E", t(67.2), t(75.3), "hot", B),
        // 4 shift +
        ...act(d, "a4", "SHIFT", "+", t(68.8), t(69.95)),
        <Mascot key="m2" dur={d} size={120} tag="+" at={t(69.0)} out={t(69.9)} pts={[{ t: t(69.0), x: 420, y: 480, look: [0, 1] }, { t: t(69.9), x: 325, y: B - 118, look: [0, 1] }]} />,
        item(d, "i4", 1, "+", t(69.9), t(75.3), "a", B),
        // 5 shift id
        ...act(d, "a5", "SHIFT", "id", t(70.0), t(71.1)),
        <Mascot key="m3" dur={d} size={120} tag="id" at={t(70.3)} out={t(71.2)} pts={[{ t: t(70.3), x: 590, y: 480, look: [0, 1] }, { t: t(71.2), x: 325, y: B - 236, look: [0, 1] }]} />,
        item(d, "i5", 2, "id", t(71.2), t(72.2), "a", B),
        // 6 reduce T -> id
        ...act(d, "a6", "REDUCE", "T → id", t(71.2), t(73.5), C.cobalt),
        item(d, "i6", 2, "T", t(72.3), t(75.3), "a", B),
        // 7 reduce E -> E + T
        ...act(d, "a7", "REDUCE", "E → E + T", t(73.6), t(76.6), C.cobalt),
        item(d, "i7", 0, "E", t(75.4), undefined, "hot", B),
        // 8 accept
        <Label key="fin" dur={d} text={"only E left\ninput finished"} x={790} y={850} w={470} size={44} at={t(76.7)} out={t(80.2)} />,
        ...act(d, "a8", "ACCEPT", "start symbol", t(80.3), undefined, C.coral),
        <Check key="ok" dur={d} x={790} y={1150} size={120} at={t(80.4)} />,
      ];
    }, { hold: 17.1, holdY: 960, cam: [{ t: 0, x: 540, y: 960, z: 1.0 }, { t: 1, x: 540, y: 960, z: 1.0 }] }),
    // 8. reduction and the handle
    S("now reduction", (r, d) => {
      const t = a => a - 81.6;
      return [
        <Head key="h" dur={d} text="reduction" y={170} size={130} at={0.1} />,
        <Box key="rl" dur={d} x={540} y={540} w={560} h={120} size={60} label="E → E + T" tone="a" at={t(83.4)} />,
        ...[[380, "E"], [540, "+"], [700, "T"]].map(([x, l], i) => <Box key={"t" + i} dur={d} x={x} y={800} w={140} h={110} size={60} label={l} tone="b" at={t(85.5) + i * 0.2} />),
        <Arrow key="br" dur={d} x1={310} y1={905} x2={770} y2={905} head={false} color={C.coral} width={9} at={t(86.3)} />,
        <Label key="rs" dur={d} text="= right side" x={540} y={930} w={800} size={46} color={C.coral} at={t(86.4)} out={t(94.6)} />,
        <Arrow key="dn" dur={d} x1={540} y1={1010} x2={540} y2={1090} color={C.cobalt} width={9} at={t(87.3)} />,
        <Box key="lf" dur={d} x={540} y={1170} w={200} h={110} size={60} label="E" tone="hot" at={t(87.5)} />,
        <Label key="ll" dur={d} text="left side" x={870} y={1150} w={340} size={46} at={t(87.7)} />,
        <Label key="d1" dur={d} text="derivation:  E ⇒ E + T" x={540} y={1330} w={980} size={48} at={t(89.2)} />,
        <Label key="d2" dur={d} text="reduction = it, run BACKWARDS" x={540} y={1420} w={980} size={46} color={C.coral} at={t(91.0)} />,
        <Label key="hd" dur={d} text="HANDLE" x={540} y={930} w={800} size={64} color={C.coral} at={t(94.6)} />,
      ];
    }, { hold: 13.2, holdY: 860, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: 9, x: 540, y: 900, z: 1.03 }] }),
    // 9. the exam answer
    S("so in your exam", (r, d) => {
      const t = a => a - 96.0;
      return [...AnswerSheet({ dur: d, y: 160, fs: 38, title: "WRITE THIS · 5 MARKS", points: [
        "Bottom-up parsing builds the parse tree from the leaves up to the start symbol.",
        "It uses a stack with two moves: SHIFT (push the next input symbol) and REDUCE.",
        "Example id+id: four reductions T→id, E→T, T→id, E→E+T, then accept.",
        "Reduction = replace a handle (a rule's right side on the stack top) by its left side." ],
        times: [t(98.4), t(101.2), t(103.9), t(107.6)] })];
    }, { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 10. memory trick + payoff
    S("to remember", (r, d) => {
      const t = a => a - 111.2;
      return [
        <Head key="h1" dur={d} text="shift to push" y={430} size={100} at={t(112.4)} />,
        <Head key="h2" dur={d} text="reduce to squash" y={700} size={100} at={t(113.5)} />,
        <Head key="h3" dur={d} text="5 marks" y={1010} size={170} at={t(115.0)} />,
        <Check key="ck" dur={d} x={540} y={1400} size={180} at={t(116.3)} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 5, x: 540, y: 900, z: 1.0 }] }),
  ];
};
