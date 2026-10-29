import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const LX = i => 120 + i * 103.5, MX = [LX(1), LX(4), LX(7)], RX = 542, RY = 470, MY = 780, LY = 1130;
  const LEAF = [3, 12, 8, 2, 4, 6, 14, 5, 2], MINV = [3, 2, 2], PICK = [0, 3, 8];
  const eRM = (g, d, at, hot) => <Arrow key={"rm" + g + (hot ? "h" : "")} dur={d} x1={RX} y1={RY + 55} x2={MX[g]} y2={MY - 55} head={false} width={hot ? 12 : 5} color={hot ? C.coral : undefined} at={at} />;
  const eML = (i, d, at, hot) => <Arrow key={"ml" + i + (hot ? "h" : "")} dur={d} x1={MX[Math.floor(i / 3)]} y1={MY + 55} x2={LX(i)} y2={LY - 48} head={false} width={hot ? 10 : 5} color={hot ? C.coral : undefined} at={at} />;
  const leaf = (i, d, at, out, tone) => <Box key={"l" + i + (tone || "")} dur={d} x={LX(i)} y={LY} w={90} h={96} label={String(LEAF[i])} size={44} tone={tone || "a"} at={at} out={out} />;
  return [
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Explain the Minimax algorithm with an example.", n: 2, marks: 5, y: 560 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "example", x: 540, y: 780, z: 1.06 }] }),

    // two players, MAX wants high, MIN wants low
    S("Let's start", (r, d) => [
      <Head dur={d} text="2 players" y={190} size={130} at={0.1} />,
      <Ico dur={d} ctx={ctx} name="user-round" x={230} y={620} size={200} at={r("two")} />,
      <Ico dur={d} ctx={ctx} name="user-round" x={850} y={620} size={200} color={C.coral} at={r("two") + 0.3} />,
      <Ico dur={d} ctx={ctx} name="arrow-left-right" x={540} y={620} size={150} color={C.cobalt} at={r("chess")} />,
      <Label dur={d} text="one wins, the other loses" x={540} y={790} w={960} size={54} at={r("Whatever")} />,
      <Box dur={d} x={230} y={1000} w={300} h={130} label="MAX" size={64} tone="a" at={r("Max")} />,
      <Label dur={d} text="you" x={230} y={1085} w={300} size={44} color={C.cobalt} at={r("you")} />,
      <Ico dur={d} ctx={ctx} name="arrow-up" x={230} y={1230} size={110} color={C.cobalt} at={r("high")} />,
      <Label dur={d} text="score HIGH" x={230} y={1310} w={380} size={44} color={C.cobalt} at={r("high") + 0.2} />,
      <Box dur={d} x={850} y={1000} w={300} h={130} label="MIN" size={64} tone="hot" at={r("Min")} />,
      <Label dur={d} text="opponent" x={850} y={1085} w={300} size={44} color={C.coral} at={r("opponent")} />,
      <Ico dur={d} ctx={ctx} name="arrow-down" x={850} y={1230} size={110} color={C.coral} at={r("low")} />,
      <Label dur={d} text="score LOW" x={850} y={1310} w={380} size={44} color={C.coral} at={r("low") + 0.2} />,
    ], { hold: "opponent" }),

    // every move is a branch: the game tree, scores at the bottom
    S("Every move", (r, d) => [
      <Head dur={d} text="game tree" y={170} size={120} at={0.1} />,
      <Box dur={d} x={RX} y={RY} w={200} h={110} label="MAX" size={52} tone="a" at={r("move")} />,
      ...[0, 1, 2].map(g => eRM(g, d, r("branch") + g * 0.15)),
      ...[0, 1, 2].map(g => <Box key={"m" + g} dur={d} x={MX[g]} y={MY} w={200} h={110} label="MIN" size={52} tone="b" at={r("branch") + 0.3 + g * 0.15} />),
      ...[...Array(9).keys()].map(i => eML(i, d, r("very") + i * 0.07)),
      ...[...Array(9).keys()].map(i => leaf(i, d, r("very") + 0.2 + i * 0.07)),
      <Label dur={d} text="end of the game: a score" x={540} y={1260} w={960} size={52} color={C.coral} at={r("ending")} />,
    ], { hold: "has a score" }),

    // the question wants
    S("So the question", (r, d) => [
      <Label dur={d} text="the question wants:" x={540} y={470} w={960} size={74} at={0.15} />,
      <Label dur={d} text="1.  the rule of minimax" x={130} y={680} w={880} size={60} align="left" at={r("rule")} />,
      <Check dur={d} x={80} y={715} size={80} at={r("rule") + 0.9} />,
      <Label dur={d} text="2.  a worked example" x={130} y={860} w={880} size={60} align="left" at={r("worked")} />,
      <Check dur={d} x={80} y={895} size={80} at={r("worked") + 0.9} />,
    ]),

    // the rule: MIN takes the smallest, MAX the biggest, bottom up
    S("Here is the rule", (r, d) => {
      const L = [130, 270, 410], R2 = [670, 810, 950], lv = [7, 4, 9], rv = [4, 8, 1], MYY = 560, LYY = 860;
      const tl = r("smallest"), tr = r("biggest");
      return [
        <Head dur={d} text="the rule" y={170} size={110} at={0.1} />,
        <Label dur={d} text="the opponent plays perfectly" x={540} y={330} w={960} size={48} color={C.cobalt} at={r("Assume")} />,
        <Box dur={d} x={270} y={MYY} w={200} h={110} label="MIN" size={52} tone="b" at={r("Min's")} />,
        ...L.map((x, i) => <Arrow key={"le" + i} dur={d} x1={270} y1={MYY + 55} x2={x} y2={LYY - 50} head={false} width={5} at={r("Min's") + 0.2 + i * 0.1} />),
        ...L.map((x, i) => <Box key={"lb" + i} dur={d} x={x} y={LYY} w={120} h={100} label={String(lv[i])} size={50} tone="a" at={r("Min's") + 0.35 + i * 0.1} out={i === 1 ? tl : undefined} />),
        <Box dur={d} x={270} y={LYY} w={120} h={100} label="4" size={50} tone="hot" at={tl} />,
        <Label dur={d} text="smallest: 4" x={270} y={960} w={460} size={46} color={C.coral} at={tl + 0.1} />,
        <Box dur={d} x={810} y={MYY} w={200} h={110} label="MAX" size={52} tone="a" at={r("Max's")} />,
        ...R2.map((x, i) => <Arrow key={"re" + i} dur={d} x1={810} y1={MYY + 55} x2={x} y2={LYY - 50} head={false} width={5} at={r("Max's") + 0.2 + i * 0.1} />),
        ...R2.map((x, i) => <Box key={"rb" + i} dur={d} x={x} y={LYY} w={120} h={100} label={String(rv[i])} size={50} tone="a" at={r("Max's") + 0.35 + i * 0.1} out={i === 1 ? tr : undefined} />),
        <Box dur={d} x={810} y={LYY} w={120} h={100} label="8" size={50} tone="hot" at={tr} />,
        <Label dur={d} text="biggest: 8" x={810} y={960} w={460} size={46} color={C.coral} at={tr + 0.1} />,
        <Ico dur={d} ctx={ctx} name="arrow-up" x={540} y={1190} size={150} color={C.cobalt} at={r("bottom")} />,
        <Label dur={d} text="start at the bottom, work up" x={540} y={1300} w={960} size={54} at={r("work")} />,
      ];
    }, { hold: "We start" }),

    // the worked example, fully
    S("Now the example", (r, d) => {
      const tg = [r("scores") + 0.3, r("twelve"), r("eight")], th = [r("has two") + 0.3, r("four"), r("six")], ti = [r("fourteen"), r("five"), r("and two") + 0.1];
      const leafT = [...tg, ...th, ...ti];
      const pickT = [r("smallest three") + 0.8, r("picks two") + 0.3, r("and two") + 1.3], tR = r("biggest") + 0.7;
      const grpT = [r("first"), r("second"), r("third")];
      return [
        <Head dur={d} text="example" y={170} size={120} at={0.1} />,
        <Box dur={d} x={RX} y={RY} w={200} h={110} label="MAX" size={52} tone="a" at={r("Max")} out={tR} />,
        <Box dur={d} x={RX} y={RY} w={200} h={110} label="3" sub="MAX" size={64} tone="hot" at={tR} />,
        ...[0, 1, 2].map(g => eRM(g, d, r("moves") + g * 0.2)),
        eRM(0, d, tR, true),
        ...[0, 1, 2].map(g => <Box key={"m" + g} dur={d} x={MX[g]} y={MY} w={200} h={110} label="MIN" size={52} tone="b" at={r("Min") + g * 0.2} out={pickT[g]} />),
        ...[0, 1, 2].map(g => <Box key={"mv" + g} dur={d} x={MX[g]} y={MY} w={200} h={110} label={String(MINV[g])} sub="MIN" size={64} tone="hot" at={pickT[g]} />),
        ...[...Array(9).keys()].map(i => eML(i, d, grpT[Math.floor(i / 3)] + (i % 3) * 0.1)),
        ...[...Array(9).keys()].map(i => leaf(i, d, leafT[i], PICK.includes(i) ? pickT[PICK.indexOf(i)] : undefined)),
        ...PICK.map((i, g) => leaf(i, d, pickT[g], undefined, "hot")),
        ...PICK.map((i, g) => eML(i, d, pickT[g], true)),
        <Label dur={d} text="best move: branch 1" x={540} y={1300} w={960} size={56} color={C.coral} at={r("best")} />,
        <Label dur={d} text="guaranteed value = 3" x={540} y={1390} w={960} size={56} color={C.coral} at={r("guaranteed")} />,
        <Mascot dur={d} size={130} pts={[{ t: 0, x: 900, y: RY, look: [-1, 0], mood: "idle" }, { t: pickT[0], x: 900, y: RY, look: [-1, 1], mood: "think" }, { t: tR, x: 900, y: RY, look: [-1, 0], mood: "happy" }]} />,
      ];
    }, { hold: "So the best" }),

    // the exam answer
    S("So in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "Minimax: a decision rule for two-player, zero-sum games.",
        "MAX picks the highest value, MIN picks the lowest.",
        "Values are backed up from the leaves to the root, bottom up.",
        "MIN node = minimum of its children. MAX node = maximum of its children.",
        "Example: MIN nodes give 3, 2, 2, so the MAX root = 3 and move 1 is best." ],
        times: [r("Minimax"), r("maximizes"), r("Values"), r("nodes"), r("In the example")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

    S("To remember", (r, d) => [
      <Ico dur={d} ctx={ctx} name="arrow-up" x={540} y={420} size={190} color={C.coral} at={0.1} />,
      <Label dur={d} text="MIN picks the smallest" x={540} y={610} w={980} size={72} color={C.coral} at={r("Min")} />,
      <Label dur={d} text="MAX picks the biggest" x={540} y={730} w={980} size={72} color={C.cobalt} at={r("Max")} />,
      <Label dur={d} text="from the bottom up" x={540} y={850} w={980} size={64} at={r("bottom")} />,
      <Label dur={d} text="5 marks" x={540} y={1060} w={900} size={150} color={C.coral} at={r("Five")} />,
      <Check dur={d} x={540} y={1420} size={180} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 1000, z: 1.06 }] }),
  ];
};
