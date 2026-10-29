import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => [
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "What is a semantic network? Explain with an example.", n: 5, marks: 5, y: 540 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "example", x: 540, y: 780, z: 1.06 }] }),

  // from zero: a mind map the computer can store
  S("Let's start", (r, d) => [
    <Head dur={d} text="a mind map" y={170} size={120} at={0.1} />,
    <Ico dur={d} ctx={ctx} name="database" x={540} y={470} size={130} color={C.cobalt} at={r("store")} />,
    <Label dur={d} text="what the computer knows" x={540} y={560} w={900} size={40} color={C.cobalt} at={r("knows")} />,
    <Box dur={d} x={190} y={800} w={200} h={110} label="Tom" size={50} tone="a" at={r("bubbles")} />,
    <Box dur={d} x={540} y={800} w={200} h={110} label="cat" size={50} tone="a" at={r("bubbles") + 0.25} />,
    <Box dur={d} x={890} y={800} w={200} h={110} label="fish" size={50} tone="a" at={r("bubbles") + 0.5} />,
    <Arrow dur={d} x1={295} y1={800} x2={435} y2={800} label="is a" at={r("labeled")} />,
    <Arrow dur={d} x1={645} y1={800} x2={785} y2={800} label="eats" at={r("labeled") + 0.3} />,
    <Label dur={d} text="= a semantic network" x={540} y={1000} w={980} size={64} color={C.coral} at={r("exactly")} />,
  ], { hold: "That is exactly" }),

  S("So the question", (r, d) => [
    <Label dur={d} text="the question wants:" x={540} y={470} w={960} size={74} at={0.15} />,
    <Label dur={d} text="1.  what it is" x={150} y={680} w={820} size={62} align="left" at={r("What")} />,
    <Check dur={d} x={95} y={715} size={80} at={r("What") + 0.9} />,
    <Label dur={d} text="2.  an example" x={150} y={860} w={860} size={62} align="left" at={r("example")} />,
    <Check dur={d} x={95} y={895} size={80} at={r("example") + 0.9} />,
  ]),

  // the formal definition: a graph of nodes and arcs
  S("Formally", (r, d) => [
    <Head dur={d} text="a graph" y={170} size={130} at={0.1} />,
    <Box dur={d} x={250} y={650} w={200} h={110} label="A" size={56} tone="ghost" at={r("graph")} />,
    <Box dur={d} x={830} y={650} w={200} h={110} label="B" size={56} tone="ghost" at={r("graph") + 0.2} />,
    <Arrow dur={d} x1={360} y1={650} x2={720} y2={650} color={C.cobalt} width={8} at={r("graph") + 0.5} />,
    <Label dur={d} text="node" x={250} y={740} w={300} size={46} color={C.coral} at={r("nodes")} />,
    <Label dur={d} text="node" x={830} y={740} w={300} size={46} color={C.coral} at={r("nodes") + 0.2} />,
    <Label dur={d} text="concept or object" x={540} y={850} w={900} size={48} at={r("concepts")} />,
    <Label dur={d} text="arc (link)" x={540} y={560} w={500} size={46} color={C.cobalt} at={r("arcs")} />,
    <Label dur={d} text="= a relation between nodes" x={540} y={990} w={980} size={54} color={C.coral} at={r("relations")} />,
  ], { hold: "between them" }),

  // the two link types: is-a and has/can
  S("Two kinds", (r, d) => [
    <Head dur={d} text="2 links" y={170} size={120} at={0.1} />,
    <Box dur={d} x={180} y={470} w={210} h={100} label="canary" size={44} tone="a" at={r("canary")} />,
    <Arrow dur={d} x1={290} y1={470} x2={430} y2={470} label="is-a" at={r("bird") - 0.3} />,
    <Box dur={d} x={540} y={470} w={210} h={100} label="bird" size={46} tone="a" at={r("bird")} />,
    <Arrow dur={d} x1={650} y1={470} x2={790} y2={470} label="is-a" at={r("animal") - 0.3} />,
    <Box dur={d} x={900} y={470} w={210} h={100} label="animal" size={44} tone="a" at={r("animal")} />,
    <Label dur={d} text="has / can = properties" x={540} y={680} w={980} size={50} color={C.coral} at={r("properties")} />,
    <Box dur={d} x={200} y={850} w={230} h={100} label="bird" size={46} tone="b" at={r("bird has")} />,
    <Arrow dur={d} x1={325} y1={850} x2={495} y2={850} label="has" at={r("bird has") + 0.3} />,
    <Box dur={d} x={620} y={850} w={230} h={100} label="wings" size={46} tone="hot" at={r("wings")} />,
    <Box dur={d} x={200} y={1010} w={230} h={100} label="bird" size={46} tone="b" at={r("bird can")} />,
    <Arrow dur={d} x1={325} y1={1010} x2={495} y2={1010} label="can" at={r("bird can") + 0.3} />,
    <Box dur={d} x={620} y={1010} w={230} h={100} label="fly" size={46} tone="hot" at={r("fly")} />,
    <Box dur={d} x={200} y={1170} w={230} h={100} label="animal" size={44} tone="b" at={r("animal has")} />,
    <Arrow dur={d} x1={325} y1={1170} x2={495} y2={1170} label="has" at={r("animal has") + 0.3} />,
    <Box dur={d} x={620} y={1170} w={230} h={100} label="skin" size={46} tone="hot" at={r("skin")} />,
  ], { hold: "animal has" }),

  // the full example network, then inheritance
  S("Now draw", (r, d) => [
    <Head dur={d} text="the example" y={170} size={110} at={0.1} />,
    <Box dur={d} x={400} y={430} w={240} h={110} label="animal" size={50} tone="a" at={r("Animal")} />,
    <Arrow dur={d} x1={400} y1={665} x2={400} y2={490} color={C.cobalt} width={7} at={r("bird") - 0.2} />,
    <Label dur={d} text="is-a" x={300} y={560} w={140} size={36} color={C.coral} at={r("bird")} />,
    <Box dur={d} x={400} y={720} w={240} h={110} label="bird" size={50} tone="a" at={r("bird")} />,
    <Arrow dur={d} x1={400} y1={1015} x2={400} y2={785} color={C.cobalt} width={7} at={r("canary") - 0.2} />,
    <Label dur={d} text="is-a" x={300} y={880} w={140} size={36} color={C.coral} at={r("canary")} />,
    <Box dur={d} x={400} y={1070} w={240} h={110} label="canary" size={50} tone="a" at={r("canary")} />,
    <Arrow dur={d} x1={525} y1={430} x2={725} y2={430} label="has" at={r("skin") - 0.3} />,
    <Box dur={d} x={850} y={430} w={250} h={100} label="skin" size={46} tone="hot" at={r("skin")} />,
    <Arrow dur={d} x1={525} y1={700} x2={725} y2={650} color={C.cobalt} width={7} at={r("wings") - 0.3} />,
    <Label dur={d} text="has" x={640} y={600} w={120} size={36} color={C.coral} at={r("wings") - 0.2} />,
    <Box dur={d} x={850} y={645} w={250} h={100} label="wings" size={46} tone="hot" at={r("wings")} />,
    <Arrow dur={d} x1={525} y1={745} x2={725} y2={800} color={C.cobalt} width={7} at={r("fly") - 0.3} />,
    <Label dur={d} text="can" x={640} y={810} w={120} size={36} color={C.coral} at={r("fly") - 0.2} />,
    <Box dur={d} x={850} y={805} w={250} h={100} label="fly" size={46} tone="hot" at={r("fly")} />,
    <Arrow dur={d} x1={525} y1={1040} x2={725} y2={990} color={C.cobalt} width={7} at={r("yellow") - 0.3} />,
    <Label dur={d} text="is" x={640} y={925} w={120} size={36} color={C.coral} at={r("yellow") - 0.2} />,
    <Box dur={d} x={850} y={960} w={250} h={100} label="yellow" size={46} tone="hot" at={r("yellow")} />,
    <Arrow dur={d} x1={525} y1={1095} x2={725} y2={1150} color={C.cobalt} width={7} at={r("sing") - 0.3} />,
    <Label dur={d} text="can" x={640} y={1160} w={120} size={36} color={C.coral} at={r("sing") - 0.2} />,
    <Box dur={d} x={850} y={1150} w={250} h={100} label="sing" size={46} tone="hot" at={r("sing")} />,
    // inheritance
    <Mascot dur={d} size={130} at={r("Ask") - 0.3} pts={[{ t: r("Ask") - 0.3, x: 130, y: 1070, look: [1, 0], mood: "think" }, { t: r("follow") - 0.1, x: 130, y: 1070, look: [1, 0], mood: "think" }, { t: r("follow") + 0.8, x: 130, y: 720, look: [1, 0], mood: "think" }, { t: r("Bird can fly") + 0.3, x: 130, y: 720, look: [1, 0], mood: "happy" }, { t: r("yes") + 0.6, x: 130, y: 1070, look: [1, 0], mood: "happy" }]} />,
    <Label dur={d} text="can a canary fly?" x={540} y={1255} w={980} size={50} at={r("Ask")} />,
    <Label dur={d} text="not stored at the canary node" x={540} y={1315} w={980} size={42} color={C.cobalt} at={r("doesn't")} />,
    <Arrow dur={d} x1={400} y1={1015} x2={400} y2={785} color={C.coral} width={14} at={r("follow")} />,
    <Ring dur={d} x={850} y={805} r={90} at={r("Bird can fly")} />,
    <Label dur={d} text="follow is-a up: the bird can fly" x={540} y={1370} w={980} size={42} color={C.coral} at={r("follow")} />,
    <Label dur={d} text="YES: inherited, never stored twice" x={540} y={1425} w={980} size={46} color={C.coral} at={r("yes")} />,
  ], { hold: "inherits what" }),

  S("So in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
      "A semantic network is a graph of nodes and labelled arcs that represents knowledge.",
      "Nodes are concepts or objects.",
      "Arcs are relations such as is-a and has.",
      "Properties are inherited down the is-a links.",
      "Example: canary is-a bird is-a animal; bird has wings and can fly; animal has skin; canary is yellow, can sing." ],
      times: [r("semantic"), r("Nodes"), r("Arcs"), r("Properties"), r("draw")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  S("To remember", (r, d) => [
    <Box dur={d} x={300} y={500} w={80} h={80} r={40} tone="hot" at={r("dots")} />,
    <Box dur={d} x={540} y={640} w={80} h={80} r={40} tone="hot" at={r("dots") + 0.2} />,
    <Box dur={d} x={780} y={500} w={80} h={80} r={40} tone="hot" at={r("dots") + 0.4} />,
    <Arrow dur={d} x1={335} y1={525} x2={505} y2={615} head={false} width={7} at={r("Lines")} />,
    <Arrow dur={d} x1={575} y1={615} x2={745} y2={525} head={false} width={7} at={r("Lines") + 0.2} />,
    <Label dur={d} text="dots are things" x={540} y={800} w={980} size={76} color={C.coral} at={r("things")} />,
    <Label dur={d} text="lines are meanings" x={540} y={920} w={980} size={76} color={C.cobalt} at={r("meanings")} />,
    <Label dur={d} text="5 marks" x={540} y={1100} w={900} size={150} color={C.coral} at={r("Five")} />,
    <Check dur={d} x={540} y={1450} size={180} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 1000, z: 1.06 }] }),
];
