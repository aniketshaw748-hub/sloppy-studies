import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Can an interface contain a constructor? Justify.", n: 3, marks: 2, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "constructor", x: 540, y: 780, z: 1.06 }] }),
  // 2a. from zero: a constructor builds an object and fills its fields
  S("let's start", (r, d) => [
    <Head dur={d} text="constructor" y={190} size={150} sub="runs once, when an object is made" />,
    ...Sketch({ dur: d, at: r("constructor"), speed: 3600, items: [{ rect: [60, 540, 320, 210], label: "class Car", size: 40 }] }),
    <Box dur={d} x={610} y={645} w={300} h={120} label="constructor" tone="hot" at={r("special")} />,
    <Arrow dur={d} x1={385} y1={645} x2={455} y2={645} color={C.coral} width={8} at={r("runs")} />,
    <Arrow dur={d} x1={765} y1={645} x2={825} y2={645} color={C.coral} width={8} at={r("created")} />,
    <Mascot dur={d} size={190} tag="Car" at={r("created")} pts={[{ t: r("created"), x: 925, y: 645, look: [0, 1], mood: "happy" }, { t: d - 0.1, x: 925, y: 645, look: [0, 1], mood: "happy" }]} />,
    ...Sketch({ dur: d, at: r("fill"), items: [{ text: "its fields:", x: 540, y: 820, size: 44, w: 700, color: C.coral }] }),
    <Box dur={d} x={300} y={960} w={440} h={110} label="color = red" at={r("fields") - 0.3} />,
    <Box dur={d} x={780} y={960} w={440} h={110} label="seats = 4" at={r("fields")} />,
  ], { hold: "fields", holdY: 800, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "created", x: 540, y: 740, z: 1.03 }] }),
  // 2b. analogy: a car factory's assembly line
  S("think of a car", (r, d) => [
    <Head dur={d} text="assembly line" y={190} size={140} />,
    <Ico dur={d} ctx={ctx} name="factory" x={540} y={720} size={330} at={0.15} />,
    ...Sketch({ dur: d, at: 0.5, items: [{ line: [100, 1120, 980, 1120] }] }),
    <Mascot dur={d} size={190} tag="Car" pts={[{ t: 0, x: 200, y: 1010, look: [1, 0] }, { t: r("assembly"), x: 200, y: 1010, look: [1, 0] }, { t: d - 0.2, x: 880, y: 1010, look: [1, 0], mood: "happy" }]} />,
  ], { hold: "line", holdY: 850, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "assembly", x: 540, y: 880, z: 1.04 }] }),
  // 3a. an interface is only a contract: a list of method names
  S("an interface is", (r, d) => [
    <Head dur={d} text="interface" y={190} size={170} sub="only a contract" />,
    ...Sketch({ dur: d, at: 0.3, speed: 3400, items: [{ rect: [160, 500, 760, 520], divider: [100], label: "interface Vehicle", size: 44 }] }),
    ...Sketch({ dur: d, at: r("list"), items: [
      { text: "void start();", x: 210, y: 640, size: 46, w: 600, align: "left" },
      { text: "void stop();", x: 210, y: 740, size: 46, w: 600, align: "left" },
      { text: "void honk();", x: 210, y: 840, size: 46, w: 600, align: "left" } ] }),
    <Box dur={d} x={540} y={1210} w={420} h={120} label="class Car" tone="b" at={r("class")} />,
    <Arrow dur={d} x1={540} y1={1140} x2={540} y2={1045} color={C.coral} width={9} at={r("promises")} />,
    ...Sketch({ dur: d, at: r("promises"), items: [{ text: "promises to provide", x: 540, y: 1340, size: 44, w: 900, color: C.coral }] }),
  ], { hold: "provide", holdY: 900, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "list", x: 540, y: 820, z: 1.04 }] }),
  // 3b. analogy: a job advert is not a person
  S("think of a job", (r, d) => [
    <Head dur={d} text="job advert" y={190} size={150} />,
    ...Sketch({ dur: d, at: 0.3, speed: 3400, items: [{ rect: [100, 500, 440, 420], divider: [90], label: "WANTED", size: 40 }] }),
    ...Sketch({ dur: d, at: r("lists"), items: [{ text: "can cook", x: 140, y: 640, size: 40, w: 380, align: "left" }, { text: "can drive", x: 140, y: 730, size: 40, w: 380, align: "left" }] }),
    <Ico dur={d} ctx={ctx} name="user" x={810} y={700} size={240} at={r("not")} />,
    <XMark dur={d} x={810} y={700} size={170} at={r("person")} />,
    ...Sketch({ dur: d, at: r("person"), items: [{ text: "not a person", x: 810, y: 880, size: 44, w: 400, color: C.coral }] }),
  ], { hold: "person", holdY: 800, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "not", x: 540, y: 760, z: 1.03 }] }),
  // 4. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 72, w: 960 },
      { text: "1.  yes or no", x: 150, y: 720, size: 60, w: 800, align: "left", at: r("yes") },
      { text: "2.  the reason", x: 150, y: 880, size: 60, w: 800, align: "left", at: r("reason") } ] }),
    <Check dur={d} x={95} y={755} size={80} at={r("yes") + 1.0} />,
    <Check dur={d} x={95} y={915} size={80} at={r("reason") + 0.6} />,
  ]),
  // 5a. the answer: NO
  S("the answer is", (r, d) => [
    <Head dur={d} text="NO." y={420} size={420} />,
    <Ico dur={d} ctx={ctx} name="ban" x={540} y={1050} size={300} color={C.coral} at={0.4} />,
  ], { hold: "no", holdY: 800, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: 0.8, x: 540, y: 800, z: 1.05 }] }),
  // 5b. reason one: no object can be created, so nothing to build
  S("reason one", (r, d) => [
    <Head dur={d} text="reason 1" y={190} size={140} sub="no object, nothing to build" />,
    <Label dur={d} text="new Vehicle();" x={540} y={560} w={800} size={60} font={C.fMono} at={r("create")} />,
    <XMark dur={d} x={540} y={595} size={110} at={r("interface")} />,
    ...Sketch({ dur: d, at: r("nothing"), speed: 3000, items: [{ line: [340, 800, 740, 800], dashed: true }, { line: [740, 800, 740, 1060], dashed: true }, { line: [740, 1060, 340, 1060], dashed: true }, { line: [340, 1060, 340, 800], dashed: true }] }),
    ...Sketch({ dur: d, at: r("nothing") + 0.2, items: [{ text: "no object", x: 540, y: 900, size: 44, w: 360, color: C.coral }] }),
    <Box dur={d} x={540} y={1260} w={440} h={110} label="constructor" tone="hot" at={r("constructor")} />,
    <Arrow dur={d} x1={540} y1={1190} x2={540} y2={1080} color={C.coral} width={9} at={r("build")} />,
    <XMark dur={d} x={540} y={1135} size={70} at={r("build") + 0.4} />,
  ], { hold: "build", holdY: 880, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "interface", x: 540, y: 700, z: 1.04 }, { t: "nothing", x: 540, y: 960, z: 1.04 }] }),
  // 5c. reason two: no instance fields, only constants
  S("reason two", (r, d) => [
    <Head dur={d} text="reason 2" y={190} size={140} sub="no instance fields to set up" />,
    ...Sketch({ dur: d, at: 0.3, speed: 3400, items: [{ rect: [140, 540, 800, 420], divider: [100], label: "interface Vehicle", size: 44 }] }),
    ...Sketch({ dur: d, at: r("instance"), items: [{ text: "int speed;", x: 190, y: 660, size: 46, w: 500, align: "left" }] }),
    <XMark dur={d} x={330} y={695} size={80} at={r("fields")} />,
    ...Sketch({ dur: d, at: r("only"), items: [{ text: "static final int WHEELS = 4;", x: 190, y: 790, size: 40, w: 720, align: "left", color: C.coral }] }),
    ...Sketch({ dur: d, at: r("set"), items: [{ text: "no fields to set up", x: 540, y: 1100, size: 52, w: 900 }] }),
  ], { hold: "constants", holdY: 860, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "instance", x: 540, y: 780, z: 1.04 }] }),
  // 5d. recap: nothing to build, nothing to initialise
  S("so nothing", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "nothing to build", x: 540, y: 560, size: 70, w: 960 },
      { text: "nothing to initialise", x: 540, y: 740, size: 70, w: 960, color: C.coral, at: r("initialize") - 0.8 } ] }),
    <Ico dur={d} ctx={ctx} name="ban" x={540} y={1100} size={260} color={C.coral} at={r("initialize")} />,
  ], { hold: "initialize", holdY: 900, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: 1, x: 540, y: 850, z: 1.04 }] }),
  // 6. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 200, fs: 36, title: "WRITE THIS · 2 MARKS", points: [
      "No, an interface cannot have a constructor.",
      "It cannot be instantiated, so there is no object to construct.",
      "It has no instance variables to initialise, only constants." ],
      times: [r("no"), r("instantiated"), r("variables")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 7. memory trick + payoff
  S("remember", (r, d) => [
    <Head dur={d} text="no assembly line" y={190} size={130} />,
    <Ico dur={d} ctx={ctx} name="factory" x={380} y={780} size={260} at={0.2} />,
    <XMark dur={d} x={380} y={780} size={200} at={r("needs")} />,
    <Ico dur={d} ctx={ctx} name="scroll-text" x={700} y={780} size={260} color={C.cobalt} at={r("contract") - 0.3} />,
    <Mascot dur={d} size={220} tag="Vehicle" pts={[{ t: 0, x: 540, y: 1080, look: [0, -1] }, { t: r("two"), x: 540, y: 1080, look: [0, 0], mood: "happy" }]} />,
    ...Sketch({ dur: d, at: r("two"), items: [{ text: "2 marks", x: 540, y: 1200, size: 120, w: 900 }] }),
    <Check dur={d} x={540} y={1400} size={110} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "contract", x: 540, y: 900, z: 1.02 }] }),
];
