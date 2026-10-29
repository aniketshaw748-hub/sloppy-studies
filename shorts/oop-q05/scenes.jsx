import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Name the method used to start the execution of a thread.", n: 5, marks: 2, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "thread", x: 540, y: 780, z: 1.06 }] }),
  // 2a. from zero: a thread is one path of work inside the program
  S("let's start", (r, d) => [
    <Head dur={d} text="thread" y={190} size={180} sub="one path of work" />,
    ...Sketch({ dur: d, at: r("thread"), speed: 3400, items: [{ rect: [100, 520, 880, 420], divider: [90], label: "program", size: 44 }] }),
    ...Sketch({ dur: d, at: r("path"), items: [{ line: [170, 780, 910, 780], arrow: true, color: C.coral }] }),
    <Mascot dur={d} on size={150} tag="T1" at={r("work")} pts={[{ t: 0, x: 200, y: 700, look: [1, 0] }, { t: r("work"), x: 200, y: 700, look: [1, 0] }, { t: d - 0.2, x: 850, y: 700, look: [1, 0], mood: "happy" }]} />,
  ], { hold: "program", holdY: 800, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "path", x: 540, y: 740, z: 1.03 }] }),
  // 2b. analogy: a kitchen, each cook is a thread
  S("think of a kitchen", (r, d) => [
    <Head dur={d} text="kitchen" y={190} size={170} />,
    <Mascot dur={d} size={220} tag="T1" at={r("cook")} pts={[{ t: r("cook"), x: 300, y: 760, look: [0, 1] }, { t: r("chops"), x: 300, y: 720, look: [0, 1] }, { t: r("chops") + 0.5, x: 300, y: 780, look: [0, 1] }, { t: r("stirs"), x: 300, y: 730, look: [0, 1], mood: "happy" }, { t: d - 0.1, x: 300, y: 760, look: [0, 1], mood: "happy" }]} />,
    <Ico dur={d} ctx={ctx} name="utensils" x={300} y={1000} size={150} at={r("chops")} />,
    <Mascot dur={d} size={220} tag="T2" at={r("another")} pts={[{ t: r("another"), x: 780, y: 760, look: [0, 1] }, { t: r("stirs"), x: 780, y: 730, look: [0, 1] }, { t: r("stirs") + 0.5, x: 780, y: 790, look: [0, 1] }, { t: d - 0.1, x: 780, y: 760, look: [0, 1], mood: "happy" }]} />,
    <Ico dur={d} ctx={ctx} name="cooking-pot" x={780} y={1000} size={150} at={r("stirs")} />,
    ...Sketch({ dur: d, at: r("each"), items: [{ text: "each cook = a thread", x: 540, y: 1220, size: 56, w: 980, color: C.coral }] }),
  ], { hold: "thread", holdY: 860, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "another", x: 540, y: 860, z: 1.03 }] }),
  // 3. creating a Thread object does not start it
  S("in java you", (r, d) => [
    <Head dur={d} text="Thread object" y={190} size={150} />,
    <Label dur={d} text="Thread t = new Thread();" x={540} y={470} w={1000} size={46} font={C.fMono} at={r("create")} />,
    ...Sketch({ dur: d, at: r("object"), speed: 3400, items: [{ rect: [160, 580, 760, 300], divider: [90], label: "Thread t", size: 44 }] }),
    ...Sketch({ dur: d, at: r("run"), items: [{ text: "void run() { work }", x: 210, y: 720, size: 46, w: 680, align: "left", color: C.coral }] }),
    <Mascot dur={d} size={220} tag="t" at={r("but")} pts={[{ t: r("but"), x: 540, y: 1100, look: [0, 0], mood: "think" }, { t: d - 0.1, x: 540, y: 1100, look: [0, 0], mood: "think" }]} />,
    ...Sketch({ dur: d, at: r("creating"), items: [{ text: "created, but not running", x: 540, y: 1290, size: 52, w: 980, color: C.coral }] }),
  ], { hold: "cooking", holdY: 860, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "run", x: 540, y: 800, z: 1.03 }, { t: "but", x: 540, y: 960, z: 1.03 }] }),
  // 4. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 72, w: 960 },
      { text: "one name", x: 540, y: 700, size: 100, w: 900, color: C.coral, at: r("one") },
      { text: "the method that says GO", x: 540, y: 880, size: 54, w: 980, at: r("says") } ] }),
    <Ico dur={d} ctx={ctx} name="play" x={540} y={1200} size={220} color={C.coral} at={r("go")} />,
  ]),
  // 5. start(): the JVM makes a new path and calls run
  S("it is start", (r, d) => [
    <Head dur={d} text="start()" y={190} size={190} />,
    <Label dur={d} text="t.start();" x={540} y={470} w={800} size={60} font={C.fMono} color={C.coral} at={r("calling")} />,
    <Arrow dur={d} x1={540} y1={560} x2={540} y2={665} color={C.coral} width={9} at={r("asks")} />,
    <Box dur={d} x={540} y={750} w={460} h={120} label="JVM" tone="b" at={r("jvm")} />,
    <Arrow dur={d} x1={450} y1={820} x2={310} y2={975} color={C.coral} width={9} at={r("make")} />,
    <Mascot dur={d} size={190} tag="t" at={r("path")} pts={[{ t: r("path"), x: 290, y: 1090, look: [1, 0], mood: "happy" }, { t: d - 0.1, x: 290, y: 1090, look: [1, 0], mood: "happy" }]} />,
    <Arrow dur={d} x1={630} y1={820} x2={770} y2={975} color={C.coral} width={9} at={r("calls")} />,
    <Box dur={d} x={790} y={1090} w={340} h={120} label="run()" tone="hot" at={r("calls") + 0.2} />,
    <Ico dur={d} ctx={ctx} name="play" x={540} y={1370} size={150} color={C.coral} at={r("go")} />,
  ], { hold: "button", holdY: 860, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "make", x: 540, y: 900, z: 1.03 }] }),
  // 6. the trap: calling run() directly
  S("the trap", (r, d) => [
    <Head dur={d} text="the trap" y={190} size={170} />,
    <Label dur={d} text="t.run();" x={540} y={470} w={800} size={60} font={C.fMono} at={r("calling")} />,
    <Arrow dur={d} x1={540} y1={560} x2={540} y2={700} color={C.coral} width={9} at={r("run")} />,
    <Mascot dur={d} size={200} tag="main" at={r("runs")} pts={[{ t: r("runs"), x: 540, y: 820, look: [0, -1] }, { t: d - 0.1, x: 540, y: 820, look: [0, -1] }]} />,
    ...Sketch({ dur: d, at: r("same"), items: [{ text: "same thread", x: 540, y: 970, size: 56, w: 900, color: C.coral }] }),
    <XMark dur={d} x={540} y={1150} size={110} at={r("no")} />,
    ...Sketch({ dur: d, at: r("no") + 0.3, items: [{ text: "no new cook", x: 540, y: 1250, size: 60, w: 900 }] }),
  ], { hold: "new", holdY: 860, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "runs", x: 540, y: 860, z: 1.03 }] }),
  // 7. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 200, fs: 36, title: "WRITE THIS · 2 MARKS", points: [
      "The answer is the start() method of the Thread class.",
      "It begins a new thread, and the JVM calls run()." ],
      times: [r("start"), r("begins")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 8. memory trick + payoff
  S("remember", (r, d) => [
    <Head dur={d} text="run = recipe" y={190} size={150} sub="start = button" />,
    <Ico dur={d} ctx={ctx} name="scroll-text" x={320} y={700} size={220} color={C.cobalt} at={r("recipe") - 0.3} />,
    <Ico dur={d} ctx={ctx} name="play" x={760} y={700} size={220} color={C.coral} at={r("button") - 0.3} />,
    <Mascot dur={d} size={200} tag="t" pts={[{ t: 0, x: 540, y: 1060, look: [0, -1] }, { t: r("two"), x: 540, y: 1060, look: [0, 0], mood: "happy" }]} />,
    ...Sketch({ dur: d, at: r("two"), items: [{ text: "2 marks", x: 540, y: 1200, size: 120, w: 900 }] }),
    <Check dur={d} x={540} y={1400} size={110} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "button", x: 540, y: 880, z: 1.02 }] }),
];
