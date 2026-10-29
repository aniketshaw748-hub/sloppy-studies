import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Table, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const Dot = ({ x, y, at, dur, r = 18 }) => <Layer at={at} dur={dur} sfx="pop"><rect x={x - r} y={y - r} width={2 * r} height={2 * r} radius={r} fill={C.coral} strokeColor={C.navy} strokeWidth={4} /></Layer>;
  // graph geometry: x = time (days, 0-12), y = cost (Rs, 0-2000). origin (150,1300)
  const AX = [{ line: [150, 1300, 150, 640] }, { line: [150, 1300, 950, 1300] }];
  const NP = [817, 970], CP = [550, 706];
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Define cost slope.", n: 5, marks: 5, y: 560 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "slope", x: 540, y: 780, z: 1.06 }] }),
    // 2. from zero: normal pace is cheap, rushed costs more
    S("let's start", (r, d) => [
      <Ico dur={d} ctx={ctx} name="turtle" x={300} y={640} size={150} at={0.15} />,
      <Label dur={d} text="normal pace" x={300} y={740} w={420} size={48} at={0.3} />,
      <Box dur={d} x={300} y={1130} w={250} h={180} label="CHEAP" size={52} at={r("cheap")} />,
      <Ico dur={d} ctx={ctx} name="rabbit" x={740} y={640} size={150} color={C.coral} at={r("rushed")} />,
      <Label dur={d} text="rushed" x={740} y={740} w={420} size={48} at={r("rushed")} />,
      <Box dur={d} x={740} y={1020} w={250} h={400} label="COSTS MORE" size={52} tone="hot" at={r("costs more")} />,
    ], { hold: "costs more", holdY: 880, cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "rushed", x: 540, y: 880, z: 1.03 }] }),
    // 3. analogy: walk, bus, taxi
    S("think of getting", (r, d) => [
      <Ico dur={d} ctx={ctx} name="footprints" x={150} y={560} size={110} at={r("walk")} />,
      <Box dur={d} x={640} y={560} w={700} h={120} label="WALK · free, slow" size={46} at={r("walk")} />,
      <Ico dur={d} ctx={ctx} name="bus" x={150} y={740} size={110} at={r("bus")} />,
      <Box dur={d} x={640} y={740} w={700} h={120} label="BUS · little money" size={46} at={r("bus")} />,
      <Ico dur={d} ctx={ctx} name="car" x={150} y={920} size={110} color={C.coral} at={r("taxi")} />,
      <Box dur={d} x={640} y={920} w={700} h={120} label="TAXI · quick, costly" size={46} tone="hot" at={r("taxi")} />,
      <Label dur={d} text="more minutes saved = more you pay" x={540} y={1110} w={980} size={62} color={C.coral} at={r("the more")} />,
    ], { hold: "more you pay", holdY: 850, cam: [{ t: 0, x: 540, y: 760, z: 1.0 }, { t: "taxi", x: 540, y: 850, z: 1.03 }] }),
    // 4. every activity has two points: normal and crash
    S("in a project", (r, d) => [
      ...Sketch({ dur: d, at: 0.2, speed: 3600, items: AX }),
      <Label dur={d} text="COST" x={230} y={590} w={200} size={40} at={0.8} />,
      <Label dur={d} text="TIME" x={900} y={1320} w={200} size={40} at={0.9} />,
      <Dot dur={d} x={NP[0]} y={NP[1]} at={r("normal")} />,
      <Label dur={d} text="NORMAL POINT" x={800} y={1010} w={400} size={44} color={C.coral} at={r("normal") + 0.2} />,
      <Label dur={d} text="normal time, normal cost" x={800} y={1065} w={420} size={36} at={r("time")} />,
      <Dot dur={d} x={CP[0]} y={CP[1]} at={r("crash")} />,
      <Label dur={d} text="CRASH POINT" x={550} y={636} w={400} size={44} color={C.coral} at={r("crash") + 0.2} />,
      <Label dur={d} text="shortest time, higher cost" x={470} y={760} w={480} size={36} at={r("shortest")} />,
    ], { n: 2, hold: "higher crash", holdY: 960, cam: [{ t: 0, x: 540, y: 960, z: 1.0 }, { t: "crash", x: 540, y: 980, z: 1.03 }] }),
    // 5. what the question wants
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
        { text: "1.  a definition", x: 190, y: 720, size: 56, w: 860, align: "left", at: r("definition") },
        { text: "2.  the formula", x: 190, y: 880, size: 56, w: 860, align: "left", at: r("formula") } ] }),
      <Check dur={d} x={125} y={755} size={80} at={r("definition") + 0.7} />,
      <Check dur={d} x={125} y={915} size={80} at={r("formula") + 0.7} />,
    ]),
    // 6. join the two points: the steepness is the cost slope
    S("join those two", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, speed: 5200, items: [...AX, { line: [CP[0], CP[1], NP[0], NP[1]], color: C.coral }] }),
      <Dot dur={d} x={NP[0]} y={NP[1]} at={0.5} />,
      <Dot dur={d} x={CP[0]} y={CP[1]} at={0.6} />,
      ...Sketch({ dur: d, at: r("steepness"), speed: 3000, items: [
        { line: [CP[0] + 20, CP[1], NP[0], CP[1]], dashed: true }, { line: [NP[0], CP[1] + 20, NP[0], NP[1] - 20], dashed: true } ] }),
      <Label dur={d} text="time saved" x={683} y={640} w={300} size={40} at={r("tells")} />,
      <Label dur={d} text="extra cost" x={940} y={820} w={200} size={40} at={r("tells") + 0.3} />,
      <Label dur={d} text={"COST SLOPE =\nextra cost per day saved"} x={540} y={1350} w={900} size={52} color={C.coral} at={r("one day")} />,
    ], { hold: "save one", holdY: 980, cam: [{ t: 0, x: 540, y: 980, z: 1.0 }, { t: "steepness", x: 560, y: 1000, z: 1.03 }] }),
    // 7. the formula
    S("the formula is", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "cost slope =", x: 270, y: 690, size: 62, w: 440 },
        { text: "crash cost − normal cost", x: 720, y: 630, size: 52, w: 600, color: C.coral, at: r("crash") },
        { line: [440, 740, 1000, 740], at: r("divided") },
        { text: "normal time − crash time", x: 720, y: 770, size: 52, w: 600, at: r("normal time") } ] }),
    ], { hold: "crash time", holdY: 780, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "divided", x: 540, y: 790, z: 1.03 }] }),
    // 8. worked example
    S("let's try numbers", (r, d) => [
      ...Table({ dur: d, x: 60, y: 420, w: 960, cols: ["", "TIME", "COST"], rowH: 110, fs: 46,
        rows: [["NORMAL", "10 days", "Rs 1,000"], ["CRASH", "6 days", "Rs 1,800"]],
        cellAt: [[r("normal time"), r("10"), r("rupees") - 0.4], [r("crash time"), r("6"), r("crash cost") + 0.7]] }),
      <Label dur={d} text="extra cost = 1800 − 1000 = Rs 800" x={540} y={860} w={1000} size={54} at={r("extra")} />,
      <Label dur={d} text="days saved = 10 − 6 = 4" x={540} y={970} w={1000} size={54} at={r("saved")} />,
      <Label dur={d} text="800 ÷ 4 = " x={540} y={1090} w={1000} size={64} at={r("divided")} />,
      <Label dur={d} text="Rs 200 per day" x={540} y={1200} w={1000} size={110} color={C.coral} at={r("200")} />,
    ], { hold: "per day", holdY: 900, cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "extra", x: 540, y: 900, z: 1.03 }] }),
    // 9. why it matters: crash the smallest slope first
    S("and here is why", (r, d) => [
      <Head dur={d} text="CRASH WHICH ONE?" y={170} size={96} />,
      <Box dur={d} x={400} y={620} w={560} h={130} label="A" sub="Rs 200 per day" size={60} at={0.4} />,
      <Box dur={d} x={400} y={820} w={560} h={130} label="B" sub="Rs 500 per day" size={60} at={0.55} />,
      <Box dur={d} x={400} y={1020} w={560} h={130} label="C" sub="Rs 800 per day" size={60} at={0.7} />,
      <Check dur={d} x={800} y={620} size={90} at={r("smallest") + 0.9} />,
      <Label dur={d} text="crash A first: the cheapest day to buy" x={540} y={1180} w={980} size={56} color={C.coral} at={r("cheapest")} />,
    ], { hold: "cheapest", holdY: 880, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "smallest", x: 540, y: 850, z: 1.03 }] }),
    // 10. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 42, title: "WRITE THIS · 5 MARKS", points: [
        "Cost slope: the increase in direct cost per unit decrease in time when an activity is crashed.",
        "Formula: (crash cost − normal cost) ÷ (normal time − crash time).",
        "Unit: rupees per day.",
        "The activity with the lowest slope is crashed first." ],
        times: [r("cost slope"), r("formula"), r("unit"), r("the lowest")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 11. memory trick + payoff
    S("and to remember", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "cost slope =", x: 540, y: 540, size: 80, w: 960 },
        { text: "extra Rs for each day saved", x: 540, y: 680, size: 68, w: 1000, color: C.coral, at: r("extra") },
        { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("five") } ] }),
      <Check dur={d} x={540} y={1360} size={180} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.06 }] }),
  ];
};
