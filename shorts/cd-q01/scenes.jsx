import { Box, Arrow, Mover, Head, Label, Check } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  // a value bubble floating along a path (intentionally on top of boxes)
  const bub = (d, k, pts) => pts[0].t > d - 0.5 ? null : <Mover key={k} dur={d} on at={pts[0].t} out={Math.min(pts[pts.length - 1].t + 0.12, d - 0.02)} cw={64} ch={64} pts={pts}>
    <rect x={0} y={0} width={64} height={64} radius={32} fill={C.coral} strokeColor={C.navy} strokeWidth={4} /></Mover>;
  // one grammar rule drawn as a tree: parent on top, kids under it, formula below, values flow up
  const rule = (d, r, o) => {
    const kx = [230, 540, 850];
    const out = [
      <Head key="h" dur={d} text={o.head} y={190} size={140} at={0.1} />,
      <Box key="p" dur={d} x={540} y={560} w={240} h={140} size={72} label={o.p} sub="val" tone="hot" at={o.pt} />,
    ];
    o.kids.forEach((k, i) => {
      out.push(<Arrow key={"e" + i} dur={d} x1={540} y1={640} x2={kx[i]} y2={786} head={false} width={5} at={o.kt[i]} />);
      out.push(<Box key={"k" + i} dur={d} x={kx[i]} y={860} w={240} h={140} size={72} label={k.l} sub={k.sub} tone={k.sub ? "b" : "a"} at={o.kt[i]} />);
    });
    out.push(<Box key="f" dur={d} x={540} y={1180} w={940} h={130} size={54} label={o.rule} tone="a" at={o.ft} />);
    o.up.forEach((u, i) => {
      const ex = 540 + (u.k === 0 ? -60 : u.k === 2 ? 60 : 0);
      out.push(<Arrow key={"u" + i} dur={d} x1={kx[u.k]} y1={788} x2={ex} y2={646} color={C.coral} width={9} at={u.t} />);
      out.push(bub(d, "b" + i, [{ t: u.t + 0.1, x: kx[u.k], y: 770 }, { t: u.t + 0.7, x: ex, y: 665 }]));
    });
    out.push(<Box key="m" dur={d} x={540} y={1420} w={940} h={110} size={46} label={o.mini} tone="b" at={o.mt} />);
    return out;
  };
  // the parse tree of 3 + 4 * 5
  const NODES = [["E0", 435, 0, "E"], ["E1", 150, 1, "E"], ["pl", 340, 1, "+"], ["T2", 720, 1, "T"], ["T1", 150, 2, "T"], ["T3", 530, 2, "T"], ["mu", 720, 2, "*"], ["F3", 910, 2, "F"],
    ["F1", 150, 3, "F"], ["F2", 530, 3, "F"], ["n5", 910, 3, "5"], ["n3", 150, 4, "3"], ["n4", 530, 4, "4"]];
  const EDGES = [["E0", "E1"], ["E0", "pl"], ["E0", "T2"], ["E1", "T1"], ["T1", "F1"], ["F1", "n3"], ["T2", "T3"], ["T2", "mu"], ["T2", "F3"], ["T3", "F2"], ["F2", "n4"], ["F3", "n5"]];
  const TY = [450, 670, 890, 1110, 1330];
  const NP = Object.fromEntries(NODES.map(([id, x, row, l]) => [id, { id, x, y: TY[row], row, l, tone: /[0-9+*]/.test(l) ? "b" : "a" }]));
  const treeEdge = (d, k, a, b, at) => <Arrow key={k} dur={d} x1={NP[a].x} y1={NP[a].y + 66} x2={NP[b].x} y2={NP[b].y - 62} head={false} width={5} at={at} />;
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "For E→E+T|T, T→T*F|F, F→(E)|id design a Syntax-Directed Definition to evaluate arithmetic expressions; demonstrate for 3+4*5.", n: 1, marks: 5, y: 430 }),
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "working", x: 540, y: 780, z: 1.05 }] }),
    // 2. from zero: a grammar gives SHAPE, we want the ANSWER; analogy = a company
    S("let's start", (r, d) => {
      const gone = r("think") - 0.1;
      const mx = [290, 790], wx = [150, 430, 650, 930], wv = ["2", "3", "1", "4"];
      return [
        <Box key="x" dur={d} x={540} y={330} w={560} h={120} size={64} label="3 + 4 * 5" tone="a" at={0.1} out={gone} />,
        <Box key="t0" dur={d} x={540} y={560} w={140} h={100} size={56} label="E" tone="a" at={r("shape")} out={gone} />,
        ...[330, 540, 750].flatMap((x, i) => [
          <Arrow key={"ta" + i} dur={d} x1={540} y1={620} x2={x} y2={704} head={false} width={5} at={r("shape") + 0.2 + i * 0.12} out={gone} />,
          <Box key={"tk" + i} dur={d} x={x} y={760} w={140} h={100} size={56} label={["E", "+", "T"][i]} tone={i === 1 ? "b" : "a"} at={r("shape") + 0.2 + i * 0.12} out={gone} />]),
        <Label key="sh" dur={d} text="the SHAPE (parse tree)" x={540} y={880} w={900} size={50} color={C.coral} at={r("parse")} out={gone} />,
        <Arrow key="aa" dur={d} x1={540} y1={960} x2={540} y2={1030} color={C.cobalt} width={8} at={r("answer")} out={gone} />,
        <Box key="an" dur={d} x={540} y={1120} w={380} h={150} size={76} label="23" sub="the answer" tone="hot" at={r("answer")} out={gone} />,
        // the company
        <Head key="hc" dur={d} text="a company" y={170} size={110} at={r("think")} />,
        <Box key="boss0" dur={d} x={540} y={520} w={280} h={130} size={56} label="boss" tone="a" at={r("company") + 0.1} out={r("boss") + 0.7} />,
        <Box key="boss1" dur={d} x={540} y={520} w={280} h={130} size={72} label="10" sub="boss" tone="hot" at={r("boss") + 0.7} />,
        ...mx.flatMap((x, i) => [
          <Arrow key={"be" + i} dur={d} x1={540} y1={595} x2={x} y2={722} head={false} width={5} at={r("workers") - 0.2} />,
          <Box key={"m0" + i} dur={d} x={x} y={790} w={260} h={130} size={46} label="manager" tone="a" at={r("workers") - 0.2} out={r("adds")} />,
          <Box key={"m1" + i} dur={d} x={x} y={790} w={260} h={130} size={70} label="5" sub="manager" tone="b" at={r("adds")} />]),
        ...wx.flatMap((x, i) => [
          <Arrow key={"we" + i} dur={d} x1={mx[i < 2 ? 0 : 1]} y1={862} x2={x} y2={998} head={false} width={5} at={r("workers") + 0.15} />,
          <Box key={"w" + i} dur={d} x={x} y={1060} w={170} h={120} size={64} label={wv[i]} tone="a" at={r("workers") + 0.15 + i * 0.1} />]),
        <Label key="wl" dur={d} text="workers" x={540} y={1150} w={600} size={48} at={r("workers") + 0.7} />,
        ...wx.map((x, i) => bub(d, "wb" + i, [{ t: r("report") + i * 0.25, x, y: 990 }, { t: r("report") + 0.7 + i * 0.25, x: mx[i < 2 ? 0 : 1], y: 870 }])),
        ...mx.map((x, i) => bub(d, "mb" + i, [{ t: r("reports") + i * 0.25, x, y: 720 }, { t: r("reports") + 0.7 + i * 0.25, x: 540, y: 600 }])),
        <Label key="eq" dur={d} text="parse tree = company" x={540} y={1300} w={900} size={54} color={C.coral} at={r("that company")} />,
      ];
    }, { hold: "the parse tree", holdY: 800, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "answer", x: 540, y: 820, z: 1.03 }, { t: "workers", x: 540, y: 820, z: 1.03 }] }),
    // 3. what the question wants
    S("so the question", (r, d) => [
      <Head key="h" dur={d} text="2 things" y={190} size={150} at={0.1} />,
      <Box key="b1" dur={d} x={480} y={640} w={780} h={140} size={54} label="1  formula per rule" tone="a" at={r("formula") - 0.2} />,
      <Check key="c1" dur={d} x={960} y={650} size={90} at={r("formula") + 0.9} />,
      <Box key="b2" dur={d} x={480} y={860} w={780} h={140} size={54} label="2  the demo" tone="a" at={r("demo") - 0.3} />,
      <Check key="c2" dur={d} x={960} y={870} size={90} at={r("demo") + 0.6} />,
    ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "demo", x: 540, y: 740, z: 1.05 }] }),
    // 4. the idea: every symbol gets val; values flow UP (synthesized)
    S("here's the idea", (r, d) => [
      ...[210, 540, 870].flatMap((x, i) => [
        <Box key={"s" + i} dur={d} x={x} y={500} w={230} h={130} size={80} label={["E", "T", "F"][i]} tone="a" at={r("symbol") + 0.8 + i * 0.6} />,
        <Arrow key={"a" + i} dur={d} x1={x} y1={572} x2={x} y2={676} head={false} width={5} at={r("attribute") + i * 0.25} />,
        <Box key={"v" + i} dur={d} x={x} y={730} w={200} h={100} size={54} label="val" tone="b" at={r("attribute") + i * 0.25} />]),
      <Box key="par" dur={d} x={540} y={1010} w={240} h={110} size={52} label="parent" tone="hot" at={r("parent's")} />,
      ...[300, 780].flatMap((x, i) => [
        <Box key={"ch" + i} dur={d} x={x} y={1280} w={240} h={110} size={52} label="child" tone="a" at={r("children") + i * 0.2} />,
        <Arrow key={"up" + i} dur={d} x1={x} y1={1222} x2={i ? 590 : 490} y2={1074} color={C.coral} width={9} at={r("flow") + i * 0.2} />,
        bub(d, "bb" + i, [{ t: r("flow") + 0.3 + i * 0.2, x, y: 1200 }, { t: r("flow") + 0.9 + i * 0.2, x: i ? 590 : 490, y: 1090 }])]),
      <Label key="syn" dur={d} text="synthesized attribute" x={540} y={1420} w={900} size={52} color={C.coral} at={r("synthesized")} />,
    ], { hold: "that is called", holdY: 880, cam: [{ t: 0, x: 540, y: 620, z: 1.0 }, { t: "parent's", x: 540, y: 880, z: 1.03 }, { t: "flow", x: 540, y: 1000, z: 1.03 }] }),
    // 5. rule one: E -> E + T, E -> T
    S("rule 1", (r, d) => rule(d, r, {
      head: "E → E + T", p: "E", pt: r("e goes") + 0.1,
      kids: [{ l: "E1", sub: "val" }, { l: "+" }, { l: "T", sub: "val" }], kt: [r("plus") - 0.5, r("plus") - 0.2, r("plus") + 0.2],
      rule: "E.val = E1.val + T.val", ft: r("dot"),
      up: [{ k: 0, t: r("first") }, { k: 2, t: r("t's") }],
      mini: "E → T :  E.val = T.val", mt: r("and e goes") }),
    { hold: "copies", holdY: 900, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "dot", x: 540, y: 900, z: 1.03 }] }),
    // 6. rule two: T -> T * F, T -> F
    S("rule 2", (r, d) => rule(d, r, {
      head: "T → T * F", p: "T", pt: r("t goes") + 0.1,
      kids: [{ l: "T1", sub: "val" }, { l: "*" }, { l: "F", sub: "val" }], kt: [r("times") - 0.5, r("times") - 0.2, r("times") + 0.2],
      rule: "T.val = T1.val × F.val", ft: r("dot"),
      up: [{ k: 0, t: r("first") }, { k: 2, t: r("f's") }],
      mini: "T → F :  T.val = F.val", mt: r("and t goes") }),
    { hold: "copies", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.03 }, { t: "dot", x: 540, y: 880, z: 1.0 }] }),
    // 7. rule three: F -> ( E ), F -> id
    S("rule 3", (r, d) => [
      ...rule(d, r, {
        head: "F → ( E )", p: "F", pt: r("f goes") + 0.1,
        kids: [{ l: "(" }, { l: "E", sub: "val" }, { l: ")" }], kt: [r("bracket") - 0.1, r("bracket") + 0.3, r("bracket") + 0.7],
        rule: "F.val = E.val", ft: r("copies") - 0.3,
        up: [{ k: 1, t: r("copies") }],
        mini: "F → id :  F.val = id.lexval", mt: r("and f goes") }),
      <Label key="lx" dur={d} text="lexval = the number the scanner read" x={540} y={1500} w={980} size={40} color={C.coral} at={r("scanner")} />,
    ], { hold: "scanner", holdY: 960, cam: [{ t: 0, x: 540, y: 960, z: 1.0 }, { t: 1, x: 540, y: 960, z: 1.0 }] }),
    // 8. build the parse tree of 3+4*5, top to bottom
    S("now the example", (r, d) => {
      const rt = [0, 1, 2, 3, 4].map(i => r("build") + 0.1 + i * 0.7);
      return [
        <Head key="h" dur={d} text="3 + 4 * 5" y={170} size={110} at={0.1} />,
        ...EDGES.map(([a, b], i) => treeEdge(d, "e" + i, a, b, rt[NP[b].row])),
        ...Object.values(NP).map(n => <Box key={n.id} dur={d} x={n.x} y={n.y} w={170} h={120} size={60} label={n.l} tone={n.tone} at={rt[n.row]} />),
      ];
    }, { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: 1, x: 540, y: 820, z: 1.0 }] }),
    // 9. evaluate bottom-up
    S("then evaluate", (r, d) => {
      const vt = { F1: [r("leaves") + 0.3, "=3"], F2: [r("leaves") + 0.9, "=4"], F3: [r("leaves") + 1.5, "=5"], T1: [r("leaves") + 2.2, "=3"], E1: [r("leaves") + 2.6, "=3"], T3: [r("leaves") + 2.9, "=4"],
        T2: [r("20"), "=20"], E0: [r("23"), "=23"] };
      return [
        <Head key="h" dur={d} text="bottom → up" y={170} size={110} at={0.1} />,
        ...EDGES.map(([a, b], i) => treeEdge(d, "e" + i, a, b, 0.05)),
        ...Object.values(NP).flatMap(n => {
          const v = vt[n.id];
          if (!v) return [<Box key={n.id} dur={d} x={n.x} y={n.y} w={170} h={120} size={60} label={n.l} tone={n.tone} at={0.05} />];
          return [<Box key={n.id} dur={d} x={n.x} y={n.y} w={170} h={120} size={60} label={n.l} tone={n.tone} at={0.05} out={v[0]} />,
            <Box key={n.id + "v"} dur={d} x={n.x} y={n.y} w={170} h={120} size={60} label={n.l} sub={v[1]} tone={n.id === "E0" || n.id === "T2" ? "hot" : "b"} at={v[0]} />];
        }),
        <Mascot key="tok" dur={d} size={170} tag="23" at={r("23")} pts={[{ t: r("23"), x: 760, y: 1470, look: [-1, -1], mood: "happy" }, { t: r("23") + 1, x: 760, y: 1470, look: [-1, -1], mood: "happy" }]} />,
      ];
    }, { hold: "23", holdY: 960, cam: [{ t: 0, x: 540, y: 960, z: 1.0 }, { t: 1, x: 540, y: 960, z: 1.0 }] }),
    // 10. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "Every symbol (E, T, F) carries one synthesized attribute: val.",
        "E → E1 + T : E.val = E1.val + T.val  |  E → T : E.val = T.val",
        "T → T1 * F : T.val = T1.val × F.val  |  T → F : T.val = F.val",
        "F → ( E ) : F.val = E.val  |  F → id : F.val = id.lexval",
        "3+4*5 : leaves 3, 4, 5 → T = 4*5 = 20 → E = 3+20 = 23 (bottom-up)." ],
        times: [r("every symbol"), r("plus rules"), r("times rules"), r("id gives"), r("the answer")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 11. memory trick + payoff
    S("to remember", (r, d) => [
      <Head key="h1" dur={d} text="children report" y={430} size={90} at={0.1} />,
      <Head key="h2" dur={d} text="parents compute" y={700} size={90} at={r("parents")} />,
      <Head key="h3" dur={d} text="5 marks" y={1010} size={170} at={r("marks") - 0.2} />,
      <Check key="ck" dur={d} x={540} y={1400} size={180} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "marks", x: 540, y: 1000, z: 1.06 }] }),
  ];
};
