import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  // hand-drawn folder: tab (with its name inside) + body
  const folder = (d, x, y, w, h, name, at, tabW = 240, color) => Sketch({ dur: d, at, speed: 3600, color, items: [{ rect: [x, y - 56, tabW, 56], label: name, size: 34, tone: color ? "hot" : undefined }, { rect: [x, y, w, h] }] });
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Name the default package imported in every Java program.", n: 7, marks: 2, y: 560 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "default", x: 540, y: 780, z: 1.06 }] }),
    // 2a. from zero: a huge toolbox of classes sorted into folders called packages
    S("let's start", (r, d) => [
      <Head dur={d} text="toolbox" y={190} size={170} sub="ready-made classes" />,
      <Ico dur={d} ctx={ctx} name="wrench" x={540} y={620} size={180} color={C.coral} at={r("toolbox")} />,
      ...folder(d, 60, 900, 280, 260, "java.util", r("sorted")),
      ...folder(d, 400, 900, 280, 260, "java.io", r("sorted") + 0.9),
      ...folder(d, 740, 900, 280, 260, "java.net", r("sorted") + 1.8),
      ...Sketch({ dur: d, at: r("packages"), items: [{ text: "packages", x: 540, y: 1230, size: 64, w: 900, color: C.coral }] }),
    ], { hold: "packages", holdY: 860, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "sorted", x: 540, y: 880, z: 1.03 }] }),
    // 2b. to use a class from a folder you write an import line
    S("to use a class", (r, d) => [
      <Head dur={d} text="import" y={190} size={170} sub="the line you write first" />,
      ...folder(d, 330, 880, 420, 280, "java.util", r("class")),
      <Label dur={d} text="import java.util.Scanner;" x={540} y={600} w={1000} size={44} font={C.fMono} color={C.coral} at={r("import")} />,
      <Arrow dur={d} x1={540} y1={680} x2={540} y2={810} color={C.coral} width={9} at={r("line") + 0.2} />,
    ], { hold: "first", holdY: 860, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "import", x: 540, y: 820, z: 1.03 }] }),
    // 2c. some tools are so basic that Java keeps them on the table
    S("but some tools", (r, d) => [
      <Head dur={d} text="always at hand" y={190} size={150} />,
      ...Sketch({ dur: d, at: r("some"), speed: 3400, items: [{ line: [160, 900, 920, 900] }, { line: [220, 900, 220, 1100] }, { line: [860, 900, 860, 1100] }] }),
      <Ico dur={d} ctx={ctx} name="wrench" x={300} y={790} size={150} at={r("tools")} />,
      <Ico dur={d} ctx={ctx} name="hammer" x={540} y={790} size={150} color={C.cobalt} at={r("tools") + 0.25} />,
      <Ico dur={d} ctx={ctx} name="ruler" x={780} y={790} size={150} at={r("tools") + 0.5} />,
      ...Sketch({ dur: d, at: r("table"), items: [{ text: "already on the table", x: 540, y: 1230, size: 54, w: 980, color: C.coral }] }),
    ], { hold: "already", holdY: 860, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "tools", x: 540, y: 880, z: 1.03 }] }),
    // 3. what the question wants
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 560, size: 72, w: 960 },
        { text: "one name", x: 540, y: 780, size: 110, w: 900, color: C.coral, at: r("one") } ] }),
    ]),
    // 4a. the answer: java.lang, imported automatically
    S("it is java", (r, d) => [
      <Head dur={d} text="java.lang" y={190} size={200} />,
      ...folder(d, 300, 620, 480, 300, "java.lang", 0.3, 260, C.coral),
      <Box dur={d} x={540} y={1130} w={560} h={110} label="every program" at={r("program")} />,
      <Arrow dur={d} x1={540} y1={935} x2={540} y2={1065} color={C.coral} width={9} at={r("imports")} />,
      <Label dur={d} text="import java.lang.*;" x={540} y={1290} w={900} size={46} font={C.fMono} at={r("no") + 0.3} />,
      <XMark dur={d} x={540} y={1325} size={120} at={r("line")} />,
    ], { hold: "line", holdY: 880, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "program", x: 540, y: 900, z: 1.03 }] }),
    // 4b. it holds the basics
    S("it holds the", (r, d) => [
      <Head dur={d} text="the basics" y={190} size={170} />,
      ...folder(d, 100, 600, 880, 500, "java.lang", 0.3, 260, C.coral),
      <Box dur={d} x={300} y={810} w={360} h={110} label="String" at={r("string")} />,
      <Box dur={d} x={780} y={810} w={360} h={110} label="Math" at={r("math")} />,
      <Box dur={d} x={300} y={970} w={360} h={110} label="System" at={r("system")} />,
      <Box dur={d} x={780} y={970} w={360} h={110} label="Object" at={r("object")} />,
    ], { hold: "object", holdY: 880, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "system", x: 540, y: 860, z: 1.03 }] }),
    // 5. why System.out.println works without an import
    S("so that is why", (r, d) => [
      <Head dur={d} text="why it works" y={190} size={150} />,
      <Label dur={d} text="System.out.println(x);" x={540} y={560} w={1000} size={46} font={C.fMono} color={C.coral} at={r("system")} />,
      <Arrow dur={d} x1={540} y1={640} x2={540} y2={745} color={C.coral} width={9} at={r("works")} />,
      <Box dur={d} x={540} y={830} w={520} h={130} label="java.lang" sub="System lives here" tone="b" at={r("works") + 0.2} />,
      ...Sketch({ dur: d, at: r("without"), items: [{ text: "no import line needed", x: 540, y: 1060, size: 54, w: 980 }] }),
      <Check dur={d} x={540} y={1280} size={150} at={r("import")} />,
    ], { hold: "import", holdY: 880, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "works", x: 540, y: 860, z: 1.03 }] }),
    // 6. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 200, fs: 36, title: "WRITE THIS · 2 MARKS", points: [
        "java.lang is imported by default in every Java program.",
        "It contains core classes: String, System, Math and Object." ],
        times: [r("java"), r("contains")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 7. memory trick + payoff
    S("remember", (r, d) => [
      <Head dur={d} text="lang = language" y={190} size={140} />,
      <Ico dur={d} ctx={ctx} name="languages" x={540} y={700} size={280} color={C.coral} at={r("language") - 0.5} />,
      <Mascot dur={d} size={200} tag="Main" pts={[{ t: 0, x: 540, y: 1060, look: [0, -1] }, { t: r("two"), x: 540, y: 1060, look: [0, 0], mood: "happy" }]} />,
      ...Sketch({ dur: d, at: r("two"), items: [{ text: "2 marks", x: 540, y: 1200, size: 120, w: 900 }] }),
      <Check dur={d} x={540} y={1400} size={110} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "language", x: 540, y: 880, z: 1.02 }] }),
  ];
};
