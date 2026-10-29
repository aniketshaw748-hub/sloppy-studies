import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
const FAST = 99999;
const X = [190, 540, 890];
// three participant boxes + dashed lifelines (instant = redraw of something already explained)
const skel = (d, at, instant, names) => Sketch({ dur: d, at, speed: instant ? FAST : 2600, items: [
  ...X.map((x, i) => ({ rect: [x - 140, 360, 280, 120], label: names[i], size: 50 })),
  ...X.map(x => ({ line: [x, 480, x, 1420], dashed: true })) ] });
const NAMES = ["Student", "Librarian", "LMS"];
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Draw and explain a UML Sequence Diagram for a Library Management System showing the process of issuing a book (Student, Librarian, Library Management System).", n: 2, marks: 5, y: 520 }),
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "issuing", x: 540, y: 760, z: 1.05 }] }),
  // 2. from zero: a sequence diagram = a group chat
  S("let's start", (r, d) => [
    <Head dur={d} text="sequence diagram" y={170} size={130} at={0.3} />,
    <Label dur={d} text="a picture of a conversation" x={540} y={330} w={900} size={50} color={C.cobalt} at={r("picture")} />,
    ...Sketch({ dur: d, at: r("group"), items: X.map((x, i) => ({ oval: [x, 600, 75, 62], label: ["A", "B", "C"][i], size: 52 })) }),
    ...Sketch({ dur: d, at: r("top"), items: X.map(x => ({ line: [x, 665, x, 1250], dashed: true })) }),
    ...Sketch({ dur: d, at: r("top") + 0.2, items: [
      { line: [190, 800, 540, 800], arrow: true, label: "hi!", size: 40 },
      { line: [540, 950, 890, 950], arrow: true, label: "lunch?", size: 40 },
      { line: [890, 1100, 540, 1100], arrow: true, label: "sure!", size: 40 } ] }),
    <Arrow dur={d} x1={1015} y1={760} x2={1015} y2={1180} color={C.cobalt} width={9} at={r("order")} />,
    ...Sketch({ dur: d, at: r("story") - 0.6, color: C.cobalt, items: [{ text: "time", x: 975, y: 1200, size: 46, w: 160, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("story"), color: C.coral, items: [{ text: "the ORDER is the story", x: 540, y: 1340, size: 62, w: 960, color: C.coral }] }),
  ], { hold: "whole story", holdY: 880, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "group", x: 540, y: 880, z: 1.03 }, { t: "top", x: 540, y: 960, z: 1.03 }] }),
  // 3. in UML: lifeline + message
  S("in uml", (r, d) => [
    ...Sketch({ dur: d, at: 0.2, items: [{ rect: [130, 420, 280, 120], label: "Student", size: 50 }, { rect: [670, 420, 280, 120], label: "Librarian", size: 50 }] }),
    ...Sketch({ dur: d, at: r("dashed"), items: [{ line: [270, 540, 270, 1250], dashed: true }, { line: [810, 540, 810, 1250], dashed: true }] }),
    ...Sketch({ dur: d, at: r("lifeline"), color: C.coral, items: [{ text: "lifeline", x: 270, y: 1300, size: 62, w: 340, color: C.coral }, { line: [270, 1290, 270, 1210], arrow: true, color: C.coral }] }),
    <Arrow dur={d} x1={1015} y1={600} x2={1015} y2={1160} color={C.cobalt} width={9} at={r("flows")} />,
    ...Sketch({ dur: d, at: r("down"), color: C.cobalt, items: [{ text: "time", x: 975, y: 1190, size: 46, w: 160, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("horizontal"), items: [{ line: [270, 800, 810, 800], arrow: true }] }),
    ...Sketch({ dur: d, at: r("message") + 0.1, color: C.coral, items: [{ text: "message", x: 540, y: 710, size: 62, w: 340, color: C.coral }] }),
  ], { hold: "another", holdY: 880, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "lifeline", x: 540, y: 940, z: 1.03 }, { t: "horizontal", x: 540, y: 900, z: 1.02 }] }),
  // 4. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  draw the diagram", x: 150, y: 720, size: 60, w: 860, align: "left", at: r("draw") },
      { text: "2.  explain it", x: 150, y: 880, size: 60, w: 840, align: "left", at: r("explain") } ] }),
    <Check dur={d} x={95} y={755} size={80} at={r("draw") + 1.2} />,
    <Check dur={d} x={95} y={915} size={80} at={r("explain") + 1.0} />,
  ]),
  // 5. step 1: the participants
  S("first the participants", (r, d) => [
    <Head dur={d} text={"1 · participants"} y={170} size={120} at={0.3} />,
    ...Sketch({ dur: d, at: r("student"), items: [{ rect: [50, 360, 280, 120], label: "Student", size: 50 }] }),
    ...Sketch({ dur: d, at: r("librarian"), items: [{ rect: [400, 360, 280, 120], label: "Librarian", size: 50 }] }),
    ...Sketch({ dur: d, at: r("library"), items: [{ rect: [750, 360, 280, 120], label: "LMS", size: 50 }] }),
    ...Sketch({ dur: d, at: r("library") + 1.6, color: C.cobalt, items: [{ text: "LMS = Library Management System", x: 540, y: 1440, size: 46, w: 960, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("lifeline"), items: X.map(x => ({ line: [x, 480, x, 1420], dashed: true })) }),
  ], { hold: "one box", holdY: 920, cam: [{ t: 0, x: 540, y: 940, z: 1.0 }, { t: "student", x: 540, y: 940, z: 1.02 }, { t: "lifeline", x: 540, y: 960, z: 1.03 }] }),
  // 6. step 2: the six messages
  S("now the messages", (r, d) => [
    <Head dur={d} text={"2 · messages"} y={170} size={120} at={0.1} />,
    ...skel(d, 0.1, true, NAMES),
    ...Sketch({ dur: d, at: r("student") + 0.1, items: [{ line: [190, 640, 540, 640], arrow: true, label: "requestBook()", size: 36 }] }),
    ...Sketch({ dur: d, at: r("system"), items: [{ line: [540, 775, 890, 775], arrow: true, label: "isAvailable()", size: 36 }] }),
    ...Sketch({ dur: d, at: r("replies"), color: C.cobalt, items: [{ line: [890, 910, 540, 910], arrow: true, dashed: true, label: "available", size: 36, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("then") + 0.5, items: [{ line: [540, 1045, 890, 1045], arrow: true, label: "issueBook()", size: 36 }] }),
    ...Sketch({ dur: d, at: r("confirms"), items: [{ line: [890, 1180, 540, 1180], arrow: true, dashed: true, label: "confirm(dueDate)", size: 36, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("finally"), items: [{ line: [540, 1315, 190, 1315], arrow: true, dashed: true, label: "hands over book", size: 36, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("solid"), items: [{ text: "solid = call", x: 290, y: 1440, size: 48, w: 480 }, { text: "dashed = reply", x: 790, y: 1440, size: 48, w: 480, color: C.cobalt }] }),
  ], { hold: "six arrows", holdY: 900, cam: [{ t: 0, x: 540, y: 960, z: 1.0 }, { t: "student", x: 540, y: 960, z: 1.02 }, { t: "then", x: 540, y: 960, z: 1.03 }, { t: "finally", x: 540, y: 960, z: 1.035 }] }),
  // 7. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
      "A sequence diagram shows how objects interact, in time order.",
      "Three lifelines: Student, Librarian, LMS (Library Management System).",
      "Six messages, top to bottom: requestBook, isAvailable, available, issueBook, confirm(dueDate), hand over book.",
      "Solid arrow = call. Dashed arrow = reply." ],
      times: [r("interact"), r("three"), r("six"), r("solid")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 8. memory trick + payoff
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "lifeline = the clock", x: 540, y: 560, size: 72, w: 960 }, { line: [140, 690, 940, 690], color: C.coral },
      { text: "arrows = the words", x: 540, y: 800, size: 72, w: 960, at: r("arrows") }, { line: [140, 930, 940, 930], color: C.cobalt },
      { text: "5 marks", x: 540, y: 1060, size: 150, w: 900, at: r("five") } ] }),
    <Check dur={d} x={540} y={1420} size={180} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.06 }] }),
];
