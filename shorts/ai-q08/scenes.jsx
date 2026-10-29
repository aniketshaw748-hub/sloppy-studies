import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
const popA = (at = 0) => [{ property: "opacity", from: 0, to: 1, at, duration: 0.15 }, { property: "scale", from: 0.6, to: 1, at, duration: 0.3, easing: "bounce" }];
const fadeA = (d = 0.25) => [{ property: "opacity", from: 0, to: 1, at: 0, duration: d }];
const fillOf = (C, col) => col === "red" ? C.coral : col === "green" ? C.cobalt : col === "blue" ? C.navy : C.chip;
const Region = ({ C, x, y, r = 78, label, col, at = 0, out, dur }) => {
  bb({ k: "box", n: "region " + label + (col || ""), x: x - r, y: y - r, w: 2 * r + 9, h: 2 * r + 9, t0: at, t1: out ?? dur });
  return <Layer at={at} dur={dur} out={out} anim={popA(0)} sfx="pop">
    <rect x={x - r} y={y - r} width={2 * r} height={2 * r} radius={r} fill={fillOf(C, col)} strokeColor={C.navy} strokeWidth={5} />
    <text x={x - r} y={y - (col ? 54 : 36)} width={2 * r} align="center" fontFamily={C.fBody} fontWeight={C.wBody} fontSize={col ? 60 : 72} color={col ? C.ink : C.navy}>{label}</text>
    {col ? <text x={x - r} y={y + 8} width={2 * r} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={36} color={C.ink}>{col}</text> : null}
  </Layer>;
};
const Edge = ({ a, b, r = 78, at, dur }) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
  return <Arrow x1={a[0] + ux * (r + 4)} y1={a[1] + uy * (r + 4)} x2={b[0] - ux * (r + 4)} y2={b[1] - uy * (r + 4)} at={at} dur={dur} head={false} width={7} />; };
const Chip = ({ C, x, y, w = 220, h = 80, text, col, at = 0, dur }) => {
  bb({ k: "box", n: "chip " + text, x: x - w / 2, y: y - h / 2, w: w + 9, h: h + 9, t0: at, t1: dur });
  return <Layer at={at} dur={dur} anim={popA(0)} sfx="pop">
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} radius={14} fill={fillOf(C, col)} strokeColor={C.navy} strokeWidth={4} />
    <text x={x - w / 2} y={y - 22} width={w} align="center" fontFamily={C.fBody} fontWeight={C.wBody} fontSize={46} color={C.ink}>{text}</text>
  </Layer>; };
const Hi = ({ C, x, y, w, h, at, out, dur }) => <Layer at={at} dur={dur} out={out} anim={fadeA(0.2)} sfx="ping"><rect x={x} y={y} width={w} height={h} radius={14} fill="#00000000" strokeColor={C.coral} strokeWidth={9} /></Layer>;

const GX = [315, 465, 615, 765], GY = [610, 760, 910, 1060];
const GIVEN = [[0, 0, 1], [0, 3, 4], [1, 1, 4], [1, 2, 1], [2, 0, 2], [2, 3, 3], [3, 1, 3], [3, 2, 2]];
const EMPTY = [[0, 1, 2], [0, 2, 3], [1, 0, 3], [1, 3, 2], [2, 1, 1], [2, 2, 4], [3, 0, 4], [3, 3, 1]];

