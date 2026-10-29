import { Box, Arrow, Head, Label, XMark, Check, Ring } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  // "fix one rule": original on top, alpha/beta split, then the two new rules
  const fix = (d, t, o) => [
    <Head key="h" dur={d} text={o.head} y={170} size={130} at={0.1} />,
    <Box key="o" dur={d} x={540} y={470} w={900} h={120} size={56} label={o.orig} tone="a" at={t(o.t0)} />,
    <Box key="al" dur={d} x={290} y={700} w={400} h={140} size={56} label={o.alpha} tone="hot" at={t(o.t1)} />,
    <Box key="be" dur={d} x={790} y={700} w={400} h={140} size={56} label={o.beta} tone="b" at={t(o.t2)} />,
    <Box key="n1" dur={d} x={540} y={960} w={900} h={120} size={56} label={o.new1} tone="b" at={t(o.t3)} />,
    <Box key="n2" dur={d} x={540} y={1150} w={900} h={120} size={56} label={o.new2} tone="hot" at={t(o.t4)} />,
  ];
  const rows = ["S → A", "A → Ad|Ae|aB|aC", "B → bBC|f", "C → CF|Cd|g|h", "E → g|ε", "F → f|ε"];
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Eliminate left recursion from: S→A, A→Ad|Ae|aB|aC, B→bBC|f, C→CF|Cd|g|h, E→g|ε, F→f|ε. Rule: A→Aα|β becomes A→βA', A'→αA'|ε.", n: 4, marks: 5, y: 430 }),
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: 4.5, x: 540, y: 780, z: 1.04 }] }),
    // 2. from zero: a rule that starts with itself; sign analogy; the parser loops forever (calls pile up)
    S("let's start", (r, d) => {
      const t = a => a - 6.0;
      return [
        <Head key="h" dur={d} text="left recursion" y={170} size={120} at={0.1} />,
        <Box key="l" dur={d} x={250} y={520} w={170} h={120} size={70} label="A" tone="a" at={t(8.3)} />,
        <Arrow key="a" dur={d} x1={350} y1={520} x2={450} y2={520} width={8} at={t(9.0)} />,
        <Box key="r1" dur={d} x={600} y={520} w={170} h={120} size={70} label="A" tone="hot" at={t(9.8)} />,
        <Box key="r2" dur={d} x={800} y={520} w={170} h={120} size={70} label="d" tone="b" at={t(10.4)} />,
        <Ring key="rg" dur={d} x={600} y={520} r={95} at={t(10.3)} />,
        <Label key="sw" dur={d} text="starts with itself" x={700} y={640} w={700} size={48} color={C.coral} at={t(11.2)} />,
        <Box key="sg" dur={d} x={540} y={800} w={780} h={120} size={46} label="to read me, first read me" tone="a" at={t(16.6)} />,
        ...[0, 1, 2, 3, 4].map(i => <Box key={"c" + i} dur={d} x={400} y={1380 - i * 110} w={300} h={96} size={52} label="A()" tone={i === 4 ? "hot" : "a"} at={t(20.5) + i * 0.4} />),
        <Label key="pl" dur={d} text="the parser calls A() again..." x={540} y={1450} w={980} size={42} color={C.coral} at={t(20.6)} />,
        <Mascot key="tok" dur={d} size={190} tag="A" at={t(20.3)} pts={[{ t: t(20.3), x: 800, y: 1120, look: [-1, 0], mood: "think" }, { t: t(21.8), x: 800, y: 1120, look: [-1, 0], mood: "shock" }]} />,
      ];
    }, { hold: 15.8, holdY: 900, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 14, x: 540, y: 900, z: 1.0 }] }),
    // 3. what the question wants
    S("so the question", (r, d) => {
      const t = a => a - 23.2;
      return [
        <Head key="h" dur={d} text="the plan" y={190} size={150} at={0.1} />,
        <Box key="b1" dur={d} x={480} y={620} w={780} h={140} size={50} label="1  check every rule" tone="a" at={t(24.4)} />,
        <Check key="c1" dur={d} x={960} y={630} size={90} at={t(25.4)} />,
        <Box key="b2" dur={d} x={480} y={840} w={780} h={140} size={46} label="2  fix left-recursive ones" tone="a" at={t(25.8)} />,
        <Check key="c2" dur={d} x={960} y={850} size={90} at={t(27.6)} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: 5, x: 540, y: 740, z: 1.05 }] }),
    // 4. the fix: A -> A alpha | beta   becomes   A -> beta A',  A' -> alpha A' | eps
    S("here is the fix", (r, d) => {
      const t = a => a - 28.9;
      return [
        <Head key="h" dur={d} text="the fix" y={170} size={130} at={0.1} />,
        <Box key="top" dur={d} x={540} y={520} w={860} h={120} size={64} label="A → A α | β" tone="a" at={t(30.4)} />,
        <Arrow key="a1" dur={d} x1={440} y1={590} x2={320} y2={696} width={7} at={t(33.0)} />,
        <Box key="al" dur={d} x={290} y={780} w={400} h={140} size={60} label="A α" sub="starts with A" tone="hot" at={t(33.0)} />,
        <Arrow key="a2" dur={d} x1={640} y1={590} x2={760} y2={696} width={7} at={t(36.3)} />,
        <Box key="be" dur={d} x={790} y={780} w={400} h={140} size={60} label="β" sub="the others" tone="b" at={t(36.3)} />,
        <Box key="n1" dur={d} x={540} y={1060} w={760} h={120} size={60} label="A → β A'" tone="b" at={t(38.4)} />,
        <Box key="n2" dur={d} x={540} y={1240} w={860} h={120} size={60} label="A' → α A' | ε" tone="hot" at={t(40.6)} />,
      ];
    }, { hold: 14.6, holdY: 880, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 12, x: 540, y: 900, z: 1.03 }] }),
    // 5. check each rule
    S("check each rule", (r, d) => {
      const t = a => a - 44.8, Y = i => 380 + i * 160;
      const at = [46.6, 48.8, 50.7, 54.0, 55.8, 56.4], mk = [47.8, 49.6, 52.8, 54.8, 56.8, 57.0], bad = [false, true, false, true, false, false];
      return [
        <Head key="h" dur={d} text="check each rule" y={170} size={100} at={0.1} />,
        ...rows.flatMap((s, i) => [
          <Box key={"r" + i} dur={d} x={440} y={Y(i)} w={760} h={120} size={54} label={s} tone="a" at={t(at[i])} />,
          bad[i] ? <XMark key={"m" + i} dur={d} x={900} y={Y(i)} size={80} at={t(mk[i])} /> : <Check key={"m" + i} dur={d} x={900} y={Y(i)} size={80} at={t(mk[i])} />]),
      ];
    }, { hold: 12.2, holdY: 800, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: 10, x: 540, y: 820, z: 1.02 }] }),
    // 6. fix A
    S("fix a", (r, d) => {
      const t = a => a - 58.2;
      return fix(d, t, { head: "fix A", orig: "A → Ad|Ae|aB|aC", t0: 58.4, alpha: "α = d, e", t1: 59.7, beta: "β = aB, aC", t2: 62.2,
        new1: "A → aBA' | aCA'", t3: 64.8, new2: "A' → dA' | eA' | ε", t4: 69.1 });
    }, { hold: 14.9, holdY: 780, cam: [{ t: 0, x: 540, y: 720, z: 1.0 }, { t: 12, x: 540, y: 800, z: 1.03 }] }),
    // 7. fix C
    S("fix c", (r, d) => {
      const t = a => a - 74.4;
      return fix(d, t, { head: "fix C", orig: "C → CF|Cd|g|h", t0: 74.6, alpha: "α = F, d", t1: 76.0, beta: "β = g, h", t2: 78.2,
        new1: "C → gC' | hC'", t3: 80.7, new2: "C' → FC' | dC' | ε", t4: 84.8 });
    }, { hold: 14.6, holdY: 780, cam: [{ t: 0, x: 540, y: 720, z: 1.0 }, { t: 12, x: 540, y: 800, z: 1.03 }] }),
    // 8. same strings, no loop
    S("same strings", (r, d) => {
      const t = a => a - 90.2;
      return [
        <Head key="h" dur={d} text="same strings?" y={170} size={100} at={0.1} />,
        <Label key="b0" dur={d} text="before" x={540} y={420} w={900} size={56} color={C.coral} at={t(91.8)} />,
        <Label key="b1" dur={d} text="A ⇒ Ad ⇒ Aed ⇒ aBed" x={540} y={520} w={980} size={52} at={t(92.8)} />,
        <Label key="a0" dur={d} text="after" x={540} y={760} w={900} size={56} color={C.cobalt} at={t(96.3)} />,
        <Label key="a1" dur={d} text="A ⇒ aBA' ⇒ aBeA' ⇒ aBedA' ⇒ aBed" x={540} y={860} w={1000} size={46} at={t(97.0)} />,
        <Box key="bx" dur={d} x={540} y={1150} w={380} h={150} size={70} label="aBed" sub="same string" tone="hot" at={t(97.7)} />,
        <Label key="nl" dur={d} text="no loop" x={540} y={1300} w={700} size={60} color={C.cobalt} at={t(98.7)} />,
      ];
    }, { hold: 8.2, holdY: 800, cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: 6, x: 540, y: 820, z: 1.03 }] }),
    // 9. the exam answer
    S("so in your exam", (r, d) => {
      const t = a => a - 99.9;
      return [...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "S → A,  B → bBC|f,  E → g|ε,  F → f|ε  stay unchanged.",
        "A → aBA' | aCA'",
        "A' → dA' | eA' | ε",
        "C → gC' | hC'",
        "C' → FC' | dC' | ε" ],
        times: [t(102.4), t(105.6), t(106.6), t(107.6), t(108.3)] })];
    }, { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 10. memory trick + payoff
    S("to remember", (r, d) => {
      const t = a => a - 109.7;
      return [
        <Head key="h1" dur={d} text="beta first" y={380} size={100} at={t(110.8)} />,
        <Head key="h2" dur={d} text="then the tail" y={600} size={100} at={t(112.0)} />,
        <Head key="h3" dur={d} text="epsilon to stop" y={820} size={100} at={t(113.1)} />,
        <Head key="h4" dur={d} text="5 marks" y={1100} size={150} at={t(114.6)} />,
        <Check key="ck" dur={d} x={540} y={1440} size={170} at={t(115.5)} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 5, x: 540, y: 960, z: 1.0 }] }),
  ];
};
