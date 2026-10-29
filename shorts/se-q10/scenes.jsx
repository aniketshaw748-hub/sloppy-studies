import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
const P = 3800;
const diamond = (x, y, hw = 36, hh = 28) => [{ line: [x, y, x + hw, y - hh] }, { line: [x + hw, y - hh, x + 2 * hw, y] }, { line: [x + 2 * hw, y, x + hw, y + hh] }, { line: [x + hw, y + hh, x, y] }];
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Differentiate between association and aggregation in a UML Class Diagram with examples and notations.", n: 10, marks: 5, y: 440 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "aggregation", x: 540, y: 800, z: 1.02 }] }),
  // 2a. from zero: a teacher and a student are not parts of each other
  S("in a class diagram", (r, d) => [
    <Ico dur={d} ctx={ctx} name="user-round" x={220} y={640} size={170} at={r("teacher")} />,
    ...Sketch({ dur: d, at: r("teacher"), speed: P, items: [{ text: "teacher", x: 220, y: 760, size: 52, w: 340 }] }),
    <Ico dur={d} ctx={ctx} name="user-round" x={860} y={640} size={170} color={C.cobalt} at={r("student")} />,
    ...Sketch({ dur: d, at: r("student"), speed: P, color: C.cobalt, items: [{ text: "student", x: 860, y: 760, size: 52, w: 340, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("know"), speed: P, items: [{ line: [330, 640, 750, 640], color: C.coral }, { text: "know each other", x: 540, y: 510, size: 50, w: 560, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("together"), speed: P, color: C.coral, items: [{ text: "work together", x: 540, y: 700, size: 50, w: 560, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("neither"), speed: P, items: [{ text: "neither is a part of the other", x: 540, y: 960, size: 62, w: 980 }] }),
  ], { hold: "part of the other", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "know", x: 540, y: 910, z: 1.03 }] }),
  // 2b. a playlist and its songs
  S("now think of a playlist", (r, d) => [
    ...Sketch({ dur: d, at: 0.3, speed: P, items: [{ rect: [130, 640, 240, 110], label: "song 1", size: 44 }, { rect: [420, 640, 240, 110], label: "song 2", size: 44 }, { rect: [710, 640, 240, 110], label: "song 3", size: 44 }] }),
    ...Sketch({ dur: d, at: r("made"), speed: P, color: C.cobalt, items: [{ text: "playlist", x: 540, y: 460, size: 62, w: 500, color: C.cobalt }, { line: [100, 580, 980, 580], dashed: true, color: C.cobalt }, { line: [980, 580, 980, 810], dashed: true, color: C.cobalt }, { line: [980, 810, 100, 810], dashed: true, color: C.cobalt }, { line: [100, 810, 100, 580], dashed: true, color: C.cobalt }] }),
    <XMark dur={d} x={540} y={505} size={100} at={r("delete")} />,
    ...Sketch({ dur: d, at: r("phone"), speed: P, items: [{ rect: [60, 440, 960, 560] }, { text: "your phone", x: 800, y: 900, size: 50, w: 400 }] }),
    <Check dur={d} x={250} y={900} size={70} at={r("still") + 0.2} />, <Check dur={d} x={540} y={900} size={70} at={r("still") + 0.4} />, <Check dur={d} x={830} y={900} size={70} at={r("still") + 0.6} />,
    ...Sketch({ dur: d, at: r("exist"), speed: P, color: C.coral, items: [{ text: "the songs still exist", x: 540, y: 1100, size: 66, w: 980, color: C.coral }] }),
  ], { hold: "your phone", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "delete", x: 540, y: 920, z: 1.03 }] }),
  // 3. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, speed: P, items: [
      { text: "the question wants:", x: 540, y: 460, size: 80, w: 960 },
      { text: "1.  the difference", x: 150, y: 660, size: 60, w: 860, align: "left", at: r("difference") },
      { text: "2.  examples", x: 150, y: 810, size: 60, w: 840, align: "left", at: r("examples") },
      { text: "3.  the notation", x: 150, y: 960, size: 60, w: 840, align: "left", at: r("notation") } ] }),
    <Check dur={d} x={95} y={695} size={76} at={r("difference") + 0.7} />, <Check dur={d} x={95} y={845} size={76} at={r("examples") + 0.7} />, <Check dur={d} x={95} y={995} size={76} at={r("notation") + 0.7} />,
  ]),
  // 4a. association: a basic link between equals
  S("first association", (r, d) => [
    <Head dur={d} text="association" y={170} size={120} at={0.3} />,
    ...Sketch({ dur: d, at: r("class"), speed: P, items: [{ rect: [100, 520, 300, 110], label: "Student", size: 46 }, { rect: [680, 520, 300, 110], label: "Book", size: 46 }] }),
    ...Sketch({ dur: d, at: r("knows"), speed: P, items: [{ line: [400, 575, 680, 575] }, { text: "knows / uses", x: 540, y: 400, size: 52, w: 420, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("equals"), speed: P, color: C.cobalt, items: [{ text: "equals", x: 540, y: 720, size: 60, w: 600, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("owns"), speed: P, items: [{ text: "neither owns the other", x: 540, y: 850, size: 62, w: 980 }] }),
  ], { hold: "owns the other", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "knows", x: 540, y: 910, z: 1.03 }] }),
  // 4b. association: notation + example
  S("notation a plain solid", (r, d) => [
    ...Sketch({ dur: d, at: 0.2, speed: P, items: [{ rect: [100, 420, 300, 110], label: "Student", size: 46 }, { rect: [680, 420, 300, 110], label: "Book", size: 46 }] }),
    ...Sketch({ dur: d, at: r("plain"), speed: P, items: [{ line: [400, 475, 680, 475] }] }),
    ...Sketch({ dur: d, at: r("name"), speed: P, color: C.coral, items: [{ text: "borrows", x: 540, y: 390, size: 46, w: 260, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("multiplicities"), speed: P, color: C.cobalt, items: [{ text: "0..1", x: 460, y: 500, size: 40, w: 110, color: C.cobalt }, { text: "0..*", x: 620, y: 500, size: 40, w: 110, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("example"), speed: P, items: [{ text: "a Student borrows a Book", x: 540, y: 720, size: 62, w: 980 }] }),
    ...Sketch({ dur: d, at: r("just"), speed: P, color: C.coral, items: [{ text: "association = knows or uses", x: 540, y: 860, size: 58, w: 980, color: C.coral }, { text: "a plain line", x: 540, y: 980, size: 66, w: 980, color: C.coral }] }),
  ], { hold: "just knows", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "name", x: 540, y: 920, z: 1.03 }] }),
  // 5a. aggregation: whole and parts, parts live on
  S("second aggregation", (r, d) => [
    <Head dur={d} text="aggregation" y={170} size={120} at={0.3} />,
    ...Sketch({ dur: d, at: r("whole"), speed: P, items: [{ rect: [100, 440, 880, 400] }, { text: "Library", x: 540, y: 455, size: 54, w: 600 }] }),
    ...Sketch({ dur: d, at: r("parts"), speed: P, items: [{ rect: [150, 620, 220, 100], label: "Book", size: 44 }, { rect: [430, 620, 220, 100], label: "Book", size: 44 }, { rect: [710, 620, 220, 100], label: "Book", size: 44 }] }),
    ...Sketch({ dur: d, at: r("has"), speed: P, color: C.coral, items: [{ text: "has-a", x: 540, y: 920, size: 70, w: 600, color: C.coral }] }),
    <XMark dur={d} x={540} y={500} size={110} at={r("without")} />,
    <Check dur={d} x={260} y={790} size={64} at={r("live") + 0.3} />, <Check dur={d} x={540} y={790} size={64} at={r("live") + 0.5} />, <Check dur={d} x={820} y={790} size={64} at={r("live") + 0.7} />,
    ...Sketch({ dur: d, at: r("without") + 0.3, speed: P, color: C.cobalt, items: [{ text: "the parts live on", x: 540, y: 1060, size: 66, w: 980, color: C.cobalt }] }),
  ], { hold: "the whole", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "parts", x: 540, y: 920, z: 1.03 }] }),
  // 5b. aggregation: notation + example
  S("notation a solid line", (r, d) => [
    ...Sketch({ dur: d, at: 0.2, speed: P, items: [{ rect: [100, 420, 300, 110], label: "Library", size: 46 }, { rect: [680, 420, 300, 110], label: "Book", size: 46 }] }),
    ...Sketch({ dur: d, at: r("empty"), speed: P, items: [...diamond(400, 475, 36, 28), { line: [472, 475, 680, 475] }] }),
    ...Sketch({ dur: d, at: r("empty") + 0.5, speed: P, color: C.coral, items: [{ text: "empty diamond", x: 436, y: 570, size: 50, w: 360, color: C.coral }, { text: "= the whole", x: 436, y: 650, size: 50, w: 360, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("library"), speed: P, items: [{ text: "a Library has Books", x: 540, y: 800, size: 62, w: 980 }] }),
    ...Sketch({ dur: d, at: r("closes"), speed: P, color: C.cobalt, items: [{ text: "library closes: books still exist", x: 540, y: 920, size: 54, w: 1000, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("parts") + 0.2, speed: P, color: C.coral, items: [{ text: "whole + parts, empty diamond", x: 540, y: 1060, size: 58, w: 1000, color: C.coral }] }),
  ], { hold: "diamond on the", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "empty", x: 540, y: 920, z: 1.03 }] }),
  // 6. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
      "Association: a general link between two classes (knows / uses). Equals, neither owns the other. Notation: plain solid line with name and multiplicities.",
      "Example: Student borrows Book.",
      "Aggregation: a special association, whole and parts (has-a). Parts can exist without the whole. Notation: solid line with an empty diamond at the whole's end.",
      "Example: Library has Books." ],
      times: [r("association"), r("student"), r("aggregation"), r("library")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 7. memory trick + payoff
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, speed: P, items: [...diamond(300, 560, 120, 85), { line: [540, 560, 800, 560] }, { text: "sits on the WHOLE", x: 540, y: 710, size: 66, w: 980 }] }),
    ...Sketch({ dur: d, at: r("empty"), speed: P, color: C.coral, items: [{ text: "empty = parts can leave", x: 540, y: 840, size: 64, w: 980, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("five"), speed: P, items: [{ text: "5 marks", x: 540, y: 1000, size: 150, w: 900 }] }),
    <Check dur={d} x={540} y={1380} size={170} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 780, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.05 }] }),
];
