import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "What is the use of the finally block in exception handling?", n: 4, marks: 2, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "finally", x: 540, y: 780, z: 1.06 }] }),
  // 2a. an exception = an error while the program runs
  S("let's start", (r, d) => [
    <Head dur={d} text="exception" y={190} size={170} sub="an error while running" />,
    <Box dur={d} x={380} y={620} w={560} h={120} label="x = 5;" at={r("error")} />,
    <Box dur={d} x={380} y={790} w={560} h={120} label="y = x / 0;" tone="hot" at={r("error") + 0.3} />,
    <Box dur={d} x={380} y={960} w={560} h={120} label="print(y);" at={r("error") + 0.6} />,
    <Mascot dur={d} size={190} tag="main" pts={[{ t: 0, x: 860, y: 620, look: [-1, 0] }, { t: r("runs"), x: 860, y: 620, look: [-1, 1] }, { t: r("dividing") - 0.2, x: 860, y: 790, look: [-1, 0] }, { t: r("dividing"), x: 860, y: 790, look: [-1, 0], mood: "shock" }]} />,
    <XMark dur={d} x={380} y={790} size={100} at={r("dividing") + 0.7} />,
  ], { hold: "dividing", holdY: 860, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "runs", x: 560, y: 800, z: 1.04 }] }),
  // 2b. try the risky code, catch the error
  S("java lets", (r, d) => [
    <Head dur={d} text="try / catch" y={190} size={160} />,
    <Box dur={d} x={540} y={640} w={760} h={150} label="try { risky code }" at={r("try")} />,
    <Arrow dur={d} x1={540} y1={725} x2={540} y2={795} color={C.coral} width={9} at={r("error")} />,
    <Box dur={d} x={540} y={880} w={760} h={150} label="catch { handle error }" tone="b" at={r("catch")} />,
    ...Sketch({ dur: d, at: r("happens"), items: [{ text: "only if it happens", x: 540, y: 1040, size: 52, w: 900, color: C.coral }] }),
  ], { hold: "happens", holdY: 800, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "catch", x: 540, y: 800, z: 1.04 }] }),
  // 2c. analogy: borrowing a library book
  S("now think", (r, d) => [
    <Head dur={d} text="library book" y={190} size={150} />,
    <Ico dur={d} ctx={ctx} name="book-open" x={540} y={560} size={200} at={r("book") - 0.5} />,
    <Arrow dur={d} x1={470} y1={670} x2={330} y2={780} color={C.coral} width={8} at={r("good")} />,
    <Box dur={d} x={300} y={860} w={400} h={120} label="good read" at={r("good")} />,
    <Arrow dur={d} x1={610} y1={670} x2={750} y2={780} color={C.coral} width={8} at={r("bad")} />,
    <Box dur={d} x={780} y={860} w={400} h={120} label="bad read" at={r("bad")} />,
    <Arrow dur={d} x1={330} y1={930} x2={450} y2={1080} color={C.coral} width={8} at={r("return")} />,
    <Arrow dur={d} x1={750} y1={930} x2={630} y2={1080} color={C.coral} width={8} at={r("return")} />,
    <Box dur={d} x={540} y={1170} w={760} h={120} label="return the book" tone="hot" at={r("return") + 0.2} />,
  ], { hold: "end", holdY: 850, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "good", x: 540, y: 840, z: 1.03 }, { t: "return", x: 540, y: 960, z: 1.03 }] }),
  // 3. that is finally + what the question wants
  S("that is finally", (r, d) => [
    <Head dur={d} text="finally" y={190} size={200} sub="= return the book" />,
    ...Sketch({ dur: d, at: r("question"), items: [
      { text: "the question wants:", x: 540, y: 700, size: 64, w: 960 },
      { text: "1.  what it is", x: 150, y: 860, size: 58, w: 800, align: "left", at: r("what") },
      { text: "2.  when it runs", x: 150, y: 1000, size: 58, w: 800, align: "left", at: r("when") } ] }),
    <Check dur={d} x={95} y={890} size={80} at={r("what") + 0.9} />,
    <Check dur={d} x={95} y={1030} size={80} at={r("when") + 0.9} />,
  ], { cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "question", x: 540, y: 860, z: 1.03 }] }),
  // 4a. finally sits after try and catch
  S("the finally block sits", (r, d) => [
    <Head dur={d} text="finally sits last" y={190} size={140} />,
    <Box dur={d} x={540} y={620} w={560} h={120} label="try" at={r("after")} />,
    <Arrow dur={d} x1={540} y1={690} x2={540} y2={745} color={C.coral} width={8} at={r("try") + 0.2} />,
    <Box dur={d} x={540} y={810} w={560} h={120} label="catch" tone="b" at={r("catch") - 0.4} />,
    <Arrow dur={d} x1={540} y1={880} x2={540} y2={935} color={C.coral} width={8} at={r("catch") + 0.2} />,
    <Box dur={d} x={540} y={1000} w={560} h={120} label="finally" tone="hot" at={r("catch") + 0.3} />,
  ], { hold: "catch", holdY: 820, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "try", x: 540, y: 820, z: 1.03 }] }),
  // 4b. it runs always: three cases
  S("it runs always", (r, d) => [
    <Head dur={d} text="ALWAYS" y={190} size={190} />,
    <Box dur={d} x={290} y={620} w={420} h={120} label="no error" at={r("error") - 0.4} />,
    <Arrow dur={d} x1={505} y1={620} x2={615} y2={620} color={C.coral} width={8} at={r("error") + 0.2} />,
    <Box dur={d} x={830} y={620} w={380} h={120} label="finally runs" tone="hot" at={r("error") + 0.4} />,
    <Box dur={d} x={290} y={820} w={420} h={120} label="error caught" tone="b" at={r("caught") - 0.4} />,
    <Arrow dur={d} x1={505} y1={820} x2={615} y2={820} color={C.coral} width={8} at={r("caught") + 0.2} />,
    <Box dur={d} x={830} y={820} w={380} h={120} label="finally runs" tone="hot" at={r("caught") + 0.4} />,
    <Box dur={d} x={290} y={1020} w={420} h={120} label="try has return" at={r("return") - 0.4} />,
    <Arrow dur={d} x1={505} y1={1020} x2={615} y2={1020} color={C.coral} width={8} at={r("return") + 0.2} />,
    <Box dur={d} x={830} y={1020} w={380} h={120} label="finally runs" tone="hot" at={r("return") + 0.4} />,
  ], { hold: "return", holdY: 860, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "caught", x: 540, y: 820, z: 1.03 }, { t: "return", x: 540, y: 900, z: 1.03 }] }),
  // 4c. recap
  S("so finally is", (r, d) => [
    <Head dur={d} text="finally" y={190} size={190} />,
    ...Sketch({ dur: d, at: 0.3, items: [{ text: "finally is the code", x: 540, y: 520, size: 60, w: 960 }, { text: "that always runs", x: 540, y: 700, size: 90, w: 980, color: C.coral, at: r("always") - 0.3 }] }),
    <Check dur={d} x={540} y={1000} size={240} at={r("runs")} />,
  ], { hold: "runs", holdY: 860, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "always", x: 540, y: 820, z: 1.05 }] }),
  // 5. its use: cleanup
  S("its use is", (r, d) => [
    <Head dur={d} text="cleanup" y={190} size={170} />,
    <Box dur={d} x={540} y={1000} w={600} h={130} label="close()" tone="hot" at={r("closing")} />,
    <Ico dur={d} ctx={ctx} name="file-text" x={300} y={660} size={180} at={r("files")} />,
    <Arrow dur={d} x1={420} y1={930} x2={330} y2={770} color={C.coral} width={8} at={r("files") + 0.2} />,
    <Ico dur={d} ctx={ctx} name="database" x={780} y={660} size={180} at={r("connections")} />,
    <Arrow dur={d} x1={660} y1={930} x2={750} y2={770} color={C.coral} width={8} at={r("connections") + 0.2} />,
    ...Sketch({ dur: d, at: r("nothing"), items: [{ text: "nothing left open", x: 540, y: 1180, size: 54, w: 900, color: C.coral }] }),
    <Check dur={d} x={540} y={1390} size={140} at={r("open")} />,
  ], { hold: "left", holdY: 900, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "files", x: 540, y: 860, z: 1.03 }, { t: "nothing", x: 540, y: 1000, z: 1.03 }] }),
  // 6. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 200, fs: 36, title: "WRITE THIS · 2 MARKS", points: [
      "The finally block runs whether or not an exception occurs.",
      "It is used to release resources like files and connections." ],
      times: [r("finally"), r("release")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 7. memory trick + payoff
  S("remember", (r, d) => [
    <Head dur={d} text="return the book" y={190} size={150} />,
    <Ico dur={d} ctx={ctx} name="book-open" x={540} y={760} size={300} at={r("returning") - 0.3} />,
    <Mascot dur={d} size={220} tag="finally" pts={[{ t: 0, x: 540, y: 1080, look: [0, -1] }, { t: r("two"), x: 540, y: 1080, look: [0, 0], mood: "happy" }]} />,
    ...Sketch({ dur: d, at: r("two"), items: [{ text: "2 marks", x: 540, y: 1200, size: 120, w: 900 }] }),
    <Check dur={d} x={540} y={1400} size={110} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "returning", x: 540, y: 900, z: 1.02 }] }),
];
