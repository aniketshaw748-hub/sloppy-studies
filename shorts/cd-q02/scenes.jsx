import { Box, Arrow, Head, Label, Check, Ring, Table } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const SYM = ["S", "B", "C", "D", "E", "F"];
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Design the LL(1) parsing table for S→aBDh, B→cC, C→bC|ε, D→EF, E→g|ε, F→f|ε.", n: 2, marks: 5, y: 520 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: 3.5, x: 540, y: 800, z: 1.05 }] }),
    // 2. from zero: LL(1) = one symbol ahead; a traveller at a junction reads the signpost, the table picks the road
    S("let's start", (r, d) => {
      const t = a => a - 5.1;
      return [
        <Head key="h" dur={d} text="LL(1)" y={170} size={150} at={0.15} />,
        <Label key="l1" dur={d} text="looks ONE symbol ahead" x={540} y={340} w={900} size={50} color={C.coral} at={t(8.3)} />,
        <Box key="j" dur={d} x={540} y={640} w={260} h={150} size={80} label="C" sub="junction" tone="a" at={t(11.2)} />,
        <Mascot key="tok" dur={d} size={200} tag="b" at={t(12.7)} pts={[{ t: t(12.7), x: 540, y: 1240, look: [0, -1], mood: "think" }, { t: t(17.3), x: 540, y: 1240, look: [-1, -1], mood: "think" }, { t: t(17.5), x: 540, y: 1240, look: [-1, -1], mood: "happy" }]} />,
        <Label key="sp" dur={d} text="next input symbol" x={540} y={1375} w={800} size={44} color={C.coral} at={t(13.6)} />,
        <Arrow key="a1" dur={d} x1={500} y1={722} x2={320} y2={896} width={7} at={t(15.9)} />,
        <Arrow key="a2" dur={d} x1={580} y1={722} x2={760} y2={896} width={7} at={t(16.2)} />,
        <Box key="r1" dur={d} x={300} y={960} w={380} h={120} size={50} label="C → b C" tone="a" at={t(15.9)} />,
        <Box key="r2" dur={d} x={780} y={960} w={380} h={120} size={50} label="C → ε" tone="a" at={t(16.2)} />,
        <Arrow key="hot" dur={d} x1={500} y1={722} x2={320} y2={896} color={C.coral} width={12} at={t(17.4)} />,
        <Check key="ck" dur={d} x={300} y={1110} size={90} at={t(17.6)} />,
      ];
    }, { hold: 12.2, holdY: 900, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: 6.5, x: 540, y: 860, z: 1.03 }] }),
    // 3. what the question wants
    S("so the question", (r, d) => {
      const t = a => a - 19.3;
      return [
        <Head key="h" dur={d} text="2 things" y={190} size={150} at={0.1} />,
        <Box key="b1" dur={d} x={480} y={620} w={780} h={140} size={54} label="1  FIRST + FOLLOW" tone="a" at={t(21.5)} />,
        <Check key="c1" dur={d} x={960} y={630} size={90} at={t(22.9)} />,
        <Box key="b2" dur={d} x={480} y={840} w={780} h={140} size={54} label="2  the table" tone="a" at={t(23.4)} />,
        <Check key="c2" dur={d} x={960} y={850} size={90} at={t(24.2)} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: 4, x: 540, y: 740, z: 1.05 }] }),
    // 4. FIRST sets
    S("first of a symbol", (r, d) => {
      const t = a => a - 24.8, gone = t(30.2);
      const val = ["{ a }", "{ c }", "{ b, ε }", "{ g, f, ε }", "{ g, ε }", "{ f, ε }"];
      const at = [31.0, 32.8, 36.9, 47.0, 39.3, 41.6].map(t);
      return [
        <Head key="h" dur={d} text="FIRST" y={170} size={150} at={0.1} />,
        <Box key="x0" dur={d} x={240} y={560} w={170} h={120} size={70} label="C" tone="a" at={t(25.6)} out={gone} />,
        <Arrow key="x1" dur={d} x1={340} y1={560} x2={430} y2={560} width={8} at={t(25.8)} out={gone} />,
        <Box key="x2" dur={d} x={540} y={560} w={150} h={120} size={70} label="b" tone="b" at={t(25.9)} out={gone} />,
        <Box key="x3" dur={d} x={730} y={560} w={150} h={120} size={70} label="C" tone="a" at={t(26.0)} out={gone} />,
        <Ring key="rg" dur={d} x={540} y={560} r={80} at={t(26.3)} />,
        <Label key="xl" dur={d} text="starts with b" x={540} y={670} w={800} size={50} color={C.coral} at={t(26.6)} out={gone} />,
        <Box key="y0" dur={d} x={240} y={860} w={170} h={120} size={70} label="C" tone="a" at={t(27.6)} out={gone} />,
        <Arrow key="y1" dur={d} x1={340} y1={860} x2={430} y2={860} width={8} at={t(27.8)} out={gone} />,
        <Box key="y2" dur={d} x={540} y={860} w={150} h={120} size={70} label="ε" tone="hot" at={t(27.9)} out={gone} />,
        <Label key="yl" dur={d} text="can vanish → ε is in FIRST" x={540} y={970} w={980} size={46} color={C.coral} at={t(28.3)} out={gone} />,
        ...Table({ dur: d, x: 60, y: 460, w: 960, cols: ["symbol", "FIRST"], rows: SYM.map((s, i) => [s, val[i]]), rowH: 96, fs: 40, at: t(30.3),
          cellAt: SYM.map((s, i) => [t(30.4) + i * 0.1, at[i]]), hot: [[2, 1], [3, 1], [4, 1], [5, 1]] }),
        <Label key="dl" dur={d} text="D → E F : both can vanish" x={540} y={1250} w={980} size={46} color={C.coral} at={t(42.5)} />,
      ];
    }, { hold: 19.6, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 5.5, x: 540, y: 800, z: 1.03 }] }),
    // 5. FOLLOW sets
    S("follow is what", (r, d) => {
      const t = a => a - 48.3, gone = t(50.9);
      const val = ["{ $ }", "{ g, f, h }", "{ g, f, h }", "{ h }", "{ f, h }", "{ h }"];
      const at = [53.1, 60.2, 63.0, 65.0, 68.9, 70.4].map(t);
      const note = (k, txt, a, b) => <Label key={k} dur={d} text={txt} x={540} y={1250} w={980} size={44} color={C.coral} at={t(a)} out={b ? t(b) : undefined} />;
      return [
        <Head key="h" dur={d} text="FOLLOW" y={170} size={150} at={0.1} />,
        <Box key="x0" dur={d} x={240} y={600} w={240} h={120} size={54} label="symbol" tone="hot" at={t(49.2)} out={gone} />,
        <Arrow key="x1" dur={d} x1={380} y1={600} x2={700} y2={600} width={8} label="right after" at={t(49.6)} out={gone} />,
        <Box key="x2" dur={d} x={840} y={600} w={240} h={120} size={54} label="next" tone="b" at={t(50.1)} out={gone} />,
        ...Table({ dur: d, x: 60, y: 460, w: 960, cols: ["symbol", "FOLLOW"], rows: SYM.map((s, i) => [s, val[i]]), rowH: 96, fs: 40, at: t(51.0),
          cellAt: SYM.map((s, i) => [t(51.1) + i * 0.1, at[i]]) }),
        note("n1", "B is followed by D, then h", 54.1, 56.6),
        note("n2", "D can vanish, so h comes next", 56.6, 60.8),
        note("n3", "C ends B's rule: same as B", 60.9, 63.7),
        note("n4", "D is followed by h", 63.8, 65.7),
        note("n5", "E is followed by F: f, and h too", 65.8, 69.5),
        note("n6", "F ends D's rule: h", 69.6),
      ];
    }, { hold: 70.2 - 48.3, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 8, x: 540, y: 800, z: 1.03 }] }),
    // 6. the two filling rules
    S("now two filling", (r, d) => {
      const t = a => a - 71.3;
      return [
        <Head key="h" dur={d} text="2 filling rules" y={170} size={130} at={0.1} />,
        <Box key="a1" dur={d} x={250} y={620} w={380} h={130} size={56} label="A → α" tone="a" at={t(74.3)} />,
        <Arrow key="a2" dur={d} x1={450} y1={620} x2={560} y2={620} width={8} at={t(75.0)} />,
        <Box key="a3" dur={d} x={790} y={620} w={440} h={130} size={42} label="under FIRST(α)" tone="b" at={t(75.7)} />,
        <Box key="b1" dur={d} x={250} y={900} w={380} h={130} size={44} label="α can vanish" tone="a" at={t(79.2)} />,
        <Arrow key="b2" dur={d} x1={450} y1={900} x2={560} y2={900} width={8} at={t(80.4)} />,
        <Box key="b3" dur={d} x={790} y={900} w={440} h={130} size={42} label="under FOLLOW(A)" tone="b" at={t(81.2)} />,
      ];
    }, { hold: 82.2 - 71.3, holdY: 800, cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: 5, x: 540, y: 740, z: 1.04 }] }),
    // 7. row by row: the table
    S("row by row", (r, d) => {
      const t = a => a - 83.4;
      const g = t(83.7);
      const E = "", cols = ["", "a", "b", "c", "f", "g", "h"];
      const rows = [
        ["S", "S→aBDh", E, E, E, E, E],
        ["B", E, E, "B→cC", E, E, E],
        ["C", E, "C→bC", E, "C→ε", "C→ε", "C→ε"],
        ["D", E, E, E, "D→EF", "D→EF", "D→EF"],
        ["E", E, E, E, "E→ε", "E→g", "E→ε"],
        ["F", E, E, E, "F→f", E, "F→ε"] ];
      const cellAt = rows.map(row => row.map(() => g));
      cellAt[0][1] = t(85.3); cellAt[1][3] = t(87.1); cellAt[2][2] = t(89.2); cellAt[2][5] = t(90.7); cellAt[2][4] = t(91.5); cellAt[2][6] = t(92.1);
      cellAt[3][5] = t(94.5); cellAt[3][4] = t(95.3); cellAt[3][6] = t(95.9);
      cellAt[4][5] = t(99.0); cellAt[4][4] = t(100.3); cellAt[4][6] = t(100.9);
      cellAt[5][4] = t(103.8); cellAt[5][6] = t(105.5);
      return [
        <Head key="h" dur={d} text="LL(1) table" y={170} size={100} at={0.1} />,
        ...Table({ dur: d, x: 30, y: 330, w: 1020, cols, rows, rowH: 100, fs: 34, at: g - 0.1, cellAt,
          hot: [[2, 4], [2, 5], [2, 6], [4, 4], [4, 6], [5, 6]] }),
        <Label key="dl" dur={d} text="(the $ column stays empty)" x={540} y={1120} w={900} size={40} color={C.coral} at={t(105.9)} />,
      ];
    }, { hold: 22.6, holdY: 760, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 12, x: 540, y: 760, z: 1.0 }] }),
    // 8. no cell holds two rules
    S("no cell holds", (r, d) => {
      const t = a => a - 107.0;
      return [
        <Head key="h" dur={d} text="LL(1)" y={200} size={170} at={0.1} />,
        <Box key="b" dur={d} x={540} y={700} w={940} h={140} size={52} label="no cell has 2 rules" tone="a" at={t(107.4)} />,
        <Check key="c" dur={d} x={540} y={1000} size={200} at={t(109.8)} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 4, x: 540, y: 820, z: 1.05 }] }),
    // 9. the exam answer
    S("so in your exam", (r, d) => {
      const t = a => a - 111.4;
      return [...AnswerSheet({ dur: d, y: 160, fs: 38, title: "WRITE THIS · 5 MARKS", points: [
        "FIRST: S{a} B{c} C{b,ε} D{g,f,ε} E{g,ε} F{f,ε}",
        "FOLLOW: S{$} B{g,f,h} C{g,f,h} D{h} E{f,h} F{h}",
        "Table: S/a→aBDh, B/c→cC, C/b→bC, C/f,g,h→ε, D/f,g,h→EF, E/g→g, E/f,h→ε, F/f→f, F/h→ε",
        "No cell holds two entries, so the grammar is LL(1)." ],
        times: [t(113.7), t(114.9), t(116.2), t(117.0)] })];
    }, { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 10. memory trick + payoff
    S("to remember", (r, d) => {
      const t = a => a - 118.9;
      return [
        <Head key="h1" dur={d} text="FIRST fills the front" y={430} size={90} at={0.1} />,
        <Head key="h2" dur={d} text="FOLLOW fills vanishers" y={700} size={90} at={t(122.3)} />,
        <Head key="h3" dur={d} text="5 marks" y={1010} size={170} at={t(124.4)} />,
        <Check key="ck" dur={d} x={540} y={1400} size={180} at={t(125.3)} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 5.5, x: 540, y: 900, z: 1.0 }] }),
  ];
};
