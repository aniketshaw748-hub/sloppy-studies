import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "What is the significance of a protected variable?", n: 6, marks: 2, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "protected", x: 540, y: 780, z: 1.06 }] }),
  // 2a. a variable has an access level: who may touch it
  S("let's start", (r, d) => [
    <Head dur={d} text="access level" y={190} size={160} sub="who may touch it" />,
    ...Sketch({ dur: d, at: r("variable"), speed: 3400, items: [{ rect: [140, 520, 800, 300], divider: [100], label: "class Car", size: 44 }] }),
    ...Sketch({ dur: d, at: r("variable") + 0.6, items: [{ text: "int speed;", x: 190, y: 670, size: 50, w: 600, align: "left" }] }),
    <Box dur={d} x={540} y={1020} w={640} h={120} label="access level" tone="b" at={r("access")} />,
    <Arrow dur={d} x1={540} y1={950} x2={540} y2={835} color={C.coral} width={9} at={r("says")} />,
    <Ico dur={d} ctx={ctx} name="hand" x={540} y={1260} size={150} color={C.coral} at={r("touch")} />,
  ], { hold: "touch", holdY: 860, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "access", x: 540, y: 880, z: 1.03 }] }),
  // 2b. analogy: a family recipe
  S("think of a family", (r, d) => [
    <Head dur={d} text="family recipe" y={190} size={150} />,
    ...Sketch({ dur: d, at: 0.3, speed: 3400, items: [{ rect: [340, 520, 400, 290], divider: [90], label: "RECIPE", size: 40 }, { text: "secret sauce", x: 540, y: 640, size: 40, w: 380 }] }),
    <Ico dur={d} ctx={ctx} name="user" x={170} y={1010} size={150} at={r("strangers")} />,
    <Arrow dur={d} x1={230} y1={940} x2={380} y2={825} color={C.coral} width={8} at={r("strangers") + 0.4} />,
    <XMark dur={d} x={170} y={1010} size={150} at={r("not")} />,
    <Ico dur={d} ctx={ctx} name="users-round" x={910} y={1010} size={150} at={r("strangers") + 1.7} />,
    <Arrow dur={d} x1={850} y1={940} x2={700} y2={825} color={C.coral} width={8} at={r("strangers") + 1.9} />,
    <Check dur={d} x={910} y={1190} size={100} at={r("strangers") + 2.4} />,
  ], { hold: 3.5, holdY: 860, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "strangers", x: 540, y: 860, z: 1.03 }] }),
  // 2c. protected is exactly that level
  S("protected is exactly", (r, d) => [
    <Head dur={d} text="protected" y={190} size={230} />,
    <Ico dur={d} ctx={ctx} name="shield" x={540} y={820} size={320} color={C.coral} at={0.3} />,
    ...Sketch({ dur: d, at: r("level") - 0.6, items: [{ text: "family level", x: 540, y: 1130, size: 60, w: 900 }] }),
  ], { hold: "level", holdY: 800, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 1, x: 540, y: 800, z: 1.04 }] }),
  // 3. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 72, w: 960 },
      { text: "1.  who can reach it", x: 120, y: 720, size: 56, w: 860, align: "left", at: r("who") },
      { text: "2.  why it is useful", x: 120, y: 880, size: 56, w: 860, align: "left", at: r("why") } ] }),
    <Check dur={d} x={75} y={755} size={80} at={r("reach") + 0.8} />,
    <Check dur={d} x={75} y={915} size={80} at={r("useful") + 0.4} />,
  ]),
  // 4a. three places: same class, same package, subclasses anywhere
  S("a protected variable is", (r, d) => [
    <Head dur={d} text="3 places" y={190} size={150} />,
    ...Sketch({ dur: d, at: r("variable"), speed: 3600, items: [{ rect: [60, 500, 960, 520], divider: [70], label: "package shop", size: 36 }] }),
    <Box dur={d} x={300} y={780} w={420} h={160} label="Car" sub="protected speed" size={60} tone="hot" at={r("variable") + 0.8} />,
    <Ring dur={d} x={300} y={780} r={125} at={r("same")} />,
    <Box dur={d} x={790} y={780} w={340} h={130} label="Bill" at={r("any")} />,
    <Arrow dur={d} x1={620} y1={780} x2={520} y2={780} color={C.coral} width={9} at={r("any") + 0.5} />,
    ...Sketch({ dur: d, at: r("subclasses"), speed: 3600, items: [{ rect: [60, 1120, 960, 400], divider: [70], label: "package other", size: 36 }] }),
    <Box dur={d} x={540} y={1340} w={420} h={150} label="Child" sub="extends Car" tone="b" at={r("child")} />,
    <Arrow dur={d} x1={380} y1={1262} x2={290} y2={875} color={C.coral} width={9} at={r("even")} />,
  ], { hold: "different", holdY: 960, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "subclasses", x: 540, y: 1000, z: 1.03 }] }),
  // 4b. significance: inheritance
  S("its significance", (r, d) => [
    <Head dur={d} text="inheritance" y={190} size={150} />,
    <Box dur={d} x={540} y={620} w={460} h={140} label="Parent" at={r("parent")} />,
    <Box dur={d} x={300} y={900} w={400} h={130} label="Child 1" tone="b" at={r("share")} />,
    <Box dur={d} x={780} y={900} w={400} h={130} label="Child 2" tone="b" at={r("share") + 0.25} />,
    <Arrow dur={d} x1={440} y1={695} x2={320} y2={830} color={C.coral} width={9} at={r("data")} />,
    <Arrow dur={d} x1={640} y1={695} x2={760} y2={830} color={C.coral} width={9} at={r("data")} />,
    ...Sketch({ dur: d, at: r("data"), items: [{ text: "shares its data", x: 540, y: 1030, size: 54, w: 900, color: C.coral }] }),
    <Ico dur={d} ctx={ctx} name="globe" x={540} y={1250} size={150} at={r("public")} />,
    <XMark dur={d} x={540} y={1250} size={120} at={r("everyone")} />,
    ...Sketch({ dur: d, at: r("everyone"), items: [{ text: "not public to everyone", x: 540, y: 1380, size: 46, w: 960 }] }),
  ], { hold: "everyone", holdY: 900, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "share", x: 540, y: 880, z: 1.03 }, { t: "public", x: 540, y: 1000, z: 1.03 }] }),
  // 5. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 200, fs: 36, title: "WRITE THIS · 2 MARKS", points: [
      "A protected variable is accessible in its own class, its package, and its subclasses in other packages.",
      "It supports inheritance while hiding data from everyone else." ],
      times: [r("protected"), r("supports")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 6. memory trick + payoff
  S("remember", (r, d) => [
    <Head dur={d} text="protected = family" y={190} size={130} />,
    <Ico dur={d} ctx={ctx} name="users-round" x={540} y={700} size={280} color={C.coral} at={r("family") - 0.5} />,
    <Mascot dur={d} size={200} tag="Car" pts={[{ t: 0, x: 540, y: 1060, look: [0, -1] }, { t: r("two"), x: 540, y: 1060, look: [0, 0], mood: "happy" }]} />,
    ...Sketch({ dur: d, at: r("two"), items: [{ text: "2 marks", x: 540, y: 1200, size: 120, w: 900 }] }),
    <Check dur={d} x={540} y={1400} size={110} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "family", x: 540, y: 880, z: 1.02 }] }),
];
