import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const M = C.fMono;
  const sick = [3, 17, 30, 44, 51, 66, 79, 90, 102];
  return [
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "What is Bayes' theorem?", n: 3, marks: 5, y: 560 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "theorem", x: 540, y: 780, z: 1.06 }] }),

    // from zero: a detective updates her suspicion when a clue arrives
    S("Let's start", (r, d) => [
      <Head dur={d} text="a detective" y={190} size={120} at={0.1} />,
      <Ico dur={d} ctx={ctx} name="user-search" x={240} y={640} size={230} at={r("detective")} />,
      <Box dur={d} x={750} y={640} w={400} h={170} label="20%" sub="suspicion" size={80} tone="a" at={r("suspicion")} out={r("changes")} />,
      <Box dur={d} x={750} y={640} w={400} h={170} label="90%" sub="suspicion" size={80} tone="hot" at={r("changes")} />,
      <Ico dur={d} ctx={ctx} name="fingerprint" x={750} y={1000} size={190} color={C.cobalt} at={r("clue") + 0.2} />,
      <Label dur={d} text="new clue" x={750} y={1130} w={420} size={50} color={C.cobalt} at={r("arrives")} />,
      <Arrow dur={d} x1={750} y1={900} x2={750} y2={745} color={C.cobalt} width={9} at={r("arrives") + 0.1} />,
      <Label dur={d} text={"Bayes' theorem =\nthe exact maths of that change"} x={540} y={1300} w={940} size={52} color={C.coral} at={r("exact")} />,
    ], { hold: "theorem is" }),

    S("So the question", (r, d) => [
      <Label dur={d} text="the question wants:" x={540} y={470} w={960} size={74} at={0.15} />,
      <Label dur={d} text="1.  the formula" x={150} y={680} w={820} size={62} align="left" at={r("formula")} />,
      <Check dur={d} x={95} y={715} size={80} at={r("formula") + 0.9} />,
      <Label dur={d} text="2.  what each part means" x={150} y={860} w={860} size={62} align="left" at={r("what")} />,
      <Check dur={d} x={95} y={895} size={80} at={r("what") + 0.9} />,
    ]),

    // the formula, then its four parts named
    S("Here's the formula", (r, d) => [
      <Head dur={d} text="Bayes" y={170} size={120} at={0.1} />,
      <Label dur={d} text="P(A|B)" x={205} y={750} w={330} size={70} font={M} at={r("probability")} />,
      <Label dur={d} text="=" x={395} y={745} w={80} size={90} font={M} at={r("equals")} />,
      <Label dur={d} text="P(B|A)" x={585} y={690} w={280} size={74} font={M} at={r("B given A")} />,
      <Label dur={d} text="× P(A)" x={880} y={690} w={280} size={74} font={M} at={r("times")} />,
      <Arrow dur={d} x1={450} y1={800} x2={1030} y2={800} head={false} width={8} color={C.navy} at={r("divided")} />,
      <Label dur={d} text="P(B)" x={740} y={830} w={280} size={74} font={M} at={r("divided") + 0.9} />,
      // names
      <Arrow dur={d} x1={880} y1={625} x2={880} y2={680} color={C.cobalt} width={7} at={r("prior") - 0.1} />,
      <Label dur={d} text="prior" x={880} y={555} w={300} size={46} color={C.coral} at={r("prior")} />,
      <Arrow dur={d} x1={585} y1={625} x2={585} y2={680} color={C.cobalt} width={7} at={r("likelihood") - 0.1} />,
      <Label dur={d} text="likelihood" x={585} y={555} w={300} size={46} color={C.coral} at={r("likelihood")} />,
      <Arrow dur={d} x1={740} y1={985} x2={740} y2={930} color={C.cobalt} width={7} at={r("evidence") - 0.1} />,
      <Label dur={d} text="evidence" x={740} y={1000} w={300} size={46} color={C.coral} at={r("evidence")} />,
      <Arrow dur={d} x1={205} y1={925} x2={205} y2={850} color={C.cobalt} width={7} at={r("posterior") - 0.1} />,
      <Label dur={d} text="posterior" x={205} y={940} w={320} size={46} color={C.coral} at={r("posterior")} />,
      <Label dur={d} text="= the updated belief" x={540} y={1160} w={940} size={60} color={C.cobalt} at={r("updated")} />,
    ], { hold: "updated belief" }),

    // the worked example, built from 1000 people
    S("Now an example", (r, d) => [
      <Head dur={d} text="example" y={170} size={110} at={0.1} />,
      <Box dur={d} x={540} y={450} w={520} h={120} label="1000 people" size={56} tone="a" at={r("people")} />,
      <Arrow dur={d} x1={440} y1={515} x2={300} y2={625} head={false} width={6} at={r("disease") - 0.1} />,
      <Arrow dur={d} x1={640} y1={515} x2={780} y2={625} head={false} width={6} at={r("disease") - 0.1} />,
      <Box dur={d} x={270} y={690} w={400} h={120} label="10 sick" size={52} tone="hot" at={r("disease")} />,
      <Box dur={d} x={790} y={690} w={420} h={120} label="990 healthy" size={50} tone="b" at={r("disease") + 0.2} />,
      <Arrow dur={d} x1={270} y1={755} x2={270} y2={845} color={C.cobalt} width={7} at={r("nine") - 0.1} />,
      <Box dur={d} x={270} y={910} w={400} h={120} label="9 test +" size={52} tone="hot" at={r("nine")} />,
      <Label dur={d} text="10% wrongly flagged" x={790} y={790} w={420} size={36} color={C.coral} at={r("flags")} />,
      <Box dur={d} x={790} y={910} w={420} h={120} label="99 test +" size={52} tone="b" at={r("99")} />,
      <Box dur={d} x={540} y={1130} w={760} h={120} label="9 + 99 = 108 positive" size={46} tone="a" at={r("108")} />,
      <Label dur={d} text="only 9 truly sick" x={540} y={1230} w={900} size={52} color={C.coral} at={r("truly")} />,
      <Label dur={d} text="9 / 108 = about 8%" x={540} y={1370} w={960} size={76} color={C.cobalt} at={r("nine over")} />,
    ], { hold: "about" }),

    // why it matters: 108 positives, only 9 sick
    S("See why", (r, d) => {
      const sq = Array.from({ length: 108 }, (_, i) => ({ x: 60 + (i % 12) * 80, y: 400 + Math.floor(i / 12) * 80, hot: sick.includes(i) }));
      return [
        <Head dur={d} text="108 positives" y={170} size={110} at={0.1} />,
        <Layer dur={d} at={r("positive")}>{sq.map((s, i) => <rect key={i} x={s.x} y={s.y} width={64} height={64} radius={10} fill={C.chip} strokeColor={C.navy} strokeWidth={3} />)}</Layer>,
        <Layer dur={d} at={r("low")}>{sq.filter(s => s.hot).map((s, i) => <rect key={i} x={s.x} y={s.y} width={64} height={64} radius={10} fill={C.coral} strokeColor={C.navy} strokeWidth={3} />)}</Layer>,
        <Label dur={d} text="only 9 are truly sick" x={540} y={1180} w={960} size={60} color={C.coral} at={r("low")} />,
        <Label dur={d} text="the disease is rare to begin with" x={540} y={1280} w={960} size={52} at={r("rare")} />,
      ];
    }, { hold: "begin" }),

    S("So in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "Bayes' theorem: P(A|B) = P(B|A) × P(A) / P(B)",
        "P(A) prior, P(B|A) likelihood, P(B) evidence, P(A|B) posterior.",
        "It updates the belief in A when new evidence B arrives.",
        "Example: 9 of 108 positive tests are truly sick, about 8%.",
        "Used in spam filters and medical diagnosis." ],
        times: [r("Bayes"), r("Prior"), r("updates"), r("used") - 0.8, r("used")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

    S("To remember", (r, d) => [
      <Ico dur={d} ctx={ctx} name="search" x={540} y={420} size={190} color={C.coral} at={0.1} />,
      <Label dur={d} text="new belief" x={540} y={600} w={980} size={88} color={C.coral} at={r("new")} />,
      <Label dur={d} text="= old belief" x={540} y={720} w={980} size={80} at={r("old")} />,
      <Label dur={d} text="× how well the clue fits" x={540} y={840} w={980} size={60} color={C.cobalt} at={r("times")} />,
      <Label dur={d} text="5 marks" x={540} y={1060} w={900} size={150} color={C.coral} at={r("Five")} />,
      <Check dur={d} x={540} y={1420} size={180} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 1000, z: 1.06 }] }),
  ];
};
