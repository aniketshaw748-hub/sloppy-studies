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
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Remove left recursion: S→S+(E)|(E), E→E*(F)|(F), F→F(S)|id.", n: 5, marks: 5, y: 520 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: 3.5, x: 540, y: 800, z: 1.05 }] }),
    // 2. from zero: a rule that starts with itself; dictionary analogy; the parser loops forever
    S("let's start", (r, d) => {
      const t = a => a - 5.3;
      return [
        <Head key="h" dur={d} text="left recursion" y={170} size={120} at={0.1} />,
        <Box key="l" dur={d} x={250} y={520} w={170} h={120} size={70} label="F" tone="a" at={t(7.4)} />,
        <Arrow key="a" dur={d} x1={350} y1={520} x2={420} y2={520} width={8} at={t(8.3)} />,
        <Box key="r1" dur={d} x={540} y={520} w={170} h={120} size={70} label="F" tone="hot" at={t(9.1)} />,
        <Box key="r2" dur={d} x={790} y={520} w={300} h={120} size={64} label="( S )" tone="b" at={t(9.4)} />,
        <Ring key="rg" dur={d} x={540} y={520} r={95} at={t(9.8)} />,
        <Label key="sw" dur={d} text="starts with itself" x={640} y={640} w={800} size={48} color={C.coral} at={t(10.6)} />,
        <Box key="sg" dur={d} x={540} y={800} w={780} h={120} size={48} label="loop = see loop" tone="a" at={t(13.4)} />,
        ...[0, 1, 2, 3, 4].map(i => <Box key={"c" + i} dur={d} x={400} y={1380 - i * 110} w={300} h={96} size={52} label="F()" tone={i === 4 ? "hot" : "a"} at={t(19.8) + i * 0.35} />),
        <Label key="pl" dur={d} text="the parser calls F() again..." x={540} y={1450} w={980} size={42} color={C.coral} at={t(19.9)} />,
        <Mascot key="tok" dur={d} size={190} tag="F" at={t(19.7)} pts={[{ t: t(19.7), x: 800, y: 1120, look: [-1, 0], mood: "think" }, { t: t(21.1), x: 800, y: 1120, look: [-1, 0], mood: "shock" }]} />,
      ];
    }, { hold: 15.8, holdY: 900, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 14, x: 540, y: 900, z: 1.0 }] }),
    // 3. what the question wants
    S("so the question", (r, d) => {
      const t = a => a - 22.4;
      return [
        <Head key="h" dur={d} text="the goal" y={190} size={150} at={0.1} />,
        <Box key="b1" dur={d} x={480} y={620} w={780} h={140} size={50} label="rewrite every rule" tone="a" at={t(24.1)} />,
        <Box key="b2" dur={d} x={480} y={840} w={780} h={140} size={50} label="the loop is gone" tone="a" at={t(25.5)} />,
        <Check key="c2" dur={d} x={960} y={850} size={90} at={t(26.3)} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: 4, x: 540, y: 740, z: 1.05 }] }),
    // 4. the fix
    S("here is the fix", (r, d) => {
      const t = a => a - 27.2;
      return [
        <Head key="h" dur={d} text="the fix" y={170} size={130} at={0.1} />,
        <Box key="top" dur={d} x={540} y={520} w={860} h={120} size={64} label="A → A α | β" tone="a" at={t(28.7)} />,
        <Arrow key="a1" dur={d} x1={440} y1={590} x2={320} y2={696} width={7} at={t(32.1)} />,
        <Box key="al" dur={d} x={280} y={780} w={440} h={140} size={60} label="α" sub="part after A" tone="hot" at={t(32.1)} />,
        <Arrow key="a2" dur={d} x1={640} y1={590} x2={760} y2={696} width={7} at={t(34.9)} />,
        <Box key="be" dur={d} x={800} y={780} w={440} h={140} size={60} label="β" sub="not starting with A" tone="b" at={t(34.9)} />,
        <Box key="n1" dur={d} x={540} y={1060} w={760} h={120} size={60} label="A → β A'" tone="b" at={t(38.2)} />,
        <Box key="n2" dur={d} x={540} y={1240} w={860} h={120} size={60} label="A' → α A' | ε" tone="hot" at={t(40.3)} />,
      ];
    }, { hold: 16.5, holdY: 880, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 13, x: 540, y: 900, z: 1.03 }] }),
    // 5. rule one: S
    S("rule one", (r, d) => {
      const t = a => a - 44.9;
      return fix(d, t, { head: "rule one", orig: "S → S+(E) | (E)", t0: 46.3, alpha: "α = +(E)", t1: 50.9, beta: "β = (E)", t2: 53.8,
        new1: "S → (E)S'", t3: 56.3, new2: "S' → +(E)S' | ε", t4: 59.7 });
    }, { hold: 18.1, holdY: 780, cam: [{ t: 0, x: 540, y: 720, z: 1.0 }, { t: 14, x: 540, y: 800, z: 1.03 }] }),
    // 6. rule two: E
    S("rule two", (r, d) => {
      const t = a => a - 64.2;
      return fix(d, t, { head: "rule two", orig: "E → E*(F) | (F)", t0: 65.6, alpha: "α = *(F)", t1: 70.3, beta: "β = (F)", t2: 70.9,
        new1: "E → (F)E'", t3: 72.3, new2: "E' → *(F)E' | ε", t4: 75.7 });
    }, { hold: 14.8, holdY: 780, cam: [{ t: 0, x: 540, y: 720, z: 1.0 }, { t: 12, x: 540, y: 800, z: 1.03 }] }),
    // 7. rule three: F
    S("rule three", (r, d) => {
      const t = a => a - 80.3;
      return fix(d, t, { head: "rule three", orig: "F → F(S) | id", t0: 81.7, alpha: "α = (S)", t1: 86.1, beta: "β = id", t2: 87.9,
        new1: "F → idF'", t3: 89.8, new2: "F' → (S)F' | ε", t4: 92.6 });
    }, { hold: 15.1, holdY: 780, cam: [{ t: 0, x: 540, y: 720, z: 1.0 }, { t: 12, x: 540, y: 800, z: 1.03 }] }),
    // 8. check on id(S)(S): old repeats F, new repeats F'
    S("check", (r, d) => {
      const t = a => a - 96.6;
      return [
        <Head key="h" dur={d} text="check" y={170} size={120} at={0.1} />,
        <Label key="s0" dur={d} text="string:  id(S)(S)" x={540} y={380} w={980} size={56} color={C.coral} at={t(97.4)} />,
        <Label key="o0" dur={d} text="old: repeats F" x={540} y={560} w={900} size={54} color={C.coral} at={t(100.2)} />,
        <Label key="o1" dur={d} text="F ⇒ F(S) ⇒ F(S)(S) ⇒ id(S)(S)" x={540} y={650} w={1000} size={44} at={t(100.7)} />,
        <Label key="n0" dur={d} text="new: repeats F'" x={540} y={850} w={900} size={54} color={C.cobalt} at={t(102.2)} />,
        <Label key="n1" dur={d} text="F ⇒ idF' ⇒ id(S)F' ⇒ id(S)(S)F' ⇒ id(S)(S)" x={540} y={940} w={1020} size={38} at={t(102.7)} />,
        <Label key="nl" dur={d} text="same string, no loop" x={540} y={1150} w={900} size={56} color={C.cobalt} at={t(104.4)} />,
        <Check key="ck" dur={d} x={540} y={1330} size={140} at={t(105.7)} />,
      ];
    }, { hold: 8.6, holdY: 800, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 8, x: 540, y: 860, z: 1.02 }] }),
    // 9. the exam answer
    S("so in your exam", (r, d) => {
      const t = a => a - 106.9;
      return [...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "S → (E)S'    S' → +(E)S' | ε",
        "E → (F)E'    E' → *(F)E' | ε",
        "F → idF'    F' → (S)F' | ε" ],
        times: [t(109.4), t(110.2), t(111.0)] })];
    }, { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 10. memory trick + payoff
    S("to remember", (r, d) => {
      const t = a => a - 112.4;
      return [
        <Head key="h1" dur={d} text="beta first" y={380} size={100} at={t(114.4)} />,
        <Head key="h2" dur={d} text="then the tail" y={600} size={100} at={t(115.7)} />,
        <Head key="h3" dur={d} text="epsilon to stop" y={820} size={100} at={t(116.9)} />,
        <Head key="h4" dur={d} text="5 marks" y={1100} size={150} at={t(118.6)} />,
        <Check key="ck" dur={d} x={540} y={1440} size={170} at={t(119.3)} />,
      ];
    }, { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 5, x: 540, y: 960, z: 1.0 }] }),
  ];
};
