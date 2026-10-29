import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
import { C as TC } from "./theme.jsx";
import { bb, textW } from "./prims.jsx";
// still(d, items): the same drawing items as Sketch, but already on the board (no pen, no sound, no delay)
const SW = 1080, SH = 1920;
function still(d, items) {
  const col = TC.line, out = []; let k = 0, parent = null;
  const P = (dd, w = 6, c = col, dash) => out.push(<path key={k++} d={dd} x={0} y={0} width={SW} height={SH} stroke={{ width: w, color: c, cap: "round" }} dash={dash} />);
  const T = (s, x, y, size, w, c, align = "center") => { const fs = Math.round(size * TC.bScale); out.push(<text key={k++} x={align === "center" ? x - w / 2 : x} y={y} width={w} align={align} fontFamily={TC.fBody} fontWeight={TC.wBody} fontSize={fs} color={c}>{s}</text>);
    const ew = textW(s, fs, TC.fBody), nl = Math.ceil(ew / w), bw = Math.min(w, ew); bb({ k: "stext", n: s, x: align === "center" ? x - bw / 2 : x, y: y + fs * 0.1, w: bw, h: fs * 1.15 * nl, t0: 0, t1: d, parent }); };
  items.forEach(it => {
    if (it.rect) { const [x, y, w, h] = it.rect; const id = "r" + Math.round(x) + "_" + Math.round(y) + "_" + Math.round(globalThis.__T0 || 0); bb({ k: "srect", n: it.label || "rect", x, y, w, h, t0: 0, t1: d, id }); parent = id;
      P(`M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`, 7);
      if (it.divider) it.divider.forEach(dy => P(`M ${x} ${y + dy} L ${x + w} ${y + dy}`, 5));
      if (it.label) { const lf = (it.size || 56) * TC.bScale; T(it.label, x + w / 2, y + (it.divider ? it.divider[0] / 2 : h / 2) - lf * 0.62, it.size || 56, w - 20, TC.navy); } parent = null; }
    else if (it.line) { const [x1, y1, x2, y2] = it.line; const c = it.color || col; P(`M ${x1} ${y1} L ${x2} ${y2}`, 6, c, it.dashed ? [18, 14] : undefined);
      if (it.arrow) { const a = Math.atan2(y2 - y1, x2 - x1), L = 30; P(`M ${x2} ${y2} L ${x2 - L * Math.cos(a - 0.5)} ${y2 - L * Math.sin(a - 0.5)} M ${x2} ${y2} L ${x2 - L * Math.cos(a + 0.5)} ${y2 - L * Math.sin(a + 0.5)}`, 6, c); } }
    else if (it.oval) { const [cx, cy, rx, ry] = it.oval; const id = "o" + cx + "_" + cy; if (it.label) { bb({ k: "soval", n: it.label, x: cx - rx, y: cy - ry, w: rx * 2, h: ry * 2, t0: 0, t1: d, id }); parent = id; }
      const n = 14; let dd = ""; for (let i = 0; i <= n; i++) { const a = i / n * 6.283; dd += (i ? " L " : "M ") + (cx + rx * Math.cos(a)) + " " + (cy + ry * Math.sin(a)); } P(dd + " Z", 6);
      if (it.label) T(it.label, cx, cy - 30, it.size || 48, rx * 2 - 30, TC.navy); parent = null; }
    else if (it.text) T(it.text, it.x, it.y, it.size || 58, it.w || 700, it.color || TC.navy, it.align || "center");
  });
  return <frame at={0} duration={d} width={SW} height={SH} layout="none" key="still">{out}</frame>;
}
const FAST = 99999;
// panel headers + divider (already on the board in every comparison scene)
const hdr = (C) => [{ text: "class diagram", x: 290, y: 250, size: 54, w: 500 }, { text: "sequence diagram", x: 790, y: 250, size: 48, w: 440 }, { line: [550, 320, 550, 1030], color: C.cobalt }];
const LX = [675, 920];                       // sequence panel lifelines
const seqHeads = (hh = 100) => [{ rect: [575, 420, 200, hh], label: "Student", size: 34 }, { rect: [820, 420, 200, hh], label: "Librarian", size: 34 }];
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Differentiate between a UML Class Diagram and a UML Sequence Diagram (purpose, elements, representation) with an example.", n: 6, marks: 5, y: 440 }),
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "example", x: 540, y: 800, z: 1.02 }] }),
  // 2. from zero: the architect's floor plan (structure, no time)
  S("picture a school", (r, d) => [
    ...Sketch({ dur: d, at: r("floor"), items: [
      { line: [140, 450, 940, 450] }, { line: [940, 450, 940, 950] }, { line: [940, 950, 140, 950] }, { line: [140, 950, 140, 450] },
      { line: [540, 450, 540, 620] }, { line: [540, 700, 540, 950] }, { line: [540, 780, 940, 780] } ] }),
    ...Sketch({ dur: d, at: r("rooms"), items: [{ text: "room", x: 340, y: 660, size: 46, w: 300 }, { text: "room", x: 740, y: 560, size: 46, w: 300 }, { text: "room", x: 740, y: 840, size: 46, w: 300 }] }),
    ...Sketch({ dur: d, at: r("connect"), color: C.cobalt, items: [{ line: [440, 660, 640, 660], arrow: true, color: C.cobalt }] }),
    <Head dur={d} text="floor plan" y={170} size={130} at={r("architect's")} />,
    <Ico dur={d} ctx={ctx} name="clock" x={540} y={1130} size={120} at={r("never")} />,
    <XMark dur={d} x={540} y={1130} size={150} at={r("never") + 0.5} />,
    ...Sketch({ dur: d, at: r("shows") + 1.0, color: C.coral, items: [{ text: "no time", x: 540, y: 1250, size: 66, w: 700, color: C.coral }] }),
  ], { hold: "never shows", holdY: 940, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "rooms", x: 540, y: 930, z: 1.03 }] }),
  // 3. CCTV footage of one morning (events in order)
  S("now picture", (r, d) => [
    <Ico dur={d} ctx={ctx} name="cctv" x={540} y={310} size={150} at={0.2} />,
    ...Sketch({ dur: d, at: r("footage"), items: [{ rect: [60, 520, 300, 300] }, { rect: [390, 520, 300, 300] }, { rect: [720, 520, 300, 300] }] }),
    <Ico dur={d} ctx={ctx} name="user-round" x={150} y={730} size={90} color={C.cobalt} at={r("who")} on />,
    <Ico dur={d} ctx={ctx} name="user-round" x={540} y={675} size={90} color={C.cobalt} at={r("where")} on />,
    <Ico dur={d} ctx={ctx} name="user-round" x={930} y={610} size={90} color={C.cobalt} at={r("order")} on />,
    <Arrow dur={d} x1={60} y1={880} x2={1020} y2={880} color={C.cobalt} width={9} at={r("order")} />,
    ...Sketch({ dur: d, at: r("order") + 0.3, color: C.cobalt, items: [{ text: "time", x: 540, y: 905, size: 50, w: 300, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("floor"), items: [{ text: "floor plan = class diagram", x: 540, y: 1100, size: 62, w: 980 }] }),
    ...Sketch({ dur: d, at: r("footage") + 5.5, items: [{ text: "footage = sequence diagram", x: 540, y: 1220, size: 62, w: 980, color: C.coral }] }),
  ], { hold: "sequence diagram", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "where", x: 540, y: 920, z: 1.03 }] }),
  // 4. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, speed: 3800, items: [
      { text: "the question wants:", x: 540, y: 460, size: 80, w: 960 },
      { text: "1.  purpose", x: 150, y: 640, size: 58, w: 860, align: "left" },
      { text: "2.  elements", x: 150, y: 780, size: 58, w: 860, align: "left" },
      { text: "3.  representation", x: 150, y: 920, size: 58, w: 860, align: "left" },
      { text: "+  an example", x: 150, y: 1060, size: 58, w: 860, align: "left", color: C.coral } ] }),
  ]),
  // 5. difference 1: purpose
  S("first purpose", (r, d) => [
    still(d, hdr(C)),
    ...Sketch({ dur: d, at: r("class"), speed: 3600, items: [{ rect: [120, 420, 340, 110], label: "Student", size: 50 }, { rect: [120, 700, 340, 110], label: "IssueRecord", size: 46 }, { line: [290, 530, 290, 700] }] }),
    ...Sketch({ dur: d, at: r("static"), speed: 3600, color: C.coral, items: [{ text: "static structure", x: 290, y: 870, size: 50, w: 440, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("sequence"), speed: 3600, items: [...seqHeads(), { line: [675, 520, 675, 800], dashed: true }, { line: [920, 520, 920, 800], dashed: true }, { line: [675, 640, 920, 640], arrow: true, label: "issueBook()", size: 30 }] }),
    ...Sketch({ dur: d, at: r("dynamic"), speed: 3600, color: C.coral, items: [{ text: "dynamic behaviour", x: 790, y: 870, size: 46, w: 440, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("structure") + 0.2, speed: 3600, items: [{ text: "structure  vs  behaviour", x: 540, y: 1100, size: 70, w: 980 }] }),
  ], { hold: "structure versus", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "sequence", x: 540, y: 920, z: 1.03 }] }),
  // 6. difference 2: elements
  S("second elements", (r, d) => [
    still(d, hdr(C)),
    ...Sketch({ dur: d, at: r("classes"), speed: 3600, items: [{ rect: [120, 420, 340, 330] }, { line: [120, 500, 460, 500] }, { line: [120, 620, 460, 620] }, { text: "Student", x: 290, y: 425, size: 46, w: 300 }] }),
    ...Sketch({ dur: d, at: r("attributes"), speed: 3600, items: [{ text: "- name", x: 145, y: 520, size: 36, w: 300, align: "left" }, { text: "+ borrow()", x: 145, y: 640, size: 36, w: 300, align: "left" }] }),
    ...Sketch({ dur: d, at: r("associations"), speed: 3600, color: C.coral, items: [{ text: "classes, attributes, methods + associations", x: 290, y: 800, size: 38, w: 440, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("objects"), speed: 3600, items: seqHeads() }),
    ...Sketch({ dur: d, at: r("lifelines"), speed: 3600, items: [{ line: [675, 520, 675, 780], dashed: true }, { line: [920, 520, 920, 780], dashed: true }] }),
    ...Sketch({ dur: d, at: r("messages"), speed: 3600, items: [{ line: [675, 640, 920, 640], arrow: true, label: "message", size: 30 }] }),
    ...Sketch({ dur: d, at: r("messages") + 0.8, speed: 3600, color: C.coral, items: [{ text: "objects, lifelines, messages", x: 790, y: 800, size: 38, w: 440, color: C.coral }] }),
  ], { hold: "three part", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "objects", x: 540, y: 920, z: 1.03 }] }),
  // 7. difference 3: representation
  S("third representation", (r, d) => [
    still(d, hdr(C)),
    ...Sketch({ dur: d, at: r("class"), speed: 3600, items: [{ rect: [120, 420, 340, 110], label: "Student", size: 50 }, { rect: [120, 700, 340, 110], label: "IssueRecord", size: 46 }, { line: [290, 530, 290, 700] }] }),
    <Ico dur={d} ctx={ctx} name="clock" x={290} y={960} size={110} at={r("time")} />,
    <XMark dur={d} x={290} y={960} size={140} at={r("time") + 0.5} />,
    ...Sketch({ dur: d, at: r("sequence"), speed: 3600, items: [...seqHeads(), { line: [675, 520, 675, 900], dashed: true }, { line: [920, 520, 920, 900], dashed: true }] }),
    ...Sketch({ dur: d, at: r("top"), speed: 3600, items: [{ line: [675, 620, 920, 620], arrow: true }, { line: [920, 760, 675, 760], arrow: true, dashed: true, color: C.cobalt }] }),
    <Arrow dur={d} x1={1005} y1={540} x2={1005} y2={890} color={C.cobalt} width={9} at={r("flows")} />,
    ...Sketch({ dur: d, at: r("flows") + 0.3, speed: 3600, color: C.cobalt, items: [{ text: "time", x: 950, y: 920, size: 46, w: 160, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("time") + 0.9, speed: 3600, color: C.coral, items: [{ text: "no time", x: 290, y: 1050, size: 60, w: 440, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("flows") + 0.8, speed: 3600, color: C.coral, items: [{ text: "time runs downwards", x: 790, y: 1010, size: 46, w: 440, color: C.coral }] }),
  ], { hold: "no time versus", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "sequence", x: 540, y: 920, z: 1.03 }] }),
  // 8. the example from the library
  S("now the example", (r, d) => [
    still(d, hdr(C)),
    ...Sketch({ dur: d, at: r("student"), speed: 3600, items: [{ rect: [120, 420, 340, 110], label: "Student", size: 50 }, { rect: [120, 720, 340, 110], label: "IssueRecord", size: 46 }, { line: [290, 530, 290, 720] }] }),
    ...Sketch({ dur: d, at: r("many") - 0.8, speed: 3600, color: C.cobalt, items: [{ text: "1", x: 330, y: 540, size: 44, w: 100, color: C.cobalt }, { text: "0..*", x: 340, y: 640, size: 44, w: 120, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("sequence"), speed: 3600, items: [...seqHeads(), { line: [675, 520, 675, 900], dashed: true }, { line: [920, 520, 920, 900], dashed: true }] }),
    ...Sketch({ dur: d, at: r("sends"), speed: 3600, items: [{ line: [675, 640, 920, 640], arrow: true, label: "issueBook()", size: 30 }] }),
    ...Sketch({ dur: d, at: r("hands"), speed: 3600, items: [{ line: [920, 780, 675, 780], arrow: true, dashed: true, color: C.cobalt, label: "book", size: 30 }] }),
    ...Sketch({ dur: d, at: r("hands") + 1.0, speed: 3600, color: C.coral, items: [{ text: "linked, no time", x: 290, y: 900, size: 50, w: 440, color: C.coral }, { text: "who sends what, when", x: 790, y: 960, size: 44, w: 440, color: C.coral }] }),
  ], { hold: "book back", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "sequence", x: 540, y: 920, z: 1.03 }] }),
  // 9. the exam answer = a table
  S("so in your exam", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, speed: 3800, items: [
      { text: "class diagram", x: 417, y: 190, size: 40, w: 380 }, { text: "sequence diagram", x: 832, y: 190, size: 40, w: 380 },
      { line: [40, 270, 1040, 270] }, { line: [40, 500, 1040, 500] }, { line: [40, 740, 1040, 740] }, { line: [40, 980, 1040, 980] }, { line: [40, 1220, 1040, 1220] },
      { line: [210, 190, 210, 1220] }, { line: [625, 190, 625, 1220] } ] }),
    ...[["Purpose", "static structure\nof the system", "dynamic behaviour:\nmessages in\ntime order", 300, "purpose"],
        ["Elements", "classes, attributes,\nmethods,\nassociations", "objects, lifelines,\nmessages", 530, "elements"],
        ["Shown as", "boxes joined\nby lines,\nno time", "lifelines and\narrows, time\nflows down", 770, "representation"],
        ["Example", "Student 1 to\n0..* IssueRecord", "Student sends\nissueBook() to\nLibrarian", 1010, "example"]].flatMap(([h, a, b, y, cue]) => [
      <Label key={h} dur={d} text={h} x={125} y={y + 40} w={170} size={34} color={C.coral} at={r(cue)} />,
      ...a.split("\n").map((ln, i) => <Label key={h + "a" + i} dur={d} text={ln} x={417} y={y + i * 52} w={395} size={32} at={r(cue) + 0.2 + i * 0.1} />),
      ...b.split("\n").map((ln, i) => <Label key={h + "b" + i} dur={d} text={ln} x={832} y={y + i * 52} w={395} size={32} at={r(cue) + 0.4 + i * 0.1} />)]),
  ], { cam: [{ t: 0, x: 540, y: 740, z: 1.0 }, { t: 1, x: 540, y: 740, z: 1.0 }] }),
  // 10. memory trick + payoff
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "class = the MAP", x: 590, y: 560, size: 66, w: 800 }, { line: [140, 690, 940, 690], color: C.coral },
      { text: "sequence = the MOVIE", x: 590, y: 800, size: 66, w: 800, at: r("sequence") }, { line: [140, 930, 940, 930], color: C.cobalt },
      { text: "5 marks", x: 540, y: 1060, size: 150, w: 900, at: r("five") } ] }),
    <Ico dur={d} ctx={ctx} name="map" x={130} y={610} size={110} at={0.3} />,
    <Ico dur={d} ctx={ctx} name="clapperboard" x={130} y={850} size={110} at={r("sequence")} />,
    <Check dur={d} x={540} y={1420} size={180} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.05 }] }),
];
