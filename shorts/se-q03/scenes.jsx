import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
const FAST = 99999;
const X = [190, 540, 890];
// the floor plan of a house (outer wall with a front-door gap, one inner wall with a door gap)
const plan = (d, at, speed) => Sketch({ dur: d, at, speed, items: [
  { line: [140, 450, 940, 450] }, { line: [940, 450, 940, 950] }, { line: [940, 950, 360, 950] }, { line: [260, 950, 140, 950] }, { line: [140, 950, 140, 450] },
  { line: [540, 450, 540, 600] }, { line: [540, 680, 540, 950] }, { line: [540, 780, 940, 780] } ] });
const dot = (d, x, y, r, at, fill) => <Layer dur={d} at={at} sfx="pop" anim={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.12 }]}>
  <rect x={x - r} y={y - r} width={r * 2} height={r * 2} radius={r} fill={fill ? C_NAVY[0] : "#00000000"} strokeColor={C_NAVY[0]} strokeWidth={6} /></Layer>;
const C_NAVY = ["#1C1F26"];
export const SCENES = ({ S, ctx, C }) => { C_NAVY[0] = C.navy; return [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Name any three UML diagrams used to represent the behavioural view of a system. Briefly explain the purpose of each.", n: 3, marks: 5, y: 520 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "three", x: 540, y: 800, z: 1.03 }] }),
  // 2. from zero: a house floor plan = the structure
  S("imagine a house", (r, d) => [
    <Head dur={d} text="floor plan" y={170} size={130} at={r("floor")} />,
    ...plan(d, 0.2, 2600),
    ...Sketch({ dur: d, at: r("rooms"), items: [{ text: "room", x: 340, y: 800, size: 46, w: 300 }, { text: "room", x: 740, y: 560, size: 46, w: 300 }, { text: "room", x: 740, y: 850, size: 46, w: 300 }] }),
    ...Sketch({ dur: d, at: r("walls"), items: [{ text: "wall", x: 540, y: 345, size: 46, w: 200 }, { line: [540, 415, 540, 455], arrow: true }] }),
    ...Sketch({ dur: d, at: r("doors"), items: [{ text: "door", x: 310, y: 1040, size: 46, w: 200 }, { line: [310, 1030, 310, 965], arrow: true }] }),
    ...Sketch({ dur: d, at: r("structural"), color: C.coral, items: [{ text: "structure = what EXISTS", x: 540, y: 1220, size: 64, w: 960, color: C.coral }] }),
  ], { hold: "structural view", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "rooms", x: 540, y: 900, z: 1.03 }, { t: "doors", x: 540, y: 920, z: 1.03 }] }),
  // 3. life inside the house = behaviour
  S("but a floor plan", (r, d) => [
    ...plan(d, 0.1, FAST),
    <Ico dur={d} ctx={ctx} name="user-round" x={310} y={1090} size={110} color={C.cobalt} at={r("walks")} />,
    ...Sketch({ dur: d, at: r("walks") + 0.3, color: C.cobalt, items: [{ line: [310, 1015, 310, 850], arrow: true, dashed: true, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("walks") + 0.9, color: C.coral, items: [{ text: "who walks in?", x: 700, y: 1060, size: 54, w: 600, color: C.coral }] }),
    <Ico dur={d} ctx={ctx} name="user-round" x={320} y={640} size={100} at={r("talks")} />,
    <Ico dur={d} ctx={ctx} name="user-round" x={760} y={640} size={100} at={r("talks") + 0.3} />,
    <Ico dur={d} ctx={ctx} name="message-circle" x={540} y={640} size={80} color={C.coral} at={r("talks") + 0.6} on />,
    ...Sketch({ dur: d, at: r("talks") + 0.9, color: C.coral, items: [{ text: "who talks to whom?", x: 700, y: 1150, size: 54, w: 600, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("next") + 0.2, color: C.coral, items: [{ text: "what happens next?", x: 700, y: 1240, size: 54, w: 600, color: C.coral }] }),
    <Head dur={d} text="behavioural view" y={170} size={130} at={r("behavioral")} />,
  ], { hold: "behavioral view", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "talks", x: 540, y: 920, z: 1.03 }, { t: "next", x: 540, y: 930, z: 1.03 }] }),
  // 4. recap
  S("so behavioral diagrams", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "structural = what exists", x: 540, y: 620, size: 66, w: 960 }, { line: [140, 750, 940, 750], color: C.cobalt },
      { text: "behavioural = what it DOES", x: 540, y: 850, size: 70, w: 960, at: r("does") - 0.5, color: C.coral }, { line: [140, 990, 940, 990], color: C.coral } ] }),
  ]),
  // 5. what the question wants
  S("the question wants", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  three diagrams", x: 150, y: 720, size: 60, w: 860, align: "left", at: r("three") },
      { text: "2.  one purpose each", x: 150, y: 880, size: 60, w: 840, align: "left", at: r("purpose") } ] }),
    <Check dur={d} x={95} y={755} size={80} at={r("three") + 1.0} />,
    <Check dur={d} x={95} y={915} size={80} at={r("purpose") + 1.0} />,
  ]),
  // 6. diagram 1: use case
  S("the use case diagram", (r, d) => [
    <Head dur={d} text="1 · use case" y={170} size={120} at={0.3} />,
    ...Sketch({ dur: d, speed: 3800, at: r("stick"), items: [
      { oval: [130, 660, 36, 36] }, { line: [130, 696, 130, 810] }, { line: [70, 740, 190, 740] }, { line: [130, 810, 85, 890] }, { line: [130, 810, 175, 890] },
      { text: "actor", x: 130, y: 910, size: 50, w: 200, color: C.coral } ] }),
    ...Sketch({ dur: d, speed: 3800, at: r("ovals"), items: [
      { rect: [300, 420, 700, 800] },
      { text: "library system", x: 650, y: 440, size: 48, w: 560, color: C.cobalt },
      { oval: [650, 640, 240, 70], label: "Borrow book", size: 44 },
      { oval: [650, 830, 240, 70], label: "Return book", size: 44 },
      { oval: [650, 1020, 240, 70], label: "Search book", size: 44 } ] }),
    ...Sketch({ dur: d, speed: 3800, at: r("them"), color: C.cobalt, items: [
      { line: [190, 740, 410, 650], arrow: true, color: C.cobalt }, { line: [190, 740, 410, 830], arrow: true, color: C.cobalt }, { line: [190, 740, 410, 1010], arrow: true, color: C.cobalt } ] }),
    ...Sketch({ dur: d, speed: 3800, at: r("purpose"), color: C.coral, items: [{ text: "purpose: what users want", x: 540, y: 1270, size: 62, w: 960, color: C.coral }] }),
    ...Sketch({ dur: d, speed: 3800, at: r("who") + 0.1, items: [{ text: "who wants what?", x: 540, y: 1380, size: 66, w: 960 }] }),
  ], { hold: "who wants", holdY: 880, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "ovals", x: 540, y: 920, z: 1.03 }, { t: "purpose", x: 540, y: 930, z: 1.03 }] }),
  // 7. diagram 2: sequence
  S("the sequence diagram", (r, d) => [
    <Head dur={d} text="2 · sequence" y={170} size={120} at={0.3} />,
    ...Sketch({ dur: d, speed: 3800, at: r("objects"), items: X.map((x, i) => ({ rect: [x - 140, 340, 280, 110], label: ["Student", "Librarian", "LMS"][i], size: 48 })) }),
    ...Sketch({ dur: d, speed: 3800, at: r("row") + 0.4, items: X.map(x => ({ line: [x, 450, x, 1030], dashed: true })) }),
    ...Sketch({ dur: d, speed: 3800, at: r("arrows"), items: [{ line: [190, 560, 540, 560], arrow: true, label: "requestBook()", size: 36 }, { line: [540, 700, 890, 700], arrow: true, label: "isAvailable()", size: 36 }, { line: [890, 840, 540, 840], arrow: true, dashed: true, label: "available", size: 36, color: C.cobalt }] }),
    <Arrow dur={d} x1={1015} y1={520} x2={1015} y2={960} color={C.cobalt} width={9} at={r("time")} />,
    ...Sketch({ dur: d, speed: 3800, at: r("time") + 0.2, color: C.cobalt, items: [{ text: "time", x: 975, y: 985, size: 46, w: 160, color: C.cobalt }] }),
    ...Sketch({ dur: d, speed: 3800, at: r("purpose"), color: C.coral, items: [{ text: "purpose: how objects collaborate", x: 540, y: 1120, size: 48, w: 980, color: C.coral }] }),
    ...Sketch({ dur: d, speed: 3800, at: r("who") + 0.1, items: [{ text: "who talks to whom, and when?", x: 540, y: 1260, size: 56, w: 980 }] }),
  ], { hold: "who talks", holdY: 880, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "arrows", x: 540, y: 920, z: 1.03 }, { t: "purpose", x: 540, y: 930, z: 1.03 }] }),
  // 8. diagram 3: activity
  S("the activity diagram", (r, d) => [
    <Head dur={d} text="3 · activity" y={170} size={120} at={0.3} />,
    dot(d, 440, 380, 24, r("start"), true),
    ...Sketch({ dur: d, speed: 3800, at: r("steps"), items: [{ line: [440, 410, 440, 470], arrow: true }, { rect: [290, 470, 300, 100], label: "search book", size: 44 }, { line: [440, 570, 440, 640], arrow: true }] }),
    ...Sketch({ dur: d, speed: 3800, at: r("decision"), items: [{ line: [440, 640, 590, 740] }, { line: [590, 740, 440, 840] }, { line: [440, 840, 290, 740] }, { line: [290, 740, 440, 640] }, { text: "available?", x: 440, y: 705, size: 42, w: 240 }] }),
    ...Sketch({ dur: d, speed: 3800, at: r("end") - 0.4, items: [
      { line: [440, 840, 440, 940], arrow: true }, { text: "yes", x: 500, y: 870, size: 42, w: 120, color: C.coral },
      { rect: [290, 940, 300, 100], label: "issue book", size: 44 }, { line: [440, 1040, 440, 1120], arrow: true } ] }),
    dot(d, 440, 1160, 38, r("end") + 0.4, false), dot(d, 440, 1160, 20, r("end") + 0.5, true),
    ...Sketch({ dur: d, speed: 3800, at: r("end") + 0.8, items: [
      { line: [590, 740, 870, 740], arrow: true }, { text: "no", x: 730, y: 680, size: 42, w: 120, color: C.coral },
      { line: [870, 740, 870, 940], arrow: true }, { rect: [740, 940, 260, 100], label: "reserve", size: 44 },
      { line: [870, 1040, 870, 1160] }, { line: [870, 1160, 480, 1160], arrow: true } ] }),
    ...Sketch({ dur: d, speed: 3800, at: r("workflow") - 0.5, color: C.coral, items: [{ text: "purpose: model the workflow", x: 540, y: 1290, size: 60, w: 980, color: C.coral }] }),
  ], { hold: "what happens", holdY: 880, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "decision", x: 540, y: 920, z: 1.02 }, { t: "workflow", x: 540, y: 930, z: 1.03 }] }),
  // 9. exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
      "Use case diagram: shows actors and the functions (use cases) they use. Purpose: capture what users want from the system.",
      "Sequence diagram: shows messages between objects in time order. Purpose: how objects collaborate in one scenario.",
      "Activity diagram: a flowchart of steps and decisions. Purpose: model the workflow." ],
      times: [r("use"), r("sequence"), r("activity")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 10. memory trick + payoff
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "use case = WHO", x: 540, y: 520, size: 72, w: 960 }, { line: [140, 650, 940, 650], color: C.coral },
      { text: "sequence = WHEN", x: 540, y: 740, size: 72, w: 960, at: r("when") }, { line: [140, 870, 940, 870], color: C.cobalt },
      { text: "activity = HOW", x: 540, y: 960, size: 72, w: 960, at: r("how") }, { line: [140, 1090, 940, 1090], color: C.coral },
      { text: "5 marks", x: 540, y: 1180, size: 150, w: 900, at: r("five") } ] }),
    <Check dur={d} x={540} y={1500} size={170} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.05 }] }),
]; };
