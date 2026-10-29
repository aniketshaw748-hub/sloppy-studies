import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  // a hand-drawn folder: tab + body (no label yet)
  const folder = (d, x, y, w, h, at, tabW = 240) => Sketch({ dur: d, at, speed: 3600, items: [{ rect: [x, y - 56, tabW, 56] }, { rect: [x, y, w, h] }] });
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "What is the purpose of the package keyword in Java?", n: 1, marks: 2, y: 560 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "keyword", x: 540, y: 780, z: 1.06 }] }),
    // 2. from zero: many classes, one giant drawer, nothing can be found
    S("let's start", (r, d) => [
      <Head dur={d} text="from zero" y={190} size={150} sub="a program is many classes" />,
      ...Sketch({ dur: d, at: r("program"), speed: 3600, items: [
        { rect: [80, 560, 260, 110], label: "Cart", size: 40 }, { rect: [410, 560, 260, 110], label: "Order", size: 40 }, { rect: [740, 560, 260, 110], label: "Bill", size: 40 },
        { rect: [80, 720, 260, 110], label: "Util", size: 40 }, { rect: [410, 720, 260, 110], label: "Student", size: 40 }, { rect: [740, 720, 260, 110], label: "Menu", size: 40 } ] }),
      ...Sketch({ dur: d, at: r("giant"), speed: 3600, items: [{ rect: [50, 500, 980, 370] }, { text: "one giant drawer", x: 540, y: 900, size: 54, w: 900, color: C.coral }] }),
      <Ico dur={d} ctx={ctx} name="search" x={540} y={1130} size={200} color={C.cobalt} at={r("nothing")} />,
      <XMark dur={d} x={540} y={1130} size={150} at={r("found")} />,
      ...Sketch({ dur: d, at: r("found"), items: [{ text: "nothing can be found", x: 540, y: 1300, size: 56, w: 940, color: C.coral }] }),
    ], { hold: "found", cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "many", x: 540, y: 760, z: 1.04 }, { t: "nothing", x: 540, y: 900, z: 1.04 }] }),
    // 3. the fix: a package is a named folder for classes
    S("the fix", (r, d) => [
      <Head dur={d} text="package" y={190} size={170} sub="= a named folder" />,
      ...folder(d, 200, 760, 680, 440, r("folders")),
      ...Sketch({ dur: d, at: r("named"), items: [{ text: "shop", x: 220, y: 704, size: 40, w: 200, align: "left", color: C.coral }] }),
      <Box dur={d} x={330} y={980} w={190} h={110} label="Cart" at={r("for")} />,
      <Box dur={d} x={540} y={980} w={190} h={110} label="Order" at={r("for") + 0.2} />,
      <Box dur={d} x={750} y={980} w={190} h={110} label="Bill" at={r("for") + 0.4} />,
    ], { hold: "classes", cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "named", x: 540, y: 900, z: 1.04 }] }),
    // 4. what the question wants
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 520, size: 72, w: 960 },
        { text: "1.  grouping", x: 150, y: 720, size: 60, w: 800, align: "left", at: r("grouping") },
        { text: "2.  no clashes", x: 150, y: 880, size: 60, w: 800, align: "left", at: r("no") } ] }),
      <Check dur={d} x={95} y={755} size={80} at={r("grouping") + 1.0} />,
      <Check dur={d} x={95} y={915} size={80} at={r("no") + 1.0} />,
    ]),
    // 5. idea 1: it groups. package shop; at the top of the file puts the class in the shop folder
    S("first, it", (r, d) => [
      <Head dur={d} text="1 · groups" y={190} size={140} />,
      ...Sketch({ dur: d, at: 0.3, speed: 3400, items: [{ rect: [140, 420, 800, 330] }, { text: "Cart.java", x: 540, y: 440, size: 40, w: 600 }] }),
      <Label dur={d} text="package shop;" x={190} y={520} w={700} align="left" size={54} font={C.fMono} color={C.coral} at={r("package")} />,
      <Label dur={d} text="class Cart { }" x={190} y={630} w={700} align="left" size={54} font={C.fMono} at={r("top")} />,
      ...folder(d, 220, 1040, 640, 400, r("puts")),
      <Arrow dur={d} x1={540} y1={760} x2={540} y2={975} color={C.coral} width={9} at={r("puts") + 1.0} />,
      ...Sketch({ dur: d, at: r("folder"), items: [{ text: "shop", x: 240, y: 984, size: 40, w: 200, align: "left", color: C.coral }] }),
      <Box dur={d} x={540} y={1210} w={180} h={100} label="Cart" at={r("folder") + 0.4} />,
      <Box dur={d} x={330} y={1210} w={180} h={100} label="Order" at={r("related")} />,
      <Box dur={d} x={750} y={1210} w={180} h={100} label="Bill" at={r("live")} />,
    ], { hold: "together", holdY: 900, cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "puts", x: 540, y: 980, z: 1.04 }] }),
    // 6. idea 2: it avoids clashes. same class name, different folder
    S("second", (r, d) => [
      <Head dur={d} text="2 · no clash" y={190} size={140} sub="same name, different folder" />,
      ...folder(d, 60, 640, 440, 330, r("shop"), 200),
      ...Sketch({ dur: d, at: r("student"), items: [{ text: "shop", x: 80, y: 584, size: 40, w: 180, align: "left", color: C.coral }] }),
      <Box dur={d} x={280} y={830} w={300} h={110} label="Student" at={r("student") + 0.3} />,
      ...folder(d, 580, 640, 440, 330, r("school"), 200),
      ...Sketch({ dur: d, at: r("school") + 0.9, items: [{ text: "school", x: 600, y: 584, size: 40, w: 180, align: "left", color: C.coral }] }),
      <Box dur={d} x={800} y={830} w={300} h={110} label="Student" tone="hot" at={r("school") + 1.3} />,
      <Arrow dur={d} x1={280} y1={900} x2={280} y2={1020} color={C.coral} width={8} at={r("full")} />,
      <Arrow dur={d} x1={800} y1={900} x2={800} y2={1020} color={C.coral} width={8} at={r("full")} />,
      <Label dur={d} text="shop.Student" x={280} y={1040} w={430} size={44} font={C.fMono} at={r("full") + 0.3} />,
      <Label dur={d} text="school.Student" x={800} y={1040} w={430} size={44} font={C.fMono} at={r("full") + 0.5} />,
      ...Sketch({ dur: d, at: r("different"), items: [{ text: "same name, different package", x: 540, y: 1220, size: 50, w: 980, color: C.coral }] }),
      <Check dur={d} x={540} y={1420} size={150} at={r("no") + 0.7} />,
    ], { hold: "no", holdY: 900, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "school", x: 540, y: 840, z: 1.03 }, { t: "full", x: 540, y: 960, z: 1.03 }] }),
    // 7. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 200, fs: 36, title: "WRITE THIS · 2 MARKS", points: [
        "A package groups related classes and interfaces into one namespace.",
        "It prevents name conflicts: shop.Student and school.Student.",
        "It must be the first statement in the file: package shop;" ],
        times: [r("package"), r("prevents"), r("first")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 8. memory trick + payoff
    S("remember", (r, d) => [
      <Head dur={d} text="package = folder" y={190} size={130} />,
      <Ico dur={d} ctx={ctx} name="folder" x={540} y={800} size={380} color={C.coral} at={r("folder") - 0.6} />,
      <Mascot dur={d} on size={240} tag="Cart" pts={[{ t: 0, x: 170, y: 1100, look: [1, -1] }, { t: r("equals"), x: 170, y: 1100, look: [1, -1] }, { t: r("folder") + 0.4, x: 540, y: 840, look: [0, 0], mood: "happy" }]} />,
      ...Sketch({ dur: d, at: r("two"), items: [{ text: "2 marks", x: 540, y: 1220, size: 120, w: 900 }] }),
      <Check dur={d} x={540} y={1430} size={120} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "folder", x: 540, y: 880, z: 1.02 }] }),
  ];
};
