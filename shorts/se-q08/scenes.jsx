import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
const P = 3800;
const FAST = 99999;
// the class pair at the top of each example scene
const pair = (a, b, mult) => [{ rect: [100, 420, 300, 100], label: a, size: 44 }, { rect: [680, 420, 300, 100], label: b, size: 44 }, { line: [400, 470, 680, 470] }];
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "What does multiplicity represent in a UML Class Diagram? Explain 1, 0..1, 1..* and 0..* with examples.", n: 8, marks: 5, y: 420 }),
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "examples", x: 540, y: 800, z: 1.02 }] }),
  // 2a. from zero: every person has exactly one mother
  S("think of a family", (r, d) => [
    <Head dur={d} text="a family" y={170} size={130} at={0.3} />,
    ...Sketch({ dur: d, at: r("mother"), speed: P, items: [{ oval: [540, 520, 110, 60], label: "mother", size: 44 }] }),
    ...Sketch({ dur: d, at: r("exactly"), speed: P, items: [{ oval: [540, 900, 90, 55], label: "child", size: 44 }, { line: [540, 580, 540, 845] }] }),
    ...Sketch({ dur: d, at: r("one mother"), speed: P, color: C.coral, items: [{ text: "exactly 1 mother", x: 540, y: 1060, size: 66, w: 900, color: C.coral }] }),
  ], { hold: "one mother", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "exactly", x: 540, y: 920, z: 1.03 }] }),
  // 2b. a mother can have 0, 1 or many children
  S("but a mother", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, speed: P, items: [190, 540, 890].map(x => ({ oval: [x, 520, 90, 55], label: "mother", size: 40 })) }),
    ...Sketch({ dur: d, at: r("zero"), speed: P, items: [{ text: "0 children", x: 190, y: 640, size: 46, w: 320, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("one child"), speed: P, items: [{ line: [540, 575, 540, 720] }, { oval: [540, 770, 50, 45] }, { text: "1 child", x: 540, y: 850, size: 46, w: 320, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("many"), speed: P, items: [{ line: [890, 575, 800, 720] }, { line: [890, 575, 890, 720] }, { line: [890, 575, 980, 720] },
      { oval: [800, 770, 45, 42] }, { oval: [890, 770, 45, 42] }, { oval: [980, 770, 45, 42] }, { text: "many", x: 890, y: 850, size: 46, w: 320, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("rules"), speed: P, items: [{ text: "how-many rules", x: 540, y: 1050, size: 70, w: 980 }] }),
    ...Sketch({ dur: d, at: r("multiplicity"), speed: P, color: C.coral, items: [{ text: "= multiplicity", x: 540, y: 1180, size: 80, w: 980, color: C.coral }] }),
  ], { hold: "writes them", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "many", x: 540, y: 920, z: 1.03 }] }),
  // 3. the definition: number at the end of the line
  S("multiplicity is the number", (r, d) => [
    ...Sketch({ dur: d, at: 0.2, speed: P, items: pair("Mother", "Child") }),
    ...Sketch({ dur: d, at: r("number"), speed: P, color: C.cobalt, items: [{ text: "0..*", x: 610, y: 365, size: 60, w: 200, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("many"), speed: P, color: C.coral, items: [{ text: "number at Child's end", x: 540, y: 660, size: 56, w: 980, color: C.coral }, { text: "= how many Children", x: 540, y: 770, size: 56, w: 980, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("one object"), speed: P, items: [{ text: "for ONE Mother", x: 540, y: 880, size: 66, w: 980 }] }),
  ], { hold: "other end", holdY: 800, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "many", x: 540, y: 820, z: 1.03 }] }),
  // 4. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, speed: P, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  the meaning", x: 150, y: 720, size: 60, w: 860, align: "left", at: r("meaning") },
      { text: "2.  four examples", x: 150, y: 880, size: 60, w: 840, align: "left", at: r("four") } ] }),
    <Check dur={d} x={95} y={755} size={80} at={r("meaning") + 0.8} />, <Check dur={d} x={95} y={915} size={80} at={r("four") + 0.8} />,
  ]),
  // 5. 1 = exactly one
  S("first one", (r, d) => [
    <Head dur={d} text="1 = exactly one" y={170} size={110} at={0.3} />,
    ...Sketch({ dur: d, at: r("book"), speed: P, items: pair("Book", "Publisher") }),
    ...Sketch({ dur: d, at: r("publisher"), speed: P, color: C.cobalt, items: [{ text: "1", x: 640, y: 385, size: 60, w: 100, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("publisher") + 0.6, speed: P, items: [{ oval: [250, 850, 100, 55], label: "a book", size: 42 }, { line: [350, 850, 700, 850] }, { oval: [800, 850, 110, 55], label: "publisher", size: 42 }] }),
    <XMark dur={d} x={110} y={1040} size={64} at={r("zero")} />,
    ...Sketch({ dur: d, at: r("zero"), speed: P, color: C.coral, items: [{ text: "0 publishers", x: 170, y: 1000, size: 52, w: 400, align: "left", color: C.coral }] }),
    <XMark dur={d} x={600} y={1040} size={64} at={r("two")} />,
    ...Sketch({ dur: d, at: r("two"), speed: P, color: C.coral, items: [{ text: "2 publishers", x: 660, y: 1000, size: 52, w: 380, align: "left", color: C.coral }] }),
  ], { hold: "means exactly one", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "publisher", x: 540, y: 920, z: 1.03 }] }),
  // 6. 0..1 = optional, at most one
  S("second zero to one", (r, d) => [
    <Head dur={d} text="0..1 = optional" y={170} size={110} at={0.3} />,
    ...Sketch({ dur: d, at: r("student") - 0.3, speed: P, items: pair("Student", "LibraryCard") }),
    ...Sketch({ dur: d, at: r("student"), speed: P, color: C.cobalt, items: [{ text: "0..1", x: 596, y: 365, size: 60, w: 200, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("card"), speed: P, items: [{ oval: [200, 720, 90, 50], label: "Ann", size: 42 }, { line: [290, 720, 720, 720] }, { oval: [820, 720, 100, 50], label: "card", size: 42 }, { text: "1 card", x: 540, y: 760, size: 44, w: 260, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("not yet"), speed: P, items: [{ oval: [200, 920, 90, 50], label: "Raj", size: 42 }, { line: [290, 920, 560, 920], dashed: true }, { text: "no card yet", x: 780, y: 890, size: 46, w: 380, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("never two"), speed: P, items: [{ oval: [200, 1110, 90, 50], label: "Eve", size: 42 }, { line: [290, 1100, 600, 1040] }, { line: [290, 1120, 600, 1190] }, { oval: [700, 1040, 100, 45], label: "card", size: 38 }, { oval: [700, 1190, 100, 45], label: "card", size: 38 }] }),
    <XMark dur={d} x={880} y={1115} size={120} at={r("never two") + 0.8} />,
  ], { hold: "at most one", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "card", x: 540, y: 930, z: 1.03 }] }),
  // 7. 1..* = at least one
  S("third one to many", (r, d) => [
    <Head dur={d} text="1..* = one or more" y={170} size={110} at={0.3} />,
    ...Sketch({ dur: d, at: r("book") - 0.3, speed: P, items: pair("Book", "Author") }),
    ...Sketch({ dur: d, at: r("least"), speed: P, color: C.cobalt, items: [{ text: "1..*", x: 596, y: 365, size: 60, w: 200, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("author"), speed: P, items: [{ oval: [200, 710, 90, 50], label: "book A", size: 38 }, { line: [290, 710, 700, 710] }, { oval: [790, 710, 100, 45], label: "author", size: 38 }, { text: "1 author", x: 540, y: 750, size: 44, w: 260, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("sometimes"), speed: P, items: [{ oval: [200, 930, 90, 50], label: "book B", size: 38 }, { line: [290, 920, 700, 850] }, { line: [290, 930, 700, 930] }, { line: [290, 940, 700, 1010] },
      { oval: [790, 850, 100, 40], label: "author", size: 34 }, { oval: [790, 930, 100, 40], label: "author", size: 34 }, { oval: [790, 1010, 100, 40], label: "author", size: 34 }] }),
    ...Sketch({ dur: d, at: r("sometimes") + 1.2, speed: P, together: true, color: C.coral, items: [{ oval: [200, 1160, 90, 50], label: "book C", size: 38 }, { text: "0 authors", x: 560, y: 1135, size: 50, w: 380, color: C.coral }] }),
    <XMark dur={d} x={850} y={1180} size={110} at={r("sometimes") + 2.4} />,
  ], { hold: "at least one", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "author", x: 540, y: 930, z: 1.03 }] }),
  // 8. 0..* = any number
  S("fourth zero to many", (r, d) => [
    <Head dur={d} text="0..* = any number" y={170} size={110} at={0.3} />,
    ...Sketch({ dur: d, at: r("student") - 0.3, speed: P, items: pair("Student", "IssueRecord") }),
    ...Sketch({ dur: d, at: r("even"), speed: P, color: C.cobalt, items: [{ text: "0..*", x: 596, y: 365, size: 60, w: 200, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("none"), speed: P, items: [{ oval: [200, 720, 90, 50], label: "Ann", size: 42 }, { text: "0 records", x: 560, y: 695, size: 50, w: 380, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("records"), speed: P, items: [{ oval: [200, 900, 90, 50], label: "Raj", size: 42 }, { line: [290, 900, 470, 900] }, { rect: [480, 870, 90, 60] }, { rect: [590, 870, 90, 60] }, { text: "2 records", x: 840, y: 880, size: 50, w: 340, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("dozens"), speed: P, items: [{ oval: [200, 1100, 90, 50], label: "Eve", size: 42 }, { line: [290, 1100, 470, 1100] }, ...[480, 580, 680, 780, 880].map(x => ({ rect: [x, 1070, 80, 60] })), { text: "dozens", x: 700, y: 1160, size: 50, w: 340, color: C.coral }] }),
  ], { hold: "any number", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "records", x: 540, y: 930, z: 1.03 }] }),
  // 9. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
      "Multiplicity: how many objects of one class can be linked to ONE object of the other class. Written at the end of an association line.",
      "1 = exactly one (Book has 1 Publisher).",
      "0..1 = optional, at most one (Student has 0..1 LibraryCard).",
      "1..* = one or more (Book has 1..* Authors).",
      "0..* = zero or more, any number (Student has 0..* IssueRecords)." ],
      times: [r("multiplicity"), r("exactly"), r("optional"), r("one or more"), r("any number")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 10. memory trick + payoff
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, speed: P, items: [{ text: "0..*", x: 540, y: 420, size: 200, w: 900 }] }),
    ...Sketch({ dur: d, at: r("minimum"), speed: P, color: C.coral, items: [{ line: [470, 800, 470, 720], arrow: true, color: C.coral }, { text: "minimum", x: 470, y: 830, size: 56, w: 340, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("maximum"), speed: P, color: C.cobalt, items: [{ line: [730, 800, 730, 720], arrow: true, color: C.cobalt }, { text: "maximum", x: 730, y: 830, size: 56, w: 340, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("five"), speed: P, items: [{ text: "5 marks", x: 540, y: 1060, size: 150, w: 900 }] }),
    <Check dur={d} x={540} y={1420} size={170} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 780, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.05 }] }),
];
