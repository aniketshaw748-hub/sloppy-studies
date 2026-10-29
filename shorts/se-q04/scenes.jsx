import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
const FAST = 99999;
// five class boxes: name / attributes / methods
const CL = [
  { n: "Student", x: 40, y: 170, a: ["- studentId", "- name"], m: ["+ borrowBook()", "+ returnBook()"] },
  { n: "Librarian", x: 600, y: 170, a: ["- staffId", "- name"], m: ["+ issueBook()", "+ collectFine()"] },
  { n: "IssueRecord", x: 320, y: 656, a: ["- issueDate", "- dueDate"], m: ["+ markReturned()", "+ isOverdue()"] },
  { n: "Book", x: 40, y: 1142, a: ["- bookId", "- title"], m: ["+ isAvailable()", "+ updateCopies()"] },
  { n: "Fine", x: 600, y: 1142, a: ["- amount", "- paid"], m: ["+ calculate()", "+ pay()"] } ];
const BW = 440, BH = 336;
const frames = (d, at, speed) => Sketch({ dur: d, at, speed, items: CL.map(c => ({ rect: [c.x, c.y, BW, BH], label: c.n, size: 46, divider: [84, 210] })) });
const contents = (d, tA, tM) => CL.flatMap((c, i) => [
  ...c.a.map((s, k) => <Label key={"a" + i + k} dur={d} text={s} x={c.x + 24} y={c.y + 92 + k * 56} w={392} size={34} align="left" at={tA + i * 0.12} />),
  ...c.m.map((s, k) => <Label key={"m" + i + k} dur={d} text={s} x={c.x + 24} y={c.y + 218 + k * 56} w={392} size={34} align="left" at={tM + i * 0.12} />) ]);
