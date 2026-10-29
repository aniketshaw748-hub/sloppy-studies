import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const POS = { WA: [190, 740], NT: [480, 600], Q: [850, 640], SA: [480, 870], NSW: [850, 910], V: [660, 1100], T: [860, 1300] };
  const EDGES = [["WA", "NT"], ["WA", "SA"], ["NT", "SA"], ["NT", "Q"], ["SA", "Q"], ["SA", "NSW"], ["SA", "V"], ["Q", "NSW"], ["NSW", "V"]];
  const TONE = { R: "hot", G: "b", B: "a" };
  const SOL = { WA: "R", NT: "G", SA: "B", Q: "R", NSW: "G", V: "R", T: "R" };
  const trim = (a, b) => { const [ax, ay] = POS[a], [bx, by] = POS[b], dx = bx - ax, dy = by - ay; const t = Math.min(104 / Math.abs(dx || 1e-9), 64 / Math.abs(dy || 1e-9)); return [ax + dx * t, ay + dy * t]; };
  // the Australia map as a constraint graph: edges first, then nodes; colAt[id] = time a region gets its colour
  const MAP = (d, { nodeAt = 0, edgeAt = 0, colAt = {} }) => [
    ...EDGES.map(([a, b], i) => { const p = trim(a, b), q = trim(b, a); return <Arrow key={a + b} dur={d} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} at={edgeAt + i * 0.05} head={false} width={6} />; }),
    ...Object.keys(POS).flatMap((id, i) => {
      const [x, y] = POS[id], c = colAt[id];
      const base = <Box key={id} dur={d} x={x} y={y} w={190} h={110} label={id} size={40} tone="ghost" at={nodeAt + i * 0.1} out={c} />;
      return c == null ? [base] : [base, <Box key={id + "c"} dur={d} x={x} y={y} w={190} h={110} label={id + "=" + SOL[id]} size={40} tone={TONE[SOL[id]]} at={c} />];
    }),
  ];
  const X3 = [230, 540, 850];
  const given = { "0,0": 1, "0,2": 3, "1,1": 3, "2,0": 3, "2,2": 2 };
  const full = [[1, 2, 3], [2, 3, 1], [3, 1, 2]];
  const gx = [320, 540, 760], gy = [620, 840, 1060];
  return [
    // HOOK: a Sudoku with holes solves itself
    S(null, (r, d) => {
      const blanks = [[0, 1], [1, 0], [1, 2], [2, 1]];
      return [
        <Head dur={d} text="SUDOKU" y={190} size={170} />,
        ...[0, 1, 2].flatMap(i => [0, 1, 2].map(j => {
          const g = given[i + "," + j], bi = blanks.findIndex(b => b[0] === i && b[1] === j);
          if (g) return <Box key={i + "" + j} dur={d} x={gx[j]} y={gy[i]} w={200} h={200} size={100} label={String(g)} tone="a" at={0.1 + (i * 3 + j) * 0.04} />;
          return <Box key={i + "" + j} dur={d} x={gx[j]} y={gy[i]} w={200} h={200} size={100} label="?" tone="ghost" at={0.1 + (i * 3 + j) * 0.04} out={r("solve") + 0.1 + bi * 0.15} />;
        })),
        ...[[0, 1], [1, 0], [1, 2], [2, 1]].map(([i, j], k) => <Box key={"f" + k} dur={d} x={gx[j]} y={gy[i]} w={200} h={200} size={100} label={String(full[i][j])} tone="hot" at={r("solve") + 0.1 + k * 0.15} />),
        <Mascot key="bot" dur={d} size={200} pts={[{ t: 0, x: 150, y: 1330, look: [1, -0.5], mood: "think" }, { t: r("solve"), x: 540, y: 1330, look: [0, -1], mood: "think" }, { t: r("itself"), x: 540, y: 1330, look: [0, -1], mood: "happy" }]} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 830, z: 0.97 }, { t: "solve", x: 540, y: 830, z: 1.03 }] }),

    // a CSP has three parts: V, D, C
    S("A constraint satisfaction", (r, d) => {
      const row = [560, 880, 1200];
      return [
        <Head dur={d} text="CSP" y={170} size={140} sub="constraint satisfaction" />,
        ...["VARIABLES", "DOMAINS", "CONSTRAINTS"].flatMap((t, i) => [
          <Box key={"c" + i} dur={d} x={540} y={row[i]} w={920} h={260} tone="ghost" at={r("constraint") + 0.3 + i * 0.35} />,
          <Label key={"l" + i} dur={d} text={t} x={540} y={row[i] - 112} w={600} size={36} at={[r("Variables"), r("Domains"), r("Constraints")][i]} color={C.coral} />,
        ]),
        ...X3.map((x, i) => <Box key={"x" + i} dur={d} x={x} y={row[0] + 30} w={230} h={110} label={"X" + (i + 1)} size={50} tone="b" at={r("Variables") + i * 0.12} />),
        ...X3.map((x, i) => <Box key={"d" + i} dur={d} x={x} y={row[1] + 30} w={270} h={110} label={"D" + (i + 1) + "={R,G,B}"} size={38} tone="a" at={r("Domains") + i * 0.12} />),
        <Box key="k1" dur={d} x={300} y={row[2] + 30} w={380} h={110} tone="hot" at={r("Constraints")} />,
        <Label key="k1t" dur={d} text="X1 ≠ X2" x={300} y={row[2] + 2} w={360} size={50} font={C.fMono} color={C.ink} at={r("Constraints") + 0.1} />,
        <Box key="k2" dur={d} x={760} y={row[2] + 30} w={380} h={110} tone="hot" at={r("Constraints") + 0.2} />,
        <Label key="k2t" dur={d} text="X2 ≠ X3" x={760} y={row[2] + 2} w={360} size={50} font={C.fMono} color={C.ink} at={r("Constraints") + 0.3} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 770, z: 0.98 }, { t: "Variables", x: 540, y: 760, z: 1.01 }, { t: "Constraints", x: 540, y: 780, z: 1.04 }] }),

    // a solution: every variable gets a value from its domain, no constraint broken
    S("A solution gives", (r, d) => {
      const vals = ["R", "G", "B"], t0 = r("gives");
      return [
        <Label key="h" dur={d} text="SOLUTION = complete assignment" x={540} y={200} w={960} size={50} at={0.1} />,
        <Label key="v" dur={d} text="variables" x={540} y={420} w={400} size={38} at={0.2} color={C.coral} />,
        ...X3.map((x, i) => <Box key={"x" + i} dur={d} x={x} y={560} w={230} h={120} label={"X" + (i + 1)} size={50} tone="b" at={0.1 + i * 0.1} />),
        ...X3.map((x, i) => <Box key={"d" + i} dur={d} x={x} y={940} w={270} h={110} label="{R,G,B}" size={40} tone="a" at={0.3 + i * 0.1} />),
        <Label key="dl" dur={d} text="domain" x={540} y={1030} w={400} size={38} at={0.4} color={C.coral} />,
        ...vals.map((v, i) => <Mover key={"m" + i} dur={d} on cw={110} ch={110} at={t0 + i * 0.4} pts={[{ t: t0 + i * 0.4, x: X3[i], y: 940 }, { t: t0 + i * 0.4 + 0.7, x: X3[i], y: 750 }]}>
          <rect x={0} y={0} width={110} height={110} radius={14} fill={C.coral} strokeColor={C.navy} strokeWidth={4} />
          <text x={0} y={26} width={110} align="center" fontFamily={C.fBody} fontWeight={C.wBody} fontSize={56} color={C.ink}>{v}</text></Mover>),
        <Arrow key="a1" dur={d} x1={350} y1={560} x2={420} y2={560} at={r("without")} label="≠" head={false} color={C.coral} />,
        <Arrow key="a2" dur={d} x1={660} y1={560} x2={730} y2={560} at={r("breaking") + 0.1} label="≠" head={false} color={C.coral} />,
        <Check key="c1" dur={d} x={385} y={750} size={80} at={r("breaking") + 0.3} />,
        <Check key="c2" dur={d} x={695} y={750} size={80} at={r("any") + 0.3} />,
        <Label key="ok" dur={d} text="no constraint broken" x={540} y={1150} w={900} size={50} at={r("constraint")} color={C.coral} />,
        <Mascot key="bot" dur={d} size={190} pts={[{ t: 0, x: 540, y: 1330, look: [0, -1], mood: "think" }, { t: r("breaking"), x: 540, y: 1330, look: [0, -1], mood: "think" }, { t: r("constraint") + 0.3, x: 540, y: 1330, look: [0, -1], mood: "happy" }]} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 820, z: 0.97 }, { t: "gives", x: 540, y: 830, z: 0.99 }, { t: "breaking", x: 540, y: 820, z: 1.02 }] }),

    // the example: Australia as a graph
    S("Example", (r, d) => [
      <Head key="h" dur={d} text="MAP COLORING" y={190} size={90} />,
      ...MAP(d, { nodeAt: r("Map"), edgeAt: r("coloring") }),
    ], { cam: [{ t: 0, x: 540, y: 790, z: 0.97 }, { t: "coloring", x: 540, y: 790, z: 1.03 }] }),

    // regions = variables, {R,G,B} = domain, neighbours differ
    S("Regions are variables", (r, d) => {
      const t = r("neighbors");
      return [
        <Label key="v" dur={d} text="regions = VARIABLES" x={540} y={190} w={960} size={52} at={0.1} out={r("red")} />,
        <Label key="dm" dur={d} text="domain = {R, G, B}" x={540} y={190} w={960} size={52} at={r("red")} />,
        ...[["R red", "hot"], ["G green", "b"], ["B blue", "a"]].map(([l, tn], i) => <Box key={"lg" + i} dur={d} x={230 + i * 310} y={330} w={270} h={100} label={l} size={40} tone={tn} at={[r("red"), r("green"), r("blue")][i]} />),
        <Label key="nb" dur={d} text="neighbors must differ" x={540} y={445} w={960} size={46} at={t} color={C.coral} />,
        ...MAP(d, { nodeAt: 0.05, edgeAt: 0.05, colAt: { WA: t + 0.1, NT: t + 0.3, SA: t + 0.5, Q: t + 0.7, NSW: t + 0.9, V: t + 1.1, T: t + 1.3 } }),
        <Mascot key="bot" dur={d} size={190} pts={[{ t: 0, x: 170, y: 1290, look: [0.8, -0.7], mood: "think" }, { t: t + 1.5, x: 170, y: 1290, look: [0.8, -0.7], mood: "happy" }]} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 790, z: 0.97 }, { t: "red", x: 540, y: 790, z: 1.0 }, { t: "neighbors", x: 540, y: 790, z: 1.03 }] }),

    // applications
    S("Applications", (r, d) => {
      const A = [["Scheduling", "calendar-clock", "jobs → time slots", 265, 640, "Scheduling"], ["Sudoku", "grid-3x3", "cells → digits 1-9", 815, 640, "Sudoku"], ["Timetabling", "school", "classes → rooms", 265, 1040, "timetabling"], ["Resource allocation", "cpu", "tasks → machines", 815, 1040, "resource"]];
      return [
        <Head key="h" dur={d} text="APPLICATIONS" y={190} size={100} />,
        ...A.flatMap(([t, ic, m, x, y, cue], i) => { const at = r(cue); return [
          <Box key={"g" + i} dur={d} x={x} y={y} w={430} h={330} tone="ghost" at={0.15 + i * 0.1} out={at} />,
          <Box key={"b" + i} dur={d} x={x} y={y} w={430} h={330} label={t} size={i === 3 ? 40 : 48} tone="a" at={at} />,
          <Ico key={"i" + i} dur={d} ctx={ctx} name={ic} x={x} y={y - 100} size={90} color={C.coral} at={at + 0.1} />,
          <Label key={"m" + i} dur={d} text={m} x={x} y={y + 62} w={410} size={36} font={C.fMono} at={at + 0.25} color={C.coral} />,
        ]; }),
        <Mascot key="bot" dur={d} size={190} pts={[{ t: 0, x: 540, y: 1370, look: [-0.8, -0.6], mood: "think" }, { t: r("Sudoku"), x: 540, y: 1370, look: [0.8, -0.6], mood: "think" }, { t: r("timetabling"), x: 540, y: 1370, look: [-0.8, -0.9], mood: "think" }, { t: r("resource"), x: 540, y: 1370, look: [0.8, -0.9], mood: "happy" }]} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 840, z: 0.95 }, { t: "Sudoku", x: 540, y: 840, z: 0.97 }, { t: "timetabling", x: 540, y: 840, z: 0.99 }, { t: "resource", x: 540, y: 840, z: 1.0 }] }),

    // memory trick V D C
    S("Memory trick", (r, d) => {
      const W3 = ["Variables", "Domains", "Constraints"], L3 = ["V", "D", "C"], y = [610, 880, 1150];
      return [
        <Head key="h" dur={d} text="VDC" y={200} size={190} />,
        ...L3.flatMap((l, i) => [
          <Box key={"l" + i} dur={d} x={230} y={y[i]} w={200} h={190} label={l} size={120} tone={i === 1 ? "b" : "hot"} at={r(l)} />,
          <Arrow key={"a" + i} dur={d} x1={345} y1={y[i]} x2={430} y2={y[i]} at={r(W3[i])} />,
          <Box key={"w" + i} dur={d} x={720} y={y[i]} w={560} h={190} label={W3[i]} size={60} tone="a" at={r(W3[i])} />,
        ]),
        <Mascot key="bot" dur={d} size={190} pts={[{ t: 0, x: 540, y: 1370, look: [0, -1], mood: "think" }, { t: r("Constraints") + 0.3, x: 540, y: 1370, look: [0, -1], mood: "happy" }]} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 840, z: 0.97 }, { t: "Variables", x: 540, y: 840, z: 0.99 }, { t: "Constraints", x: 540, y: 840, z: 1.02 }] }),

    // payoff
    S("Write that", (r, d) => [
      <Head key="h" dur={d} text={"WRITE\nTHAT"} y={210} size={200} />,
      <Head key="m" dur={d} text="5 MARKS" y={700} size={150} at={r("Five")} color={C.coral} />,
      <Check key="c" dur={d} x={540} y={1060} size={200} at={r("Secured")} />,
      <Mascot key="bot" dur={d} size={170} pts={[{ t: 0, x: 540, y: 1330, look: [0, -1], mood: "think" }, { t: r("Secured"), x: 540, y: 1330, look: [0, -1], mood: "happy" }]} />,
    ], { cam: [{ t: 0, x: 540, y: 820, z: 0.98 }, { t: "Secured", x: 540, y: 820, z: 1.04 }], cut: "punch" }),
  ];
};
