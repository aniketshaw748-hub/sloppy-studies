import { Box, Arrow, Head, Label, Check, Ring, Table } from "./prims.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const SYM = ["S", "A", "B", "C", "D"];
  // working note under a table
  const note = (d, t, k, txt, a, b, y = 1090) => <Label key={k} dur={d} text={txt} x={540} y={y} w={980} size={44} color={C.coral} at={t(a)} out={b ? t(b) : undefined} />;
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Compute FIRST and FOLLOW for S→Aba|bCA, A→cBCD|ε, B→CdA|ad, C→eC|ε, D→bSf|a.", n: 6, marks: 5, y: 500 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: 3.5, x: 540, y: 800, z: 1.05 }] }),
    // 2. from zero: a queue; FIRST = front, FOLLOW = right behind; some symbols can vanish (epsilon)
    S("let's start", (r, d) => {
      const t = a => a - 4.7;
      return [
        <Head key="h" dur={d} text="a queue" y={170} size={130} at={t(9.4)} />,
        ...[[150, "p"], [320, "q"], [490, "r"]].map(([x, l], i) => <Box key={"q" + i} dur={d} x={x} y={620} w={140} h={110} size={60} label={l} tone="a" at={t(9.9) + i * 0.15} />),
        <Box key="qs" dur={d} x={760} y={620} w={140} h={110} size={60} label="s" tone="b" at={t(10.3)} />,
        <Arrow key="br" dur={d} x1={80} y1={705} x2={560} y2={705} head={false} color={C.coral} width={8} at={t(10.4)} />,
        <Label key="lx" dur={d} text="symbol X" x={320} y={725} w={500} size={44} at={t(10.5)} />,
        <Ring key="r1" dur={d} x={150} y={620} r={80} at={t(11.4)} />,
        <Label key="l1" dur={d} text="FIRST: front" x={250} y={830} w={440} size={46} color={C.coral} at={t(11.2)} />,
        <Ring key="r2" dur={d} x={760} y={620} r={80} color={C.cobalt} at={t(14.0)} />,
        <Label key="l2" dur={d} text="FOLLOW: behind" x={780} y={830} w={440} size={46} color={C.cobalt} at={t(13.8)} />,
        <Label key="l3" dur={d} text="some symbols can vanish" x={540} y={1050} w={980} size={50} at={t(15.9)} />,
        <Box key="ep" dur={d} x={540} y={1210} w={220} h={120} size={70} label="ε" sub="empty" tone="hot" at={t(18.5)} />,
      ];
    }, { hold: 14.2, holdY: 860, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 12, x: 540, y: 860, z: 1.02 }] }),
    // 3. what the question wants
    S("so the question", (r, d) => {
      const t = a => a - 20.3;
      return [
        <Head key="h" dur={d} text="2 sets" y={190} size={150} at={0.1} />,
        <Box key="b1" dur={d} x={480} y={620} w={780} h={140} size={50} label="1  FIRST of each symbol" tone="a" at={t(21.4)} />,
        <Check key="c1" dur={d} x={960} y={630} size={90} at={t(22.4)} />,
        <Box key="b2" dur={d} x={480} y={840} w={780} h={140} size={50} label="2  FOLLOW of each symbol" tone="a" at={t(22.4)} />,
        <Check key="c2" dur={d} x={960} y={850} size={90} at={t(23.6)} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: 4, x: 540, y: 740, z: 1.05 }] }),
    // 4. FIRST: the method
    S("first look", (r, d) => {
      const t = a => a - 24.8;
      return [
        <Head key="h" dur={d} text="FIRST" y={170} size={150} at={0.1} />,
        <Box key="a0" dur={d} x={190} y={520} w={220} h={120} size={56} label="X →" tone="a" at={t(25.8)} />,
        <Box key="a1" dur={d} x={430} y={520} w={140} h={120} size={64} label="a" tone="b" at={t(26.4)} />,
        <Box key="a2" dur={d} x={600} y={520} w={140} h={120} size={64} label="Y" tone="a" at={t(26.6)} />,
        <Ring key="ra" dur={d} x={430} y={520} r={85} at={t(27.3)} />,
        <Label key="la" dur={d} text="terminal: that's the answer" x={540} y={640} w={980} size={46} color={C.coral} at={t(27.9)} />,
        <Box key="b0" dur={d} x={190} y={860} w={220} h={120} size={56} label="X →" tone="a" at={t(29.5)} />,
        <Box key="b1" dur={d} x={430} y={860} w={140} h={120} size={64} label="V" sub="vanishes" tone="hot" at={t(29.8)} />,
        <Box key="b2" dur={d} x={600} y={860} w={140} h={120} size={64} label="b" tone="b" at={t(30.0)} />,
        <Arrow key="ab" dur={d} x1={440} y1={780} x2={590} y2={780} color={C.coral} width={9} at={t(31.4)} />,
        <Label key="lb" dur={d} text="can vanish: look at the next one" x={540} y={980} w={980} size={46} color={C.coral} at={t(31.6)} />,
      ];
    }, { hold: 7.3, holdY: 760, cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: 6, x: 540, y: 760, z: 1.03 }] }),
    // 5. FIRST sets, one by one
    S("ec or nothing", (r, d) => {
      const t = a => a - 33.6;
      const val = ["{ b, c }", "{ c, ε }", "{ a, d, e }", "{ e, ε }", "{ a, b }"];
      const at = [57.6, 39.6, 50.7, 35.9, 43.3];
      return [
        <Head key="h" dur={d} text="FIRST" y={170} size={150} at={0.1} />,
        ...Table({ dur: d, x: 60, y: 360, w: 960, cols: ["symbol", "FIRST"], rows: SYM.map((s, i) => [s, val[i]]), rowH: 96, fs: 40, at: 0.2,
          cellAt: SYM.map((s, i) => [0.3 + i * 0.1, t(at[i])]), hot: [[1, 1], [3, 1]] }),
        note(d, t, "n1", "C → eC | ε", 33.6, 36.7),
        note(d, t, "n2", "A → cBCD | ε", 36.8, 40.4),
        note(d, t, "n3", "D → bSf | a", 40.5, 43.9),
        note(d, t, "n4", "B → CdA | ad", 44.0, 46.7),
        note(d, t, "n5", "C can vanish → look at d", 46.8, 51.4),
        note(d, t, "n6", "S → Aba | bCA", 51.5, 54.5),
        note(d, t, "n7", "A can vanish → look at b", 54.6),
      ];
    }, { hold: 23.9, holdY: 760, cam: [{ t: 0, x: 540, y: 740, z: 1.0 }, { t: 20, x: 540, y: 760, z: 1.02 }] }),
    // 6. FOLLOW: the three rules
    S("now follow", (r, d) => {
      const t = a => a - 58.5;
      const row = (k, y, l, rr, a1, a2, a3) => [
        <Box key={k + "l"} dur={d} x={260} y={y} w={420} h={120} size={42} label={l} tone="a" at={t(a1)} />,
        <Arrow key={k + "a"} dur={d} x1={490} y1={y} x2={570} y2={y} width={8} at={t(a2)} />,
        <Box key={k + "r"} dur={d} x={790} y={y} w={420} h={120} size={42} label={rr} tone="b" at={t(a3)} />];
      return [
        <Head key="h" dur={d} text="FOLLOW" y={170} size={150} at={0.1} />,
        ...row("r1", 480, "start symbol", "add $", 60.3, 60.7, 60.9),
        ...row("r2", 700, "X followed by Y", "add FIRST(Y)", 62.2, 63.3, 64.0),
        ...row("r3", 920, "ends / vanishes", "add FOLLOW(A)", 65.1, 66.9, 67.5),
        <Label key="la" dur={d} text="A = the rule's left side" x={540} y={1030} w={900} size={44} color={C.coral} at={t(68.3)} />,
      ];
    }, { hold: 10.3, holdY: 760, cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: 9, x: 540, y: 760, z: 1.03 }] }),
    // 7. FOLLOW of S and B
    S("sits in", (r, d) => {
      const t = a => a - 70.2;
      const val = ["{ f, $ }", "", "{ a, b, e }", "", ""];
      const at = [73.0, 0, 79.7, 0, 0];
      return [
        <Head key="h" dur={d} text="FOLLOW" y={170} size={150} at={0.1} />,
        ...Table({ dur: d, x: 60, y: 360, w: 960, cols: ["symbol", "FOLLOW"], rows: SYM.map((s, i) => [s, val[i]]), rowH: 96, fs: 36, at: 0.2,
          cellAt: SYM.map((s, i) => [0.3 + i * 0.1, at[i] ? t(at[i]) : 999]) }),
        note(d, t, "n1", "D → bSf : S is before f", 70.2, 73.6),
        note(d, t, "n2", "A → cBCD : B is followed by C D", 73.7, 75.9),
        note(d, t, "n3", "C gives e, and C can vanish", 76.0, 78.0),
        note(d, t, "n4", "so D gives a, b", 78.0),
      ];
    }, { hold: 9.4, holdY: 760, cam: [{ t: 0, x: 540, y: 740, z: 1.0 }, { t: 8, x: 540, y: 760, z: 1.02 }] }),
    // 8. FOLLOW of A, D, C
    S("is before", (r, d) => {
      const t = a => a - 80.7;
      const val = ["{ f, $ }", "{ a, b, e, f, $ }", "{ a, b, e }", "{ a, b, c, d, f, $ }", "{ a, b, e, f, $ }"];
      const at = [0.3, 87.6, 0.3, 97.9, 91.1];
      return [
        <Head key="h" dur={d} text="FOLLOW" y={170} size={150} at={0.1} />,
        ...Table({ dur: d, x: 60, y: 360, w: 960, cols: ["symbol", "FOLLOW"], rows: SYM.map((s, i) => [s, val[i]]), rowH: 96, fs: 36, at: 0.2,
          cellAt: SYM.map((s, i) => [0.3 + i * 0.1, at[i] > 1 ? t(at[i]) : 0.4]) }),
        note(d, t, "n1", "S → A b a :  A is before b", 80.7, 81.5),
        note(d, t, "n2", "S → b C A :  A ends → FOLLOW(S)", 81.6, 85.4),
        note(d, t, "n3", "B → C d A :  A ends → FOLLOW(B)", 85.5, 88.1),
        note(d, t, "n4", "A → c B C D :  D ends → FOLLOW(A)", 88.2, 91.6),
        note(d, t, "n5", "C is before A, before D, before d", 91.7),
      ];
    }, { hold: 17.4, holdY: 760, cam: [{ t: 0, x: 540, y: 740, z: 1.0 }, { t: 14, x: 540, y: 760, z: 1.02 }] }),
    // 9. the exam answer
    S("so in your exam", (r, d) => {
      const t = a => a - 98.8;
      return [...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "FIRST: S{b,c}  A{c,ε}  B{a,d,e}  C{e,ε}  D{a,b}",
        "FOLLOW: S{f,$}  A{a,b,e,f,$}  B{a,b,e}  C{a,b,c,d,f,$}  D{a,b,e,f,$}" ],
        times: [t(101.1), t(102.8)] })];
    }, { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 10. memory trick + payoff
    S("to remember", (r, d) => {
      const t = a => a - 104.1;
      return [
        <Head key="h1" dur={d} text="FIRST looks right" y={430} size={100} at={t(105.8)} />,
        <Head key="h2" dur={d} text="FOLLOW looks next door" y={700} size={90} at={t(107.4)} />,
        <Head key="h3" dur={d} text="5 marks" y={1010} size={170} at={t(109.4)} />,
        <Check key="ck" dur={d} x={540} y={1400} size={180} at={t(110.0)} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 5, x: 540, y: 900, z: 1.0 }] }),
  ];
};
