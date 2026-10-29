import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "What happens to a thread when sleep() is called on it?", n: 10, marks: 2, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "sleep", x: 540, y: 780, z: 1.06 }] }),
  // 2a. from zero: a thread is one path of work in a program
  S("let's start", (r, d) => [
    <Head dur={d} text="thread" y={190} size={180} sub="one path of work" />,
    ...Sketch({ dur: d, at: r("path"), speed: 3400, items: [{ rect: [100, 520, 880, 420], divider: [90], label: "program", size: 44 }] }),
    ...Sketch({ dur: d, at: r("work"), items: [{ line: [170, 780, 910, 780], arrow: true, color: C.coral }] }),
    <Mascot dur={d} on size={150} tag="T1" at={r("work")} pts={[{ t: 0, x: 200, y: 700, look: [1, 0] }, { t: r("work"), x: 200, y: 700, look: [1, 0] }, { t: d - 0.2, x: 850, y: 700, look: [1, 0], mood: "happy" }]} />,
  ], { hold: "program", holdY: 800, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "work", x: 540, y: 740, z: 1.03 }] }),
  // 2b. a thread is always in some state: running or waiting
  S("at any moment", (r, d) => [
    <Head dur={d} text="state" y={190} size={170} sub="what it is doing now" />,
    <Box dur={d} x={300} y={720} w={420} h={130} label="running" tone="hot" at={r("running")} />,
    <Box dur={d} x={780} y={720} w={420} h={130} label="waiting" at={r("waiting")} />,
    <Mascot dur={d} size={200} tag="T1" pts={[{ t: 0, x: 300, y: 960, look: [0, -1] }, { t: r("waiting") - 0.3, x: 300, y: 960, look: [0, -1] }, { t: r("waiting") + 0.5, x: 780, y: 960, look: [0, -1], mood: "think" }]} />,
  ], { hold: "waiting", holdY: 860, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "running", x: 540, y: 820, z: 1.03 }] }),
  // 2c. analogy: sleep() tells the cook to stop for ten seconds
  S("think of a cook", (r, d) => [
    <Head dur={d} text="sleep()" y={190} size={190} />,
    <Mascot dur={d} size={220} tag="cook" at={r("cook")} pts={[{ t: r("cook"), x: 330, y: 850, look: [0, 1] }, { t: r("calling"), x: 330, y: 810, look: [0, 1] }, { t: r("calling") + 0.5, x: 330, y: 870, look: [0, 1] }, { t: r("stop") - 0.1, x: 330, y: 850, look: [1, 0] }, { t: r("stop"), x: 330, y: 850, look: [1, 0], mood: "think" }, { t: d - 0.1, x: 330, y: 850, look: [1, 0], mood: "think" }]} />,
    <Ico dur={d} ctx={ctx} name="cooking-pot" x={330} y={1100} size={140} at={r("kitchen")} />,
    <Label dur={d} text="t.sleep(10000);" x={540} y={470} w={900} size={52} font={C.fMono} color={C.coral} at={r("calling")} />,
    <Ico dur={d} ctx={ctx} name="hourglass" x={780} y={800} size={180} at={r("stop")} />,
    ...Sketch({ dur: d, at: r("seconds") - 0.4, items: [{ text: "10 seconds", x: 780, y: 940, size: 46, w: 380, color: C.coral }] }),
  ], { hold: "seconds", holdY: 860, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "calling", x: 540, y: 850, z: 1.03 }] }),
  // 3. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 72, w: 960 },
      { text: "1.  which state?", x: 130, y: 720, size: 58, w: 860, align: "left", at: r("state") },
      { text: "2.  what happens after?", x: 130, y: 880, size: 58, w: 860, align: "left", at: r("happens") } ] }),
    <Check dur={d} x={80} y={755} size={80} at={r("state") + 0.9} />,
    <Check dur={d} x={80} y={915} size={80} at={r("after") + 0.4} />,
  ]),
  // 4a. first: it stops running and enters timed waiting; uses no CPU
  S("first, the thread", (r, d) => [
    <Head dur={d} text="1 · stops" y={190} size={150} />,
    <Box dur={d} x={430} y={620} w={520} h={120} label="running" at={r("running")} />,
    <Arrow dur={d} x1={430} y1={690} x2={430} y2={810} color={C.coral} width={9} at={r("enters")} />,
    <Box dur={d} x={430} y={900} w={640} h={130} label="TIMED_WAITING" tone="hot" at={r("timed")} />,
    <Mascot dur={d} size={170} tag="T1" pts={[{ t: 0, x: 900, y: 620, look: [-1, 0] }, { t: r("enters"), x: 900, y: 620, look: [-1, 0] }, { t: r("timed") + 0.6, x: 900, y: 900, look: [-1, 0], mood: "think" }]} />,
    <Ico dur={d} ctx={ctx} name="cpu" x={540} y={1160} size={150} at={r("cpu") - 0.6} />,
    <XMark dur={d} x={540} y={1160} size={110} at={r("cpu")} />,
    ...Sketch({ dur: d, at: r("cpu") - 0.2, items: [{ text: "no CPU used", x: 540, y: 1300, size: 52, w: 900, color: C.coral }] }),
  ], { hold: "cpu", holdY: 900, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "timed", x: 540, y: 880, z: 1.03 }] }),
  // 4b. second: it keeps its locks
  S("second, it keeps", (r, d) => [
    <Head dur={d} text="2 · keeps locks" y={190} size={150} />,
    <Mascot dur={d} size={220} tag="T1" pts={[{ t: 0, x: 330, y: 780, look: [1, 0], mood: "think" }, { t: d - 0.1, x: 330, y: 780, look: [1, 0], mood: "think" }]} />,
    <Ico dur={d} ctx={ctx} name="lock" x={760} y={780} size={220} color={C.coral} at={r("locks")} />,
    <Arrow dur={d} x1={450} y1={780} x2={640} y2={780} color={C.coral} width={9} at={r("holds") - 0.4} />,
    ...Sketch({ dur: d, at: r("holds"), items: [{ text: "still holds its lock", x: 540, y: 1040, size: 56, w: 980 }] }),
  ], { hold: "holds", holdY: 860, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "locks", x: 540, y: 840, z: 1.03 }] }),
  // 5. third: time over, it does not run at once; it goes to runnable and waits for the CPU
  S("third, when", (r, d) => [
    <Head dur={d} text="3 · time over" y={190} size={140} sub="it does not run instantly" />,
    <Box dur={d} x={540} y={620} w={640} h={120} label="TIMED_WAITING" at={0.3} />,
    <Arrow dur={d} x1={540} y1={685} x2={540} y2={810} color={C.coral} width={9} at={r("returns")} />,
    <Box dur={d} x={540} y={900} w={560} h={120} label="RUNNABLE" tone="hot" at={r("runnable")} />,
    ...Sketch({ dur: d, at: r("waits"), items: [{ text: "waits for the CPU", x: 540, y: 1010, size: 52, w: 980, color: C.coral }] }),
    <Arrow dur={d} x1={540} y1={1090} x2={540} y2={1185} color={C.coral} width={9} at={r("cpu")} />,
    <Box dur={d} x={540} y={1270} w={500} h={120} label="RUNNING" at={r("cpu") + 0.2} />,
  ], { hold: "cpu", holdY: 900, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "runnable", x: 540, y: 940, z: 1.03 }] }),
  // 6. recap: a nap with the door still locked
  S("so, a nap", (r, d) => [
    <Head dur={d} text="sleep()" y={190} size={170} sub="a nap, door locked" />,
    <Ico dur={d} ctx={ctx} name="bed" x={330} y={780} size={240} at={r("nap") - 0.2} />,
    <Ico dur={d} ctx={ctx} name="lock" x={760} y={780} size={240} color={C.coral} at={r("door")} />,
  ], { hold: "door", holdY: 800, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "nap", x: 540, y: 800, z: 1.03 }] }),
  // 7. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 200, fs: 36, title: "WRITE THIS · 2 MARKS", points: [
      "sleep() pauses the current thread for the given milliseconds.",
      "The thread moves to timed waiting and keeps its locks.",
      "After the time it returns to the runnable state." ],
      times: [r("sleep"), r("moves"), r("returns")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 8. memory trick + payoff
  S("remember", (r, d) => [
    <Head dur={d} text="sleep = nap" y={190} size={150} sub="door locked" />,
    <Ico dur={d} ctx={ctx} name="bed" x={360} y={700} size={230} at={r("nap") - 0.4} />,
    <Ico dur={d} ctx={ctx} name="lock" x={720} y={700} size={230} color={C.coral} at={r("door") - 0.3} />,
    <Mascot dur={d} size={200} tag="T1" pts={[{ t: 0, x: 540, y: 1060, look: [0, -1] }, { t: r("two"), x: 540, y: 1060, look: [0, 0], mood: "happy" }]} />,
    ...Sketch({ dur: d, at: r("two"), items: [{ text: "2 marks", x: 540, y: 1200, size: 120, w: 900 }] }),
    <Check dur={d} x={540} y={1400} size={110} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "door", x: 540, y: 880, z: 1.02 }] }),
];
