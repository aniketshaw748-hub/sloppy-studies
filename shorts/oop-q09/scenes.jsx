import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Difference between throw and throws.", n: 9, marks: 2, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "throws", x: 540, y: 780, z: 1.06 }] }),
  // 2a. an exception is an error signal
  S("let's start", (r, d) => [
    <Head dur={d} text="exception" y={190} size={170} sub="an error signal" />,
    <Ico dur={d} ctx={ctx} name="siren" x={540} y={760} size={320} color={C.coral} at={r("exception")} />,
  ], { hold: "signal", holdY: 800, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "error", x: 540, y: 780, z: 1.04 }] }),
  // 2b. analogy: pulling a fire alarm vs a sign on the door
  S("think of a fire", (r, d) => [
    <Head dur={d} text="fire alarm" y={190} size={160} />,
    <Ico dur={d} ctx={ctx} name="bell-ring" x={290} y={640} size={200} color={C.coral} at={r("alarm")} />,
    ...Sketch({ dur: d, at: r("pulling"), items: [{ text: "pull the alarm", x: 290, y: 800, size: 40, w: 460 }] }),
    <Ico dur={d} ctx={ctx} name="door-closed" x={790} y={600} size={150} at={r("door")} />,
    ...Sketch({ dur: d, at: r("saying"), speed: 3400, items: [{ rect: [580, 710, 420, 210] }] }),
    ...Sketch({ dur: d, at: r("saying") + 0.6, items: [{ text: "alarm may", x: 790, y: 740, size: 44, w: 380, color: C.coral }, { text: "ring here", x: 790, y: 820, size: 44, w: 380, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("another"), items: [{ text: "two different things", x: 540, y: 1130, size: 56, w: 980 }] }),
  ], { hold: "another", holdY: 860, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "door", x: 560, y: 820, z: 1.03 }] }),
  // 3. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 72, w: 960 },
      { text: "the difference", x: 540, y: 680, size: 90, w: 980, color: C.coral, at: r("difference") },
      { text: "throw  vs  throws", x: 540, y: 900, size: 72, w: 980, at: r("similar") } ] }),
  ]),
  // 4a. throw: the action, inside the method body
  S("first, throw", (r, d) => [
    <Head dur={d} text="1 · throw" y={190} size={150} sub="the action" />,
    ...Sketch({ dur: d, at: r("statement"), speed: 3400, items: [{ rect: [140, 520, 800, 340], divider: [90], label: "void pay()", size: 44 }] }),
    <Label dur={d} text="throw new MyException();" x={190} y={700} w={720} align="left" size={40} font={C.fMono} color={C.coral} at={r("raises")} />,
    <Arrow dur={d} x1={540} y1={880} x2={540} y2={985} color={C.coral} width={9} at={r("right")} />,
    <Ico dur={d} ctx={ctx} name="siren" x={540} y={1100} size={200} color={C.coral} at={r("now")} />,
    ...Sketch({ dur: d, at: r("action"), items: [{ text: "throw = do it", x: 540, y: 1280, size: 70, w: 960 }] }),
  ], { hold: "action", holdY: 900, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "raises", x: 540, y: 880, z: 1.03 }] }),
  // 4b. throws: the warning in the signature, raises nothing itself
  S("second, throws", (r, d) => [
    <Head dur={d} text="2 · throws" y={190} size={150} sub="the warning" />,
    <Box dur={d} x={540} y={600} w={900} h={130} label="void pay() throws IOException" at={r("keyword")} />,
    <Arrow dur={d} x1={540} y1={670} x2={540} y2={850} color={C.coral} width={9} at={r("warns")} />,
    <Mascot dur={d} size={200} tag="caller" at={r("caller")} pts={[{ t: r("caller"), x: 540, y: 960, look: [0, -1], mood: "shock" }, { t: d - 0.1, x: 540, y: 960, look: [0, -1], mood: "shock" }]} />,
    ...Sketch({ dur: d, at: r("might"), items: [{ text: "might raise IOException", x: 540, y: 1140, size: 50, w: 980, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("nothing"), items: [{ text: "raises nothing itself", x: 540, y: 1280, size: 54, w: 980 }] }),
  ], { hold: "itself", holdY: 880, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "caller", x: 540, y: 900, z: 1.03 }] }),
  // 4c. recap: throws is the warning sign
  S("so throws is", (r, d) => [
    <Head dur={d} text="throws" y={190} size={190} />,
    <Ico dur={d} ctx={ctx} name="triangle-alert" x={540} y={780} size={300} color={C.coral} at={0.3} />,
  ], { hold: "sign", holdY: 780, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 1, x: 540, y: 780, z: 1.04 }] }),
  // 5. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 200, fs: 36, title: "WRITE THIS · 2 MARKS", points: [
      "throw raises one exception object, inside the method body.",
      "throws declares, in the method signature, the exceptions it may pass to the caller." ],
      times: [r("throw"), r("throws")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 6. memory trick + payoff
  S("remember", (r, d) => [
    <Head dur={d} text="throw = action" y={190} size={140} sub="throws = sign" />,
    <Ico dur={d} ctx={ctx} name="siren" x={330} y={700} size={230} color={C.coral} at={r("action") - 0.4} />,
    <Ico dur={d} ctx={ctx} name="triangle-alert" x={750} y={700} size={230} color={C.cobalt} at={r("sign") - 0.3} />,
    <Mascot dur={d} size={200} tag="main" pts={[{ t: 0, x: 540, y: 1060, look: [0, -1] }, { t: r("two"), x: 540, y: 1060, look: [0, 0], mood: "happy" }]} />,
    ...Sketch({ dur: d, at: r("two"), items: [{ text: "2 marks", x: 540, y: 1200, size: 120, w: 900 }] }),
    <Check dur={d} x={540} y={1400} size={110} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "sign", x: 540, y: 880, z: 1.02 }] }),
];
