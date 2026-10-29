import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
const popA = (at = 0) => [{ property: "opacity", from: 0, to: 1, at, duration: 0.15 }, { property: "scale", from: 0.6, to: 1, at, duration: 0.3, easing: "bounce" }];
const MBox = ({ C, x, y, w = 260, h = 90, text, tone = "a", size = 44, at = 0, out, dur }) => {
  bb({ k: "box", n: text, x: x - w / 2, y: y - h / 2, w: w + 9, h: h + 9, t0: at, t1: out ?? dur });
  const f = tone === "hot" ? C.coral : tone === "b" ? C.cobalt : C.chip, tc = tone === "a" ? C.chipText : C.ink;
  return <Layer at={at} dur={dur} out={out} anim={popA(0)} sfx="pop">
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} radius={14} fill={f} strokeColor={C.navy} strokeWidth={4} />
    <text x={x - w / 2} y={y - size * 0.62} width={w} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={size} color={tc}>{text}</text>
  </Layer>; };

export const SCENES = ({ S, ctx, C }) => [
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Explain Bayesian networks and their applications in AI.", n: 12, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "applications", x: 540, y: 780, z: 1.06 }] }),

  // from zero: an uncertain world, causes and effects
  S("let's start", (r, d) => [
    <Head dur={d} text="from zero" y={170} size={130} sub="the world is uncertain" at={0.1} />,
    <Ico dur={d} ctx={ctx} name="bell-ring" x={540} y={520} size={200} color={C.coral} at={r("alarm")} />,
    <Ico dur={d} ctx={ctx} name="venetian-mask" x={250} y={850} size={150} at={r("burglar")} />,
    <Label dur={d} text="burglar" x={250} y={940} w={300} size={42} at={r("burglar") + 0.2} />,
    <Ico dur={d} ctx={ctx} name="cat" x={830} y={850} size={150} color={C.cobalt} at={r("cat")} />,
    <Label dur={d} text="cat" x={830} y={940} w={300} size={42} at={r("cat") + 0.2} />,
    <Arrow dur={d} x1={300} y1={770} x2={470} y2={630} at={r("cat") + 0.3} color={C.coral} />,
    <Arrow dur={d} x1={780} y1={770} x2={610} y2={630} at={r("cat") + 0.5} color={C.coral} />,
    <Label dur={d} text="never sure, only probabilities" x={540} y={1030} w={960} size={46} color={C.coral} at={r("probabilities") - 0.2} />,
    <Box dur={d} x={190} y={1230} w={270} h={100} label="burglary" tone="hot" size={36} at={r("burglary")} />,
    <Arrow dur={d} x1={335} y1={1230} x2={395} y2={1230} at={r("likely")} color={C.cobalt} />,
    <Box dur={d} x={540} y={1230} w={270} h={100} label="alarm" tone="b" size={40} at={r("likely") - 0.3} />,
    <Arrow dur={d} x1={685} y1={1230} x2={745} y2={1230} at={r("neighbor") + 0.3} color={C.cobalt} />,
    <Box dur={d} x={890} y={1230} w={270} h={100} label="John calls" tone="a" size={36} at={r("neighbor")} />,
    <Label dur={d} text="a Bayesian network draws these links" x={540} y={1360} w={980} size={46} color={C.coral} at={r("bayesian")} />,
  ], { hold: "them", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "burglar", x: 540, y: 880, z: 1.0 }, { t: "likely", x: 540, y: 960, z: 1.0 }] }),

  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  what it is", x: 130, y: 720, size: 58, w: 880, align: "left", at: r("what") },
      { text: "2.  where it is used", x: 130, y: 880, size: 58, w: 880, align: "left", at: r("where") }] }),
    <Check dur={d} x={80} y={760} size={70} at={r("what") + 1.1} />,
    <Check dur={d} x={80} y={920} size={70} at={r("where") + 1.1} />,
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "where", x: 540, y: 860, z: 1.05 }] }),

  // three parts: nodes, arrows, tables
  S("three parts", (r, d) => [
    <Head dur={d} text="3 parts" y={150} size={90} at={0.1} />,
    <Label dur={d} text="1. nodes" x={60} y={285} w={600} size={54} color={C.coral} align="left" at={r("nodes")} />,
    <Box dur={d} x={400} y={420} w={420} h={120} label="burglary" sub="random variable" tone="hot" size={50} at={r("random")} />,
    <Label dur={d} text="2. arrows" x={60} y={555} w={600} size={54} color={C.coral} align="left" at={r("arrows")} />,
    <Box dur={d} x={220} y={680} w={280} h={100} label="burglary" tone="hot" size={40} at={r("arrows") + 0.4} />,
    <Box dur={d} x={700} y={680} w={280} h={100} label="alarm" tone="b" size={44} at={r("directly")} />,
    <Arrow dur={d} x1={365} y1={680} x2={550} y2={680} at={r("influences")} color={C.cobalt} width={9} />,
    <Arrow dur={d} x1={700} y1={750} x2={220} y2={750} at={r("loops")} color={C.coral} />,
    <XMark dur={d} x={460} y={750} size={60} at={r("loops") + 0.4} />,
    <Label dur={d} text="no loops: directed acyclic graph" x={540} y={805} w={980} size={42} at={r("directed")} />,
    <Label dur={d} text="3. tables" x={60} y={920} w={600} size={54} color={C.coral} align="left" at={r("tables")} />,
    <Box dur={d} x={540} y={1060} w={940} h={130} label="conditional probability table" sub="P(node | parents)" tone="a" size={46} at={r("conditional")} />,
    <Label dur={d} text="how likely, given its parents" x={540} y={1160} w={900} size={42} color={C.coral} at={r("given")} />,
  ], { hold: "parents", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "arrows", x: 540, y: 880, z: 1.03 }, { t: "tables", x: 540, y: 940, z: 1.03 }] }),

  S("so nodes", (r, d) => [
    <Box dur={d} x={190} y={800} w={270} h={120} label="nodes" tone="hot" size={48} at={r("nodes")} />,
    <Box dur={d} x={540} y={800} w={270} h={120} label="arrows" tone="b" size={48} at={r("arrows")} />,
    <Box dur={d} x={890} y={800} w={270} h={120} label="tables" tone="a" size={48} at={r("tables")} />,
  ], { hold: "tables", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: 1, x: 540, y: 880, z: 1.0 }] }),

  // build one: burglary -> alarm -> John calls, with tables
  S("let's build", (r, d) => [
    <Head dur={d} text="build one" y={150} size={90} at={0.1} />,
    <Box dur={d} x={210} y={440} w={300} h={110} label="burglary" tone="hot" size={46} at={r("burglary")} />,
    <Box dur={d} x={210} y={720} w={300} h={110} label="alarm" tone="b" size={50} at={r("alarm")} />,
    <Arrow dur={d} x1={210} y1={500} x2={210} y2={660} at={r("alarm") + 0.3} color={C.cobalt} width={9} />,
    <Box dur={d} x={210} y={1000} w={300} h={110} label="John calls" tone="a" size={40} at={r("john")} />,
    <Arrow dur={d} x1={210} y1={780} x2={210} y2={940} at={r("john") + 0.3} color={C.cobalt} width={9} />,
    <Label dur={d} text="no parents" x={760} y={405} w={500} size={46} color={C.coral} at={r("parents")} out={r("number") + 0.8} />,
    <Arrow dur={d} x1={372} y1={440} x2={500} y2={440} at={r("number") + 0.8} color={C.coral} />,
    <Box dur={d} x={760} y={440} w={500} h={140} label="0.01" sub="P(burglary)" tone="hot" size={62} at={r("number") + 0.8} />,
    <Arrow dur={d} x1={372} y1={720} x2={500} y2={720} at={r("given") + 0.9} color={C.coral} />,
    <Box dur={d} x={760} y={720} w={500} h={140} label="0.9" sub="P(alarm | burglary)" tone="b" size={62} at={r("given") + 0.9} />,
    <Arrow dur={d} x1={372} y1={1000} x2={500} y2={1000} at={r("rang") + 0.8} color={C.coral} />,
    <Box dur={d} x={760} y={1000} w={500} h={140} label="0.8" sub="P(John | alarm)" tone="a" size={62} at={r("rang") + 0.8} />,
  ], { hold: 15.2, holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "alarm", x: 540, y: 860, z: 1.03 }, { t: "number", x: 540, y: 880, z: 1.03 }, { t: "rang", x: 540, y: 920, z: 1.03 }] }),

  // the big idea: joint = product of the entries
  S("the big idea", (r, d) => [
    <Head dur={d} text="the big idea" y={150} size={90} at={0.1} />,
    <Label dur={d} text="P(all) = P(B) × P(A|B) × P(J|A)" x={540} y={300} w={980} size={40} font={C.fMono} color={C.coral} at={r("product")} />,
    <Box dur={d} x={190} y={520} w={260} h={110} label="burglary" tone="hot" size={36} at={r("burglary")} />,
    <Box dur={d} x={540} y={520} w={260} h={110} label="alarm" tone="b" size={40} at={r("alarm")} />,
    <Box dur={d} x={890} y={520} w={260} h={110} label="John calls" tone="a" size={36} at={r("john")} />,
    <MBox C={C} dur={d} x={190} y={720} w={200} h={110} text="0.01" tone="hot" size={52} at={r("calls") + 1.0} />,
    <Label dur={d} text="×" x={365} y={690} w={100} size={80} font={C.fMono} at={r("times")} />,
    <MBox C={C} dur={d} x={540} y={720} w={200} h={110} text="0.9" tone="b" size={52} at={r("times") + 0.8} />,
    <Label dur={d} text="×" x={715} y={690} w={100} size={80} font={C.fMono} at={r("times") + 1.9} />,
    <MBox C={C} dur={d} x={890} y={720} w={200} h={110} text="0.8" tone="a" size={52} at={r("times") + 2.6} />,
    <MBox C={C} dur={d} x={540} y={940} w={640} h={130} text="= 0.0072" tone="hot" size={72} at={r("equals") + 0.4} />,
  ], { hold: "equals", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "burglary", x: 540, y: 820, z: 1.03 }, { t: "times", x: 540, y: 880, z: 1.04 }] }),

  // applications
  S("applications medical", (r, d) => [
    <Head dur={d} text="applications" y={170} size={100} at={0.1} />,
    <Ico dur={d} ctx={ctx} name="stethoscope" x={300} y={640} size={190} at={r("medical")} />,
    <Label dur={d} text="medical diagnosis" x={300} y={750} w={470} size={40} at={r("medical") + 0.2} />,
    <Ico dur={d} ctx={ctx} name="mail-x" x={780} y={640} size={190} color={C.cobalt} at={r("spam")} />,
    <Label dur={d} text="spam filtering" x={780} y={750} w={440} size={42} at={r("spam") + 0.2} />,
    <Ico dur={d} ctx={ctx} name="wrench" x={300} y={1100} size={190} color={C.coral} at={r("fault")} />,
    <Label dur={d} text="fault finding" x={300} y={1210} w={440} size={44} at={r("fault") + 0.2} />,
    <Ico dur={d} ctx={ctx} name="mic" x={780} y={1100} size={190} at={r("speech")} />,
    <Label dur={d} text="speech recognition" x={780} y={1210} w={470} size={40} at={r("speech") + 0.2} />,
  ], { hold: "recognition", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "medical", x: 540, y: 860, z: 1.03 }, { t: "fault", x: 540, y: 920, z: 1.04 }] }),

  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
      "Nodes are random variables.",
      "Arrows show influence.",
      "Each node has a probability table.",
      "Joint probability is the product of each node given its parents.",
      "Applications: diagnosis, spam filtering, fault finding, speech recognition."],
      times: [r("nodes"), r("arrows"), r("each"), r("joint"), r("applications")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  S("to remember", (r, d) => [
    <Head dur={d} text="remember" y={170} size={120} at={0.05} />,
    ...Sketch({ dur: d, at: 0.4, items: [
      { text: "nodes", x: 540, y: 470, size: 84, w: 900, at: r("nodes") - 0.2 },
      { text: "arrows", x: 540, y: 610, size: 84, w: 900, at: r("arrows") - 0.2 },
      { text: "tables", x: 540, y: 750, size: 84, w: 900, at: r("tables") - 0.2 },
      { text: "5 marks", x: 540, y: 960, size: 140, w: 900, color: C.coral, at: r("five") }] }),
    <Check dur={d} x={540} y={1300} size={170} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.02 }, { t: "five", x: 540, y: 900, z: 1.06 }] }),
];
