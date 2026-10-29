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
// stick figure centred at (cx, cy0 = head centre); name optional
const fig = (cx, cy, name, size = 38) => [
  { oval: [cx, cy, 34, 34] }, { line: [cx, cy + 34, cx, cy + 140] }, { line: [cx - 55, cy + 70, cx + 55, cy + 70] },
  { line: [cx, cy + 140, cx - 45, cy + 220] }, { line: [cx, cy + 140, cx + 45, cy + 220] },
  ...(name ? [{ text: name, x: cx, y: cy + 235, size, w: 230, color: "#E0352B" }] : []) ];
const RY = { search: 500, reserve: 640, issue: 780, check: 940, ret: 1100, calc: 1260, manage: 1420 };
const ov = (name, y) => ({ oval: [540, y, 210, 50], label: name, size: 34 });
const BOARD = [{ rect: [250, 330, 580, 1170] }, { text: "Library system", x: 540, y: 345, size: 44, w: 520, color: "#1F5FD1" }, ...fig(125, 730, "Student"), ...fig(935, 930, "Librarian")];
const ST = [185, 800], LB = [875, 1000];
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Draw a Use Case Diagram for a Library Management System (search, issue, return, reserve books; librarian manages records; fines for overdue books). Identify actors and use cases, with at least one <<include>>.", n: 5, marks: 5, y: 400 }),
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "include", x: 540, y: 780, z: 1.03 }] }),
  // 2. from zero: a vending machine
  S("think of a vending", (r, d) => [
    ...Sketch({ dur: d, at: 0.2, items: [{ rect: [300, 480, 700, 600] }, { text: "vending machine", x: 650, y: 500, size: 46, w: 600, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("people"), items: fig(130, 690) }),
    ...Sketch({ dur: d, at: r("buy"), items: [{ oval: [650, 690, 230, 62], label: "buy a drink", size: 46 }, { line: [190, 760, 420, 700], arrow: true, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("change"), items: [{ oval: [650, 880, 230, 62], label: "get change", size: 46 }, { line: [190, 760, 420, 870], arrow: true, color: C.cobalt }] }),
  ], { hold: "get change", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "inside", x: 540, y: 910, z: 1.03 }] }),
  // 3. the same picture = a use case diagram
  S("a use case diagram is", (r, d) => [
    still(d, [{ rect: [300, 480, 700, 600] }, { text: "vending machine", x: 650, y: 500, size: 46, w: 600, color: C.cobalt }, ...fig(130, 690),
      { oval: [650, 690, 230, 62], label: "buy a drink", size: 46 }, { oval: [650, 880, 230, 62], label: "get change", size: 46 },
      { line: [190, 760, 420, 700], arrow: true, color: C.cobalt }, { line: [190, 760, 420, 870], arrow: true, color: C.cobalt }]),
    ...Sketch({ dur: d, at: r("actors"), color: C.coral, items: [{ text: "actor", x: 130, y: 925, size: 54, w: 220, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("use cases"), color: C.coral, items: [{ text: "use cases", x: 650, y: 985, size: 46, w: 400, color: C.coral }, { line: [650, 985, 650, 948], arrow: true, color: C.coral }] }),
    ...Sketch({ dur: d, at: r("boundary") - 0.3, color: C.coral, items: [{ text: "system boundary", x: 650, y: 350, size: 52, w: 600, color: C.coral }, { line: [650, 422, 650, 474], arrow: true, color: C.coral }] }),
  ], { hold: "boundary", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "use cases", x: 540, y: 910, z: 1.03 }] }),
  // 4. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  the actors", x: 150, y: 720, size: 60, w: 860, align: "left", at: r("actors") },
      { text: "2.  the use cases", x: 150, y: 870, size: 60, w: 860, align: "left", at: r("use") },
      { text: "3.  an include", x: 150, y: 1020, size: 60, w: 860, align: "left", at: r("include") } ] }),
    <Check dur={d} x={95} y={755} size={80} at={r("actors") + 1.0} />, <Check dur={d} x={95} y={905} size={80} at={r("use") + 1.0} />, <Check dur={d} x={95} y={1055} size={80} at={r("include") + 1.0} />,
  ]),
  // 5. step 1: actors
  S("first the actors", (r, d) => [
    ...Sketch({ dur: d, at: 0.2, items: [{ rect: [250, 330, 580, 1170] }, { text: "Library system", x: 540, y: 345, size: 44, w: 520, color: C.cobalt }] }),
    ...Sketch({ dur: d, at: r("student"), items: fig(125, 730, "Student") }),
    ...Sketch({ dur: d, at: r("librarian"), items: fig(935, 930, "Librarian") }),
  ], { hold: "actors are", holdY: 940, cam: [{ t: 0, x: 540, y: 940, z: 1.0 }, { t: "student", x: 540, y: 950, z: 1.02 }] }),
  // 6. step 2: use cases + lines
  S("next the use", (r, d) => [
    still(d, BOARD),
    ...Sketch({ dur: d, at: r("search"), speed: 3800, items: [ov("Search Book", RY.search)] }),
    ...Sketch({ dur: d, at: r("reserve"), speed: 3800, items: [ov("Reserve Book", RY.reserve)] }),
    ...Sketch({ dur: d, at: r("issue"), speed: 3800, items: [ov("Issue Book", RY.issue)] }),
    ...Sketch({ dur: d, at: r("return"), speed: 3800, items: [ov("Return Book", RY.ret)] }),
    ...Sketch({ dur: d, at: r("student") + 0.5, speed: 3800, color: C.cobalt, items: [RY.search, RY.reserve, RY.issue, RY.ret].map(y => ({ line: [ST[0], ST[1], 330, y], arrow: true, color: C.cobalt })) }),
    ...Sketch({ dur: d, at: r("also"), speed: 3800, color: C.coral, items: [RY.issue, RY.ret].map(y => ({ line: [LB[0], LB[1], 750, y], arrow: true, color: C.coral })) }),
    ...Sketch({ dur: d, at: r("records"), speed: 3800, items: [ov("Manage Records", RY.manage), { line: [LB[0], LB[1], 750, RY.manage], arrow: true, color: C.coral }] }),
  ], { hold: "each thing", holdY: 940, cam: [{ t: 0, x: 540, y: 940, z: 1.0 }, { t: "student", x: 540, y: 950, z: 1.02 }] }),
  // 7. step 3: include
  S("now the include", (r, d) => [
    still(d, BOARD),
    still(d, [ov("Search Book", RY.search), ov("Reserve Book", RY.reserve), ov("Issue Book", RY.issue), ov("Return Book", RY.ret), ov("Manage Records", RY.manage),
      ...[RY.search, RY.reserve, RY.issue, RY.ret].map(y => ({ line: [ST[0], ST[1], 330, y], arrow: true, color: C.cobalt })),
      ...[RY.issue, RY.ret, RY.manage].map(y => ({ line: [LB[0], LB[1], 750, y], arrow: true, color: C.coral }))]),
    ...Sketch({ dur: d, at: r("available"), speed: 3800, items: [ov("Check Availability", RY.check)] }),
    ...Sketch({ dur: d, at: r("includes"), speed: 3800, color: C.coral, items: [{ line: [540, 830, 540, 888], dashed: true, arrow: true, color: C.coral }, { text: "<<include>>", x: 570, y: 836, size: 34, w: 260, align: "left", color: C.coral }] }),
    ...Sketch({ dur: d, at: r("calculating"), speed: 3800, items: [ov("Calculate Fine", RY.calc)] }),
    ...Sketch({ dur: d, at: r("fine") + 0.3, speed: 3800, color: C.coral, items: [{ line: [540, 1150, 540, 1208], dashed: true, arrow: true, color: C.coral }, { text: "<<include>>", x: 570, y: 1156, size: 34, w: 260, align: "left", color: C.coral }] }),
  ], { hold: "means always", holdY: 940, cam: [{ t: 0, x: 540, y: 940, z: 1.0 }, { t: "includes", x: 540, y: 950, z: 1.02 }] }),
  // 8. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
      "Actors: Student, Librarian.",
      "Use cases: Search Book, Reserve Book, Issue Book, Return Book, Manage Records.",
      "Issue Book <<include>> Check Availability.",
      "Return Book <<include>> Calculate Fine (zero if returned on time)." ],
      times: [r("actors"), r("use"), r("includes"), r("calculate")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 9. memory trick + payoff
  S("to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "actors = outside", x: 540, y: 520, size: 72, w: 960 }, { line: [140, 650, 940, 650], color: C.coral },
      { text: "ovals = inside", x: 540, y: 740, size: 72, w: 960, at: r("ovals") }, { line: [140, 870, 940, 870], color: C.cobalt },
      { text: "include = ALWAYS", x: 540, y: 960, size: 72, w: 960, at: r("include") }, { line: [140, 1090, 940, 1090], color: C.coral },
      { text: "5 marks", x: 540, y: 1180, size: 150, w: 900, at: r("five") } ] }),
    <Check dur={d} x={540} y={1500} size={170} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.05 }] }),
];