const E = [[260, 506, 430, 656], [820, 506, 650, 656], [430, 992, 260, 1142], [650, 992, 820, 1142]];
const C0 = { coral: "#E0352B", cobalt: "#1F5FD1" };
const VB = [["borrows", 370, 560], ["creates", 555, 560], ["for", 200, 1040], ["gets", 800, 1040]];
const edge = (d, i, tL, tV, speed) => [...Sketch({ dur: d, at: tL, speed, items: [{ line: E[i] }] }), ...Sketch({ dur: d, at: tV, color: C0.coral, items: [{ text: VB[i][0], x: VB[i][1], y: VB[i][2], size: 34, w: 220, align: "left", color: C0.coral }] })];
const NUM = [["0..*", 325, 598], ["1", 230, 515], ["1", 865, 515], ["0..*", 750, 598], ["0..*", 500, 1005], ["1", 345, 1076], ["1", 620, 1005], ["0..1", 715, 1076]];
const nums = (d, t) => NUM.map(([s, x, y], i) => Sketch({ dur: d, at: t[i], color: C0.cobalt, items: [{ text: s, x, y, size: 38, w: 120, color: C0.cobalt }] })).flat();
export const SCENES = ({ S, ctx, C }) => { C0.coral = C.coral; C0.cobalt = C.cobalt; return [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Draw a UML Class Diagram for a Library Management System using the classes Student, Book, Librarian, Issue Record and Fine, with attributes, methods, relationships and multiplicities.", n: 4, marks: 5, y: 400 }),
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "fine", x: 540, y: 780, z: 1.03 }] }),
  // 2. from zero: a class = a blank form
  S("a class is like", (r, d) => [
    <Head dur={d} text="a class = a form" y={170} size={120} at={0.3} />,
    ...Sketch({ dur: d, at: r("blank"), items: [{ rect: [60, 380, 580, 560] }] }),
    ...Sketch({ dur: d, at: r("details"), items: [
      { text: "name:", x: 110, y: 430, size: 56, w: 220, align: "left" }, { line: [270, 490, 600, 490] },
      { text: "ID:", x: 110, y: 550, size: 56, w: 220, align: "left" }, { line: [270, 610, 600, 610] } ] }),
    ...Sketch({ dur: d, at: r("attributes"), color: C.coral, items: [{ text: "attributes", x: 860, y: 480, size: 58, w: 340, color: C.coral }, { line: [700, 540, 625, 560], arrow: true, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("do"), items: [{ rect: [100, 730, 240, 90], label: "borrow", size: 46 }, { rect: [360, 730, 240, 90], label: "return", size: 46 }] }),
    ...Sketch({ dur: d, at: r("methods"), color: C.coral, items: [{ text: "methods", x: 860, y: 740, size: 58, w: 340, color: C.coral }, { line: [700, 790, 625, 780], arrow: true, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("methods") + 0.9, color: C.cobalt, items: [{ text: "details it holds + things it can do", x: 540, y: 1060, size: 54, w: 980, color: C.cobalt }] }),
  ], { hold: "are methods", holdY: 880, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "details", x: 540, y: 910, z: 1.03 }, { t: "do", x: 540, y: 920, z: 1.03 }] }),
  // 3. the UML class box = three parts
  S("in uml", (r, d) => [
    ...Sketch({ dur: d, at: r("box"), items: [{ rect: [440, 420, 580, 470] }, { line: [440, 540, 1020, 540] }, { line: [440, 700, 1020, 700] }] }),
    ...Sketch({ dur: d, at: r("name"), items: [{ text: "Student", x: 730, y: 445, size: 60, w: 560 }, { text: "name", x: 205, y: 450, size: 54, w: 340, color: C.coral }, { line: [385, 495, 432, 495], arrow: true, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("attributes"), items: [{ text: "- studentId", x: 470, y: 560, size: 38, w: 540, align: "left" }, { text: "- name", x: 470, y: 625, size: 38, w: 540, align: "left" }, { text: "attributes", x: 205, y: 590, size: 54, w: 340, color: C.coral }, { line: [385, 640, 432, 620], arrow: true, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("methods") - 0.2, items: [{ text: "+ borrowBook()", x: 470, y: 722, size: 38, w: 540, align: "left" }, { text: "+ returnBook()", x: 470, y: 787, size: 38, w: 540, align: "left" }, { text: "methods", x: 205, y: 740, size: 54, w: 340, color: C.coral }, { line: [385, 790, 432, 790], arrow: true, color: C.coral }] }),
  ], { hold: "methods", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "attributes", x: 540, y: 900, z: 1.03 }] }),
  // 4. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 460, size: 80, w: 960 },
      { text: "1.  the five boxes", x: 150, y: 640, size: 58, w: 860, align: "left", at: r("boxes") },
      { text: "2.  their contents", x: 150, y: 790, size: 58, w: 860, align: "left", at: r("contents") },
      { text: "3.  lines between them", x: 150, y: 940, size: 58, w: 860, align: "left", at: r("lines") },
      { text: "4.  numbers on the lines", x: 150, y: 1090, size: 58, w: 860, align: "left", at: r("numbers") } ] }),
    <Check dur={d} x={95} y={675} size={76} at={r("boxes") + 1.0} />, <Check dur={d} x={95} y={825} size={76} at={r("contents") + 1.0} />,
    <Check dur={d} x={95} y={975} size={76} at={r("lines") + 1.0} />, <Check dur={d} x={95} y={1125} size={76} at={r("numbers") + 1.0} />,
  ]),
  // 5. step 1: the five boxes
  S("first the five", (r, d) => [
    ...frames(d, 0.2, 3800),
    ...contents(d, r("attributes"), r("methods")),
  ], { hold: "five classes", holdY: 960, cam: [{ t: 0, x: 540, y: 960, z: 1.0 }, { t: "attributes", x: 540, y: 960, z: 1.02 }, { t: "methods", x: 540, y: 960, z: 1.02 }] }),
  // 6. step 2: relationships
  S("next the relationships", (r, d) => [
    ...frames(d, 0.05, FAST), ...contents(d, 0.1, 0.1),
    ...edge(d, 0, r("student") + 0.2, r("borrows"), 3000), ...edge(d, 1, r("librarian"), r("creates"), 3000),
    ...edge(d, 2, r("book") - 0.2, r("book") + 0.3, 3000), ...edge(d, 3, r("overdue") + 0.2, r("gets"), 3000),
    ...Sketch({ dur: d, at: r("association"), color: C.cobalt, items: [{ text: "association", x: 540, y: 1005, size: 46, w: 420, color: C.cobalt }, { line: [440, 1088, 372, 1070], arrow: true, color: C.cobalt }, { line: [640, 1088, 708, 1070], arrow: true, color: C.cobalt }] }),
  ], { hold: "plain line", holdY: 960, cam: [{ t: 0, x: 540, y: 960, z: 1.0 }, { t: "creates", x: 540, y: 960, z: 1.02 }] }),
  // 7. step 3: multiplicities
  S("now multiplicities", (r, d) => [
    ...frames(d, 0.05, FAST), ...contents(d, 0.1, 0.1),
    ...[0, 1, 2, 3].flatMap(i => edge(d, i, 0.1, 0.1, FAST)),
    ...nums(d, [r("many"), r("exactly") + 0.3, r("same") + 0.2, r("same") + 0.7, r("book"), r("book") + 0.5, r("one record") + 0.1, r("fine")]),
  ], { hold: "single side", holdY: 960, cam: [{ t: 0, x: 540, y: 960, z: 1.0 }, { t: "exactly", x: 540, y: 960, z: 1.02 }] }),
  // 8. exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
      "Five class boxes (name / attributes / methods): Student, Librarian, IssueRecord, Book, Fine.",
      "Student, Librarian and Book are each 1 to 0..* with IssueRecord (borrows, creates, for).",
      "IssueRecord to Fine: 1 to 0..1 (an overdue record may get a fine)." ],
      times: [r("five"), r("librarian"), r("fine")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 9. memory trick: hub of the wheel
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, speed: 3600, items: [
      { oval: [540, 700, 190, 80], label: "IssueRecord", size: 46 },
      { line: [420, 640, 290, 470] }, { line: [660, 640, 790, 470] }, { line: [420, 760, 290, 930] }, { line: [660, 760, 790, 930] },
      { oval: [230, 400, 170, 70], label: "Student", size: 42 }, { oval: [850, 400, 170, 70], label: "Librarian", size: 42 },
      { oval: [230, 1000, 170, 70], label: "Book", size: 42 }, { oval: [850, 1000, 170, 70], label: "Fine", size: 42 } ] }),
    ...Sketch({ dur: d, at: r("five"), items: [{ text: "5 marks", x: 540, y: 1200, size: 140, w: 900 }] }),
    <Check dur={d} x={540} y={1500} size={170} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.04 }] }),
]; };
