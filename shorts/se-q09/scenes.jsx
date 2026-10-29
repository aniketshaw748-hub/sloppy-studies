import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
const P = 3800;
const uc = (name, x, y, rx = 200) => ({ oval: [x, y, rx, 65], label: name, size: 46 });
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Differentiate between <<include>> and <<extend>> relationships in a Use Case Diagram, with example and notation.", n: 9, marks: 5, y: 440 }),
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "notation", x: 540, y: 800, z: 1.02 }] }),
  // 2. from zero: making tea
  S("think of making", (r, d) => [
    ...Sketch({ dur: d, at: 0.3, speed: P, items: [uc("Make Tea", 540, 480)] }),
    ...Sketch({ dur: d, at: r("boiling"), speed: P, items: [uc("Boil Water", 300, 820, 180), { line: [450, 540, 330, 750], arrow: true }, { text: "ALWAYS", x: 300, y: 920, size: 60, w: 420, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("sugar"), speed: P, items: [uc("Add Sugar", 780, 820, 180), { line: [630, 540, 750, 750], arrow: true, dashed: true, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("optional"), speed: P, color: C.cobalt, items: [{ text: "optional", x: 780, y: 920, size: 60, w: 420, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("sometimes") - 0.2, speed: P, color: C.cobalt, items: [{ text: "only sometimes", x: 540, y: 1100, size: 64, w: 900, color: C.cobalt }] }),
  ], { hold: "only sometimes", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "boiling", x: 540, y: 930, z: 1.03 }] }),
  // 3. the whole difference
  S("that is the whole", (r, d) => [
    ...Sketch({ dur: d, at: 0.2, speed: P, items: [
      { text: "include", x: 280, y: 520, size: 80, w: 440, color: C.coral }, { text: "= the step you ALWAYS need", x: 540, y: 650, size: 58, w: 980 }, { line: [140, 770, 940, 770], color: C.coral },
      { text: "extend", x: 280, y: 900, size: 80, w: 440, color: C.cobalt, at: r("extend") }, { text: "= only if a condition is true", x: 540, y: 1030, size: 52, w: 980, at: r("only") } , { line: [140, 1150, 940, 1150], color: C.cobalt }] }),
  ], { hold: "condition is true", holdY: 900 }),
  // 4. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, speed: P, items: [
      { text: "the question wants:", x: 540, y: 460, size: 80, w: 960 },
      { text: "1.  the difference", x: 150, y: 660, size: 60, w: 860, align: "left", at: r("difference") },
      { text: "2.  an example", x: 150, y: 810, size: 60, w: 840, align: "left", at: r("example") },
      { text: "3.  the notation", x: 150, y: 960, size: 60, w: 840, align: "left", at: r("notation") } ] }),
    <Check dur={d} x={95} y={695} size={76} at={r("difference") + 0.8} />, <Check dur={d} x={95} y={845} size={76} at={r("example") + 0.8} />, <Check dur={d} x={95} y={995} size={76} at={r("notation") + 0.8} />,
  ]),
  // 5a. include: base always uses the included, shared step
  S("first include", (r, d) => [
    <Head dur={d} text="include" y={170} size={130} at={0.3} />,
    ...Sketch({ dur: d, at: r("base"), speed: P, items: [uc("Issue Book", 300, 520, 190)] }),
    ...Sketch({ dur: d, at: r("included"), speed: P, items: [uc("Check Availability", 540, 930, 260), { line: [330, 590, 470, 862], arrow: true }] }),
    ...Sketch({ dur: d, at: r("mandatory"), speed: P, color: C.coral, items: [{ text: "mandatory = always", x: 540, y: 1060, size: 60, w: 980, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("shared"), speed: P, items: [uc("Reserve Book", 780, 520, 190), { line: [750, 590, 610, 862], arrow: true }] }),
    ...Sketch({ dur: d, at: r("reuse") - 0.6, speed: P, color: C.cobalt, items: [{ text: "a shared step, many reuse it", x: 540, y: 1190, size: 56, w: 980, color: C.cobalt }] }),
  ], { hold: "reuse", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "included", x: 540, y: 930, z: 1.03 }] }),
  // 5b. include: notation + example
  S("notation a dashed arrow", (r, d) => [
    ...Sketch({ dur: d, at: 0.2, speed: P, items: [uc("Issue Book", 540, 480), uc("Check Availability", 540, 900, 260)] }),
    ...Sketch({ dur: d, at: r("base"), speed: P, color: C.coral, items: [{ text: "base", x: 160, y: 450, size: 54, w: 240, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("dashed"), speed: P, items: [{ line: [540, 548, 540, 828], arrow: true, dashed: true, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("labeled"), speed: P, color: C.coral, items: [{ text: "<<include>>", x: 580, y: 650, size: 52, w: 380, align: "left", color: C.coral }] }),
    ...Sketch({ dur: d, at: r("included"), speed: P, color: C.coral, items: [{ text: "included", x: 540, y: 985, size: 50, w: 300, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("example"), speed: P, items: [{ text: "Issue Book <<include>> Check Availability", x: 540, y: 1110, size: 50, w: 980 }] }),
    ...Sketch({ dur: d, at: r("part") - 0.6, speed: P, color: C.cobalt, items: [{ text: "arrow points at the part", x: 540, y: 1280, size: 62, w: 980, color: C.cobalt }] }),
  ], { hold: "arrow points at", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "dashed", x: 540, y: 930, z: 1.03 }] }),
  // 6a. extend: extra behaviour, only under a condition
  S("second extend", (r, d) => [
    <Head dur={d} text="extend" y={170} size={130} at={0.3} />,
    ...Sketch({ dur: d, at: r("extending"), speed: P, items: [uc("Pay Fine", 540, 900)] }),
    ...Sketch({ dur: d, at: r("extra"), speed: P, color: C.coral, items: [{ text: "extra behaviour", x: 800, y: 690, size: 50, w: 420, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("base"), speed: P, items: [uc("Return Book", 540, 480)] }),
    ...Sketch({ dur: d, at: r("condition"), speed: P, color: C.cobalt, items: [{ text: "only if overdue", x: 540, y: 1010, size: 56, w: 700, color: C.cobalt }] }),
    <Check dur={d} x={850} y={480} size={80} at={r("complete")} />,
    ...Sketch({ dur: d, at: r("without"), speed: P, items: [{ text: "complete without it", x: 540, y: 1160, size: 58, w: 980 }] }),
  ], { hold: "complete without it", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "extending", x: 540, y: 930, z: 1.03 }] }),
  // 6b. extend: notation + example
  S("notation a dashed arrow", (r, d) => [
    ...Sketch({ dur: d, at: 0.2, speed: P, items: [uc("Return Book", 540, 480), uc("Pay Fine", 540, 900)] }),
    ...Sketch({ dur: d, at: r("dashed"), speed: P, items: [{ line: [540, 828, 540, 548], arrow: true, dashed: true, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("labeled"), speed: P, color: C.cobalt, items: [{ text: "<<extend>>", x: 580, y: 650, size: 52, w: 380, align: "left", color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("extending"), speed: P, color: C.coral, items: [{ text: "extending", x: 180, y: 870, size: 50, w: 300, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("base"), speed: P, color: C.coral, items: [{ text: "base", x: 160, y: 450, size: 54, w: 240, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("example"), speed: P, items: [{ text: "Pay Fine <<extend>> Return Book", x: 540, y: 1060, size: 52, w: 980 }] }),
    ...Sketch({ dur: d, at: r("overdue"), speed: P, color: C.coral, items: [{ text: "only if overdue", x: 540, y: 1180, size: 56, w: 700, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("optional"), speed: P, color: C.cobalt, items: [{ text: "arrow points at the base", x: 540, y: 1300, size: 62, w: 980, color: C.cobalt }] }),
  ], { n: 2, hold: "arrow points at", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "dashed", x: 540, y: 930, z: 1.03 }] }),
  // 7. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
      "<<include>>: mandatory. Dashed arrow from the base use case to the included use case.",
      "Example: Issue Book <<include>> Check Availability.",
      "<<extend>>: optional, only if a condition is true. Dashed arrow from the extending use case to the base.",
      "Example: Pay Fine <<extend>> Return Book (only if overdue)." ],
      times: [r("mandatory"), r("issue book"), r("optional"), r("pay fine")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 8. memory trick + payoff
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, speed: P, items: [
      { text: "include = ALWAYS", x: 540, y: 560, size: 76, w: 960 }, { line: [140, 700, 940, 700], color: C.coral },
      { text: "extend = SOMETIMES", x: 540, y: 810, size: 76, w: 960, at: r("sometimes") - 0.8 }, { line: [140, 950, 940, 950], color: C.cobalt },
      { text: "5 marks", x: 540, y: 1060, size: 150, w: 900, at: r("five") } ] }),
    <Check dur={d} x={540} y={1420} size={170} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 780, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.05 }] }),
];
