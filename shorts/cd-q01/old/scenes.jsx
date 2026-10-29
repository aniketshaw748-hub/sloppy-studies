import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
export const SCENES = ({ S, ctx, C }) => {
  // a value bubble that floats along a path (intentionally on top of boxes)
  const bub = (d, k, pts) => pts[0].t > d - 0.5 ? null : <Mover key={k} dur={d} on at={pts[0].t} out={Math.min(pts[pts.length - 1].t + 0.12, d - 0.02)} cw={64} ch={64} pts={pts}>
    <rect x={0} y={0} width={64} height={64} radius={32} fill={C.coral} strokeColor={C.navy} strokeWidth={4} /></Mover>;
  // E -> E + T style rule: parent, three kids, semantic rule, bubbles float up
  const ruleScene = (d, r, o) => {
    const kx = [230, 540, 850];
    const out = [
      <Head key="h" dur={d} text={o.head} y={190} size={150} at={0.1} />,
      <Box key="p" dur={d} x={540} y={640} w={250} h={150} size={64} label={o.p} sub={o.psub} tone="hot" at={0.3} />,
    ];
    o.kids.forEach((k, i) => {
      out.push(<Arrow key={"e" + i} dur={d} x1={540} y1={715} x2={kx[i]} y2={885} head={false} width={5} at={o.kt[i]} />);
      out.push(<Box key={"k" + i} dur={d} x={kx[i]} y={960} w={250} h={150} size={64} label={k.l} sub={k.sub} tone={k.sub ? "b" : "a"} at={o.kt[i]} />);
    });
    out.push(<Box key="rule" dur={d} x={540} y={1280} w={900} h={130} size={50} label={o.rule} tone="a" at={o.rt} />);
    o.up.forEach((u, i) => {
      out.push(<Arrow key={"u" + i} dur={d} x1={kx[u.k]} y1={885} x2={u.k ? 575 : 505} y2={722} color={C.coral} width={9} at={u.t} />);
      [0, 0.9].forEach((dl, j) => out.push(bub(d, "b" + i + j, [{ t: u.t + 0.15 + dl, x: kx[u.k] + (u.k ? -30 : 30), y: 850 }, { t: u.t + 0.75 + dl, x: u.k ? 560 : 520, y: 742 }])));
    });
    return out;
  };
  return [
    // HOOK: the tree computes the value
    S(null, (r, d) => [
      <Box key="r1" dur={d} x={540} y={520} w={250} h={150} size={64} label="E" sub="val = ?" tone="hot" at={0.15} out={r("for you")} />,
      <Box key="r2" dur={d} x={540} y={520} w={250} h={150} size={64} label="E" sub="val = 23" tone="hot" at={r("for you")} />,
      ...[[240, "3"], [540, "+"], [840, "4*5"]].flatMap(([x, l], i) => [
        <Arrow key={"a" + i} dur={d} x1={540} y1={595} x2={x} y2={785} head={false} width={5} at={0.4 + i * 0.2} />,
        <Box key={"l" + i} dur={d} x={x} y={860} w={250} h={150} size={64} label={l} tone="a" at={0.4 + i * 0.2} />]),
      <Label key="cap" dur={d} text="parse tree = calculator" x={540} y={1130} w={980} size={52} at={r("maths")} color={C.coral} />,
      <Mascot key="tok" dur={d} size={190} tag="3" pts={[{ t: 0, x: 540, y: 1330, look: [0, -1], mood: "think" }, { t: r("maths"), x: 540, y: 1330, look: [0, -1], mood: "think" }, { t: r("for you"), x: 540, y: 1330, look: [0, -1], mood: "happy" }]} />,
    ], { cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "maths", x: 540, y: 900, z: 1.08 }] }),

    // SDD = attach val to every symbol
    S("a syntax", (r, d) => [
      <Head key="h" dur={d} text="SDD" y={190} size={190} sub="attach val to every symbol" at={0.2} />,
      ...[[210, "E"], [540, "T"], [870, "F"]].flatMap(([x, l], i) => [
        <Box key={"s" + i} dur={d} x={x} y={830} w={250} h={140} size={72} label={l} tone="a" at={1.7 + i * 0.2} />,
        <Arrow key={"c" + i} dur={d} x1={x} y1={900} x2={x} y2={1000} head={false} width={6} at={r("attribute") + i * 0.2} />,
        <Box key={"v" + i} dur={d} x={x} y={1070} w={210} h={100} size={50} label="val" tone="b" at={r("attribute") + i * 0.2} />]),
      <Mascot key="tok" dur={d} size={170} tag="id" pts={[{ t: 0, x: 210, y: 1340, look: [0, -1] }, { t: r("each"), x: 210, y: 1340, look: [0, -1] }, { t: r("each") + 0.4, x: 540, y: 1340, look: [0, -1] }, { t: r("symbol") + 0.2, x: 870, y: 1340, look: [0, -1], mood: "happy" }]} />,
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "attribute", x: 540, y: 900, z: 1.07 }] }),

    // E -> E + T
    S("e goes to e", (r, d) => ruleScene(d, r, {
      head: "E → E + T", p: "E", psub: "E.val",
      kids: [{ l: "E", sub: "E1.val" }, { l: "+" }, { l: "T", sub: "T.val" }], kt: [0.55, 0.95, 1.15],
      rule: "E.val = E1.val + T.val", rt: 2.2,
      up: [{ k: 0, t: 3.2 }, { k: 2, t: 4.7 }] }), { cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: 2.2, x: 540, y: 960, z: 1.07 }] }),

    // T -> T * F
    S("t goes to t", (r, d) => ruleScene(d, r, {
      head: "T → T * F", p: "T", psub: "T.val",
      kids: [{ l: "T", sub: "T1.val" }, { l: "*" }, { l: "F", sub: "F.val" }], kt: [0.45, 0.8, 1.0],
      rule: "T.val = T1.val × F.val", rt: 2.2,
      up: [{ k: 0, t: 2.3 }, { k: 2, t: 2.5 }] }), { cam: [{ t: 0, x: 540, y: 960, z: 1.07 }, { t: 2.2, x: 540, y: 900, z: 1.0 }], cut: "punch" }),

    // F -> id
    S("f goes to id", (r, d) => [
      <Head key="h" dur={d} text="F → id" y={190} size={170} at={0.1} />,
      <Box key="p" dur={d} x={540} y={640} w={250} h={150} size={64} label="F" sub="F.val" tone="hot" at={0.4} />,
      <Arrow key="e" dur={d} x1={540} y1={715} x2={540} y2={845} head={false} width={5} at={0.8} />,
      <Mascot key="tok" dur={d} size={200} tag="id" pts={[{ t: 0, x: 540, y: 960, look: [0, -1] }, { t: 3.9, x: 540, y: 960, look: [0, -1] }, { t: 4.1, x: 540, y: 960, look: [0, -1], mood: "happy" }]} at={0.7} />,
      <Box key="rule" dur={d} x={540} y={1280} w={900} h={130} size={50} label="F.val = id.lexval" tone="a" at={1.8} />,
      <Arrow key="u" dur={d} x1={600} y1={865} x2={600} y2={720} color={C.coral} width={9} at={3.0} />,
      ...[0, 0.9].map((dl, j) => bub(d, "b" + j, [{ t: 3.2 + dl, x: 600, y: 850 }, { t: 3.9 + dl, x: 600, y: 735 }])),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 3, x: 540, y: 940, z: 1.07 }] }),

    // THE EXAMPLE: annotated parse tree of 3 + 4 * 5, values computed bottom-up
    S("now 3 plus", (r, d) => {
      const X = { a: 150, p: 340, b: 530, m: 720, c: 910 }, Y = [470, 670, 870, 1070, 1270];
      const N = (id, x, y, l, at, tone) => ({ id, x, y, l, at, tone: tone || "a" });
      const nodes = [
        N("E0", 435, Y[0], "E", 0.35), N("E1", X.a, Y[1], "E", 0.7), N("pl", X.p, Y[1], "+", 0.7), N("Tr", 720, Y[1], "T", 0.7),
        N("T1", X.a, Y[2], "T", 1.0), N("T2", X.b, Y[2], "T", 1.0), N("mu", X.m, Y[2], "*", 1.0), N("Fr", X.c, Y[2], "F", 1.0),
        N("F1", X.a, Y[3], "F", 1.3), N("F2", X.b, Y[3], "F", 1.3), N("n5", X.c, Y[3], "5", 1.7, "b"),
        N("n3", X.a, Y[4], "3", 1.7, "b"), N("n4", X.b, Y[4], "4", 1.7, "b") ];
      const edges = [["E0", "E1"], ["E0", "pl"], ["E0", "Tr"], ["E1", "T1"], ["T1", "F1"], ["F1", "n3"], ["Tr", "T2"], ["Tr", "mu"], ["Tr", "Fr"], ["T2", "F2"], ["F2", "n4"], ["Fr", "n5"]];
      const P = Object.fromEntries(nodes.map(n => [n.id, n]));
      // value updates: [text, time, tone]
      const upd = { F1: ["=3", r(24.8 - 21.7), "b"], F2: ["=4", r(25.3 - 21.7), "b"], Fr: ["=5", r(25.7 - 21.7), "b"], T1: ["=3", 4.4, "b"], E1: ["=3", 4.5, "b"], T2: ["=4", 4.6, "b"], Tr: ["=20", 6.0, "hot"], E0: ["=23", 7.9, "hot"] };
      const out = [<Head key="h" dur={d} text="3 + 4 * 5" y={180} size={100} at={0.15} />];
      edges.forEach(([a, b], i) => out.push(<Arrow key={"e" + i} dur={d} x1={P[a].x} y1={P[a].y + 65} x2={P[b].x} y2={P[b].y - 67} head={false} width={5} at={P[b].at} />));
      nodes.forEach(n => {
        const u = upd[n.id];
        out.push(<Box key={n.id} dur={d} x={n.x} y={n.y} w={150} h={130} size={64} label={n.l} tone={n.tone} at={n.at} out={u ? u[1] : undefined} />);
        if (u) out.push(<Box key={n.id + "v"} dur={d} x={n.x} y={n.y} w={150} h={130} size={64} label={n.l} sub={u[0]} tone={u[2]} at={u[1]} />);
      });
      // arrows + bubbles carrying values up (4*5 and 3+20)
      out.push(<Arrow key="u1" dur={d} x1={560} y1={805} x2={690} y2={735} color={C.coral} width={9} at={5.1} />, <Arrow key="u2" dur={d} x1={880} y1={805} x2={750} y2={735} color={C.coral} width={9} at={5.1} />,
        <Arrow key="u3" dur={d} x1={175} y1={605} x2={400} y2={540} color={C.coral} width={9} at={6.9} />, <Arrow key="u4" dur={d} x1={690} y1={605} x2={470} y2={540} color={C.coral} width={9} at={6.9} />);
      out.push(bub(d, "q1", [{ t: 5.2, x: 560, y: 800 }, { t: 5.9, x: 700, y: 735 }]), bub(d, "q2", [{ t: 5.2, x: 880, y: 800 }, { t: 5.9, x: 740, y: 735 }]),
        bub(d, "q3", [{ t: 7.0, x: 180, y: 600 }, { t: 7.7, x: 395, y: 540 }]), bub(d, "q4", [{ t: 7.0, x: 690, y: 600 }, { t: 7.7, x: 475, y: 540 }]));
      out.push(<Mascot key="tok" dur={d} size={170} tag="23" at={7.9} pts={[{ t: 7.9, x: 940, y: 270, look: [-1, 1], mood: "happy" }, { t: 8.3, x: 940, y: 270, look: [-1, 1], mood: "happy" }]} />);
      return out;
    }, { cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: 2.4, x: 540, y: 930, z: 1.05 }, { t: 5.2, x: 540, y: 880, z: 1.06 }, { t: 7.8, x: 540, y: 800, z: 1.05 }] }),

    // synthesized = values float UP
    S("synthesized", (r, d) => [
      <Head key="h" dur={d} text="synthesized" y={190} size={120} sub="values flow UP" at={0.1} />,
      <Box key="p" dur={d} x={540} y={860} w={250} h={150} size={64} label="E" sub="E.val" tone="hot" at={0.5} />,
      ...[[290, "E", "E1.val"], [790, "T", "T.val"]].flatMap(([x, l, s], i) => [
        <Arrow key={"e" + i} dur={d} x1={540} y1={935} x2={x} y2={1105} head={false} width={5} at={0.7 + i * 0.1} />,
        <Box key={"k" + i} dur={d} x={x} y={1180} w={250} h={150} size={64} label={l} sub={s} tone="b" at={0.7 + i * 0.1} />,
        <Arrow key={"u" + i} dur={d} x1={x + (i ? -50 : 50)} y1={1105} x2={540 + (i ? 50 : -50)} y2={940} color={C.coral} width={9} at={r("bottom")} />]),
      ...[0, 0.8, 1.6, 2.4].flatMap((dl, j) => [
        bub(d, "a" + j, [{ t: r("bottom") + dl, x: 340, y: 1100 }, { t: r("bottom") + dl + 0.7, x: 490, y: 960 }]),
        bub(d, "c" + j, [{ t: r("bottom") + dl + 0.2, x: 740, y: 1100 }, { t: r("bottom") + dl + 0.9, x: 590, y: 960 }])]),
      <Label key="l1" dur={d} text="children → parent" x={540} y={1360} w={900} size={50} at={r("values")} color={C.coral} />,
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "bottom", x: 540, y: 960, z: 1.07 }, { t: "bubbles", x: 540, y: 900, z: 1.1 }], cut: "punch" }),

    // payoff
    S("write that", (r, d) => [
      <Mascot key="tok" dur={d} size={340} tag="23" pts={[{ t: 0, x: 540, y: 700, look: [0, 0], mood: "happy" }, { t: d - 0.1, x: 540, y: 720, look: [0, 0.5], mood: "happy" }]} />,
      <Head key="h" dur={d} text="5 marks" y={930} size={210} at={r("5")} />,
      <Box key="s" dur={d} x={540} y={1330} w={760} h={150} size={76} label="SECURED" tone="hot" at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "secured", x: 540, y: 1000, z: 1.1 }], cut: "whip" }),
  ];
};