export const SCENES = ({ S, ctx, C }) => [
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Explain Constraint Satisfaction Problems (CSP) and their applications in AI.", n: 8, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "applications", x: 540, y: 780, z: 1.06 }] }),

  S("let's start", (r, d) => [
    <Head dur={d} text="from zero" y={170} size={130} sub="think of a small Sudoku" at={0.1} />,
    ...Sketch({ dur: d, at: r("sudoku"), speed: 3200, items: [{ rect: [240, 535, 600, 600] }, { line: [540, 535, 540, 1135] }, { line: [240, 835, 840, 835] }] }),
    ...GIVEN.map(([ro, c, v], i) => <Box key={"g" + i} dur={d} x={GX[c]} y={GY[ro]} w={124} h={124} label={String(v)} size={64} at={r("filled") + 0.4 + i * 0.1} />),
    ...EMPTY.map(([ro, c, v], i) => <Box key={"e" + i} dur={d} x={GX[c]} y={GY[ro]} w={124} h={124} label="?" tone="ghost" size={64} at={r("empty") + i * 0.12} out={r("filling") + i * 0.14} />),
    ...EMPTY.map(([ro, c, v], i) => <Box key={"s" + i} dur={d} x={GX[c]} y={GY[ro]} w={124} h={124} label={String(v)} tone="hot" size={64} at={r("filling") + i * 0.14} />),
    <Hi key="h1" C={C} dur={d} x={243} y={539} w={594} h={142} at={r("row")} out={r("column")} />,
    <Hi key="h2" C={C} dur={d} x={244} y={538} w={142} h={594} at={r("column")} out={r("box")} />,
    <Hi key="h3" C={C} dur={d} x={243} y={538} w={294} h={294} at={r("box")} out={r("solving")} />,
    ...Sketch({ dur: d, at: r("repeats"), items: [{ text: "no repeats: row · column · box", x: 540, y: 1190, size: 52, w: 980 }] }),
    ...Sketch({ dur: d, at: r("constraint"), color: C.coral, items: [{ text: "this is a CSP", x: 540, y: 1280, size: 74, w: 800, color: C.coral }] }),
    <Mascot dur={d} size={150} at={r("solving")} pts={[{ t: r("solving"), x: 540, y: 1450, look: [0, -1], mood: "think" }, { t: r("that"), x: 540, y: 1450, look: [0, -1], mood: "happy" }]} />,
  ], { hold: "that", holdY: 940, cam: [{ t: 0, x: 540, y: 940, z: 1.0 }, { t: "sudoku", x: 540, y: 950, z: 1.03 }, { t: "empty", x: 540, y: 960, z: 1.04 }, { t: "filling", x: 540, y: 950, z: 1.03 }] }),

  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  what a CSP is", x: 150, y: 720, size: 58, w: 860, align: "left", at: r("what") },
      { text: "2.  where it is used", x: 150, y: 880, size: 58, w: 860, align: "left", at: r("where") }] }),
    <Check dur={d} x={95} y={760} size={80} at={r("what") + 1.2} />,
    <Check dur={d} x={95} y={920} size={80} at={r("where") + 1.2} />,
  ], { cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "where", x: 540, y: 880, z: 1.05 }] }),

  S("a csp has", (r, d) => [
    <Head dur={d} text="3 ingredients" y={170} size={120} at={0.1} />,
    <Box dur={d} x={260} y={480} w={420} h={130} label="variables" tone="hot" at={r("variables")} />,
    <Arrow dur={d} x1={480} y1={480} x2={580} y2={480} at={r("things")} color={C.cobalt} />,
    ...[0, 1, 2].map(i => <Box key={"v" + i} dur={d} x={660 + i * 120} y={480} w={100} h={100} label="?" tone="ghost" size={56} at={r("empty") + i * 0.15} />),
    <Label dur={d} text="what you must decide" x={780} y={560} w={420} size={36} at={r("empty") + 0.6} />,
    <Box dur={d} x={260} y={780} w={420} h={130} label="domains" tone="b" at={r("domains")} />,
    <Arrow dur={d} x1={480} y1={780} x2={580} y2={780} at={r("values")} color={C.cobalt} />,
    ...[1, 2, 3, 4].map((v, i) => <Box key={"d" + i} dur={d} x={650 + i * 105} y={780} w={90} h={90} label={String(v)} size={52} at={r("take") + i * 0.18} />),
    <Label dur={d} text="allowed values" x={807} y={850} w={420} size={36} at={r("take") + 0.8} />,
    <Box dur={d} x={260} y={1080} w={420} h={130} label="constraints" at={r("constraints")} />,
    <Arrow dur={d} x1={480} y1={1080} x2={580} y2={1080} at={r("rules")} color={C.cobalt} />,
    <Box dur={d} x={800} y={1080} w={380} h={100} label="no repeats" tone="b" size={46} at={r("rules") + 0.3} />,
    <Label dur={d} text="rules between values" x={800} y={1150} w={420} size={36} at={r("together")} />,
  ], { hold: "so variables", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "variables", x: 540, y: 860, z: 1.04 }, { t: "domains", x: 540, y: 880, z: 1.04 }, { t: "constraints", x: 540, y: 900, z: 1.04 }] }),

  S("a solution is", (r, d) => [
    <Head dur={d} text="a solution" y={170} size={120} sub="a complete assignment" at={0.1} />,
    <Label dur={d} text="variables" x={540} y={420} w={500} size={38} at={r("complete")} />,
    ...[1, 2, 3, 4].map((v, i) => <Box key={"a" + i} dur={d} x={200 + i * 227} y={530} w={170} h={110} label={"x" + v} size={56} at={r("complete") + 0.2 + i * 0.12} />),
    ...[0, 1, 2, 3].map(i => <Arrow key={"w" + i} dur={d} x1={200 + i * 227} y1={600} x2={200 + i * 227} y2={720} at={r("variable") + i * 0.12} color={C.cobalt} />),
    ...[2, 3, 1, 4].map((v, i) => <Box key={"b" + i} dur={d} x={200 + i * 227} y={810} w={170} h={110} label={String(v)} tone="hot" size={60} at={r("value") + i * 0.12} />),
    <Label dur={d} text="values from the domain" x={540} y={900} w={800} size={40} at={r("domain")} />,
    <Check dur={d} x={540} y={1090} size={150} at={r("constraint")} />,
    <Label dur={d} text="no rule broken" x={540} y={1190} w={700} size={52} color={C.coral} at={r("broken")} />,
  ], { hold: "and", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "variable", x: 540, y: 860, z: 1.04 }, { t: "constraint", x: 540, y: 900, z: 1.04 }] }),

  S("try it on", (r, d) => {
    const A = [230, 680], B = [500, 430], Cc = [500, 930], D = [770, 680];
    return [
      <Head dur={d} text="map colouring" y={170} size={110} at={0.1} />,
      <Edge key="e1" a={A} b={B} dur={d} at={r("rule")} />, <Edge key="e2" a={A} b={Cc} dur={d} at={r("rule") + 0.25} />, <Edge key="e3" a={B} b={Cc} dur={d} at={r("rule") + 0.5} />,
      <Edge key="e4" a={B} b={D} dur={d} at={r("rule") + 0.75} />, <Edge key="e5" a={Cc} b={D} dur={d} at={r("rule") + 1.0} />,
      <Region key="nA" C={C} dur={d} x={A[0]} y={A[1]} label="A" at={r("regions") + 0.9} out={r("gets red") + 0.25} />,
      <Region key="nB" C={C} dur={d} x={B[0]} y={B[1]} label="B" at={r("regions") + 1.4} out={r("so green") + 0.1} />,
      <Region key="nC" C={C} dur={d} x={Cc[0]} y={Cc[1]} label="C" at={r("regions") + 1.9} out={r("so blue") + 0.1} />,
      <Region key="nD" C={C} dur={d} x={D[0]} y={D[1]} label="D" at={r("regions") + 2.5} out={r("so red") + 0.25} />,
      <Region key="cA" C={C} dur={d} x={A[0]} y={A[1]} label="A" col="red" at={r("gets red") + 0.25} />,
      <Region key="cB" C={C} dur={d} x={B[0]} y={B[1]} label="B" col="green" at={r("so green") + 0.1} />,
      <Region key="cC" C={C} dur={d} x={Cc[0]} y={Cc[1]} label="C" col="blue" at={r("so blue") + 0.1} />,
      <Region key="cD" C={C} dur={d} x={D[0]} y={D[1]} label="D" col="red" at={r("so red") + 0.25} />,
      <Chip key="k1" C={C} dur={d} x={270} y={1110} text="red" col="red" at={r("red")} />,
      <Chip key="k2" C={C} dur={d} x={540} y={1110} text="green" col="green" at={r("green")} />,
      <Chip key="k3" C={C} dur={d} x={810} y={1110} text="blue" col="blue" at={r("blue")} />,
      <Label dur={d} text="neighbours must differ" x={540} y={1200} w={900} size={48} color={C.coral} at={r("neighbors")} />,
      <Check dur={d} x={920} y={930} size={110} at={r("no clash")} />,
      <Label dur={d} text="regions = variables" x={540} y={1290} w={900} size={46} at={r("the regions are")} />,
      <Label dur={d} text="colours = domain" x={540} y={1360} w={900} size={46} at={r("the colors")} />,
      <Label dur={d} text="different neighbours = constraint" x={540} y={1430} w={960} size={46} at={r("different neighbors")} />,
      <Mascot dur={d} size={140} pts={[{ t: 0.3, x: 950, y: 680, look: [-1, 0], mood: "idle" }, { t: r("gets red"), x: 950, y: 680, look: [-1, 0], mood: "think" }, { t: r("so green"), x: 950, y: 680, look: [-1, -0.6], mood: "think" }, { t: r("so blue"), x: 950, y: 680, look: [-1, 0.6], mood: "think" }, { t: r("so red"), x: 950, y: 680, look: [-1, 0], mood: "think" }, { t: r("every region"), x: 950, y: 680, look: [-1, 0], mood: "happy" }]} />,
    ];
  }, { hold: "every region", holdY: 900, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "regions", x: 540, y: 890, z: 1.03 }, { t: "gets red", x: 540, y: 910, z: 1.03 }, { t: "so green", x: 540, y: 880, z: 1.03 }, { t: "so blue", x: 540, y: 920, z: 1.03 }, { t: "so red", x: 540, y: 900, z: 1.03 }] }),

  S("where is it used", (r, d) => [
    <Head dur={d} text="assign under rules" y={170} size={100} at={0.1} />,
    <Ico dur={d} ctx={ctx} name="calendar-clock" x={300} y={640} size={190} at={r("scheduling")} />,
    <Label dur={d} text="scheduling" x={300} y={750} w={440} size={44} at={r("scheduling") + 0.2} />,
    <Ico dur={d} ctx={ctx} name="table-2" x={780} y={640} size={190} color={C.cobalt} at={r("timetabling")} />,
    <Label dur={d} text="timetabling" x={780} y={750} w={440} size={44} at={r("timetabling") + 0.2} />,
    <Ico dur={d} ctx={ctx} name="grid-3x3" x={300} y={1100} size={190} color={C.coral} at={r("sudoku")} />,
    <Label dur={d} text="Sudoku" x={300} y={1210} w={440} size={44} at={r("sudoku") + 0.2} />,
    <Ico dur={d} ctx={ctx} name="boxes" x={780} y={1100} size={190} at={r("resource")} />,
    <Label dur={d} text="resource allocation" x={780} y={1210} w={470} size={40} at={r("resource") + 0.2} />,
  ], { hold: "resource", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "scheduling", x: 540, y: 860, z: 1.04 }, { t: "sudoku", x: 540, y: 900, z: 1.04 }] }),

  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
      "A CSP has variables, domains, and constraints.",
      "A solution is a complete assignment that violates no constraint.",
      "Example: map colouring.",
      "Applications: scheduling, timetabling, Sudoku, resource allocation."],
      times: [r("a csp"), r("a solution"), r("example"), r("applications")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  S("to remember", (r, d) => [
    <Head dur={d} text="remember" y={170} size={120} at={0.05} />,
    ...Sketch({ dur: d, at: 0.5, items: [
      { text: "V · variables", x: 540, y: 470, size: 74, w: 900, at: 1.0 },
      { text: "D · domains", x: 540, y: 600, size: 74, w: 900, at: 1.5 },
      { text: "C · constraints", x: 540, y: 730, size: 74, w: 900, at: 2.0 },
      { text: "5 marks", x: 540, y: 930, size: 140, w: 900, color: C.coral, at: r("five") }] }),
    <Check dur={d} x={540} y={1250} size={170} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.02 }, { t: "five", x: 540, y: 900, z: 1.06 }] }),
];
