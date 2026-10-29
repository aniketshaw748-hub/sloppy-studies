import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Table, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const Dot = ({ x, y, at, dur, r = 18 }) => <Layer at={at} dur={dur} sfx="pop"><rect x={x - r} y={y - r} width={2 * r} height={2 * r} radius={r} fill={C.coral} strokeColor={C.navy} strokeWidth={4} /></Layer>;
  // cost graph: x = duration (short on the left), y = cost (up). origin (150,1350)
  const AX = [{ line: [150, 1350, 150, 650] }, { line: [150, 1350, 980, 1350] }];
  const tt = (x) => (x - 300) / 620;
  const hD = (t) => 140 + 510 * Math.pow(1 - t, 2.2), hI = (t) => 170 + 460 * t;
  const Y = (h) => Math.round(1350 - 0.8 * h);
  const XS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => 300 + 62 * i);
  // polyline as line items; rev = draw from the right end to the left end
  const curve = (f, opt = {}) => { const it = []; for (let i = 0; i < XS.length - 1; i++) it.push({ line: [XS[i], f(XS[i]), XS[i + 1], f(XS[i + 1])], ...opt }); return opt.rev ? it.reverse().map((o) => ({ ...o, line: [o.line[2], o.line[3], o.line[0], o.line[1]] })) : it; };
  const yD = (x) => Y(hD(tt(x))), yI = (x) => Y(hI(tt(x))), yT = (x) => Y(hD(tt(x)) + hI(tt(x)));
  const tOpt = 0.52, xOpt = Math.round(300 + 620 * tOpt), yOpt = Y(hD(tOpt) + hI(tOpt));
  // worked example: network A -> (B | C) -> D
  const NET = [["A", 2, 170, 860, 300], ["B", 5, 470, 700, 200], ["C", 3, 470, 1020, 400], ["D", 4, 770, 860, 500]];
  const netArrows = (d, at, col, crit) => [
    <Arrow key="n1" dur={d} x1={265} y1={825} x2={375} y2={745} at={at} color={crit ? C.coral : undefined} width={crit ? 10 : 7} />,
    <Arrow key="n2" dur={d} x1={265} y1={895} x2={375} y2={975} at={at + 0.1} color={col} />,
    <Arrow key="n3" dur={d} x1={575} y1={745} x2={665} y2={825} at={at + 0.2} color={crit ? C.coral : undefined} width={crit ? 10 : 7} />,
    <Arrow key="n4" dur={d} x1={575} y1={975} x2={665} y2={895} at={at + 0.3} color={col} /> ];
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "How can we determine the optimum duration of a project?", n: 6, marks: 5, y: 520 }),
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "duration", x: 540, y: 760, z: 1.05 }] }),
    // 2. from zero: duration, optimum = cheapest overall
    S("let's start", (r, d) => [
      <Ico dur={d} ctx={ctx} name="hourglass" x={150} y={640} size={130} at={0.15} />,
      <Box dur={d} x={650} y={640} w={720} h={150} label="DURATION" sub="how long the whole project takes" size={56} at={r("duration")} />,
      <Ico dur={d} ctx={ctx} name="badge-indian-rupee" x={150} y={900} size={130} color={C.coral} at={r("optimum")} />,
      <Box dur={d} x={650} y={900} w={720} h={150} label="OPTIMUM" sub="best = cheapest overall" size={56} tone="hot" at={r("optimum")} />,
    ], { hold: "cheapest overall", holdY: 780, cam: [{ t: 0, x: 540, y: 740, z: 1.0 }, { t: "optimum", x: 540, y: 800, z: 1.03 }] }),
    // 3. analogy: a wedding, rush vs drag, middle is cheapest
    S("think of a wedding", (r, d) => [
      <Ico dur={d} ctx={ctx} name="zap" x={150} y={560} size={110} color={C.coral} at={r("rush")} />,
      <Box dur={d} x={650} y={560} w={720} h={140} label="RUSH IT" sub="rush orders + overtime" size={54} at={r("rush")} />,
      <Ico dur={d} ctx={ctx} name="hourglass" x={150} y={760} size={110} at={r("it out")} />,
      <Box dur={d} x={650} y={760} w={720} h={140} label="DRAG IT OUT" sub="hall rent for every extra day" size={54} at={r("it out")} />,
      <Ico dur={d} ctx={ctx} name="target" x={150} y={960} size={110} color={C.coral} at={r("somewhere")} />,
      <Box dur={d} x={650} y={960} w={720} h={140} label="IN THE MIDDLE" sub="cheapest" size={54} tone="hot" at={r("somewhere")} />,
    ], { hold: "cheapest", holdY: 800, cam: [{ t: 0, x: 540, y: 740, z: 1.0 }, { t: "it out", x: 540, y: 800, z: 1.03 }] }),
    // 4. what the question wants
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
        { text: "the method to find", x: 190, y: 720, size: 60, w: 860, align: "left", at: r("method") },
        { text: "the cheapest duration", x: 190, y: 860, size: 60, w: 860, align: "left", color: C.coral, at: r("cheapest") } ] }),
      <Check dur={d} x={125} y={760} size={80} at={r("method") + 0.9} />,
    ]),
    // 5. direct cost: goes UP when the project is shortened
    S("a project's cost", (r, d) => [
      <Head dur={d} text="TWO COSTS" y={170} size={120} />,
      ...Sketch({ dur: d, at: 0.3, speed: 4200, items: AX }),
      <Label dur={d} text="COST" x={240} y={595} w={200} size={40} at={0.8} />,
      <Label dur={d} text="DURATION" x={860} y={1375} w={300} size={40} at={0.9} />,
      <Label dur={d} text="DIRECT COST" x={720} y={700} w={420} size={56} color={C.coral} at={r("direct")} />,
      <Label dur={d} text="labour · material · machines" x={700} y={775} w={560} size={38} at={r("labour")} />,
      ...Sketch({ dur: d, at: r("shorten"), speed: 1500, color: C.coral, items: curve(yD, { rev: true }) }),
      <Arrow dur={d} x1={230} y1={960} x2={230} y2={760} at={r("goes up")} color={C.coral} />,
      <Label dur={d} text="UP" x={215} y={690} w={120} size={52} color={C.coral} at={r("goes up")} />,
    ], { hold: "goes up", holdY: 940, cam: [{ t: 0, x: 540, y: 930, z: 1.0 }, { t: "shorten", x: 540, y: 930, z: 1.02 }] }),
    // 6. indirect cost: charged per day, goes DOWN when shortened
    S("indirect cost is", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, speed: 6500, items: [...AX, ...curve(yD, { rev: true })] }),
      <Label dur={d} text="COST" x={240} y={595} w={200} size={40} at={0.5} />,
      <Label dur={d} text="DURATION" x={860} y={1375} w={300} size={40} at={0.6} />,
      <Label dur={d} text="INDIRECT COST" x={790} y={900} w={460} size={50} color={C.coral} at={r("indirect")} />,
      <Label dur={d} text={"overheads\nsupervision · rent"} x={790} y={975} w={400} size={38} at={r("overheads")} />,
      ...Sketch({ dur: d, at: r("charged"), speed: 1500, color: C.coral, items: curve(yI) }),
      <Arrow dur={d} x1={240} y1={1010} x2={240} y2={1150} at={r("goes down")} color={C.coral} />,
      <Label dur={d} text="DOWN" x={240} y={1170} w={200} size={48} color={C.coral} at={r("goes down")} />,
    ], { hold: "goes down", holdY: 980, cam: [{ t: 0, x: 540, y: 980, z: 1.0 }, { t: "charged", x: 540, y: 1000, z: 1.03 }] }),
    // 7. add them: total cost has a lowest point = the optimum duration
    S("add the two", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, speed: 7000, items: [...AX, ...curve(yD, { rev: true }), ...curve(yI, { dashed: true })] }),
      <Label dur={d} text="COST" x={240} y={595} w={200} size={40} at={0.5} />,
      <Label dur={d} text="DURATION" x={860} y={1375} w={300} size={40} at={0.6} />,
      ...Sketch({ dur: d, at: r("total"), speed: 1300, color: C.coral, items: curve(yT) }),
      <Label dur={d} text="TOTAL COST" x={620} y={620} w={460} size={56} color={C.coral} at={r("total") + 0.4} />,
      <Dot dur={d} x={xOpt} y={yOpt} at={r("lowest")} />,
      ...Sketch({ dur: d, at: r("that"), speed: 3000, items: [{ line: [xOpt, yOpt + 24, xOpt, 1340], dashed: true }] }),
      <Label dur={d} text="OPTIMUM DURATION" x={xOpt} y={1450} w={560} size={56} color={C.coral} at={r("optimum")} />,
    ], { hold: "optimum duration", holdY: 1000, cam: [{ t: 0, x: 540, y: 1000, z: 1.0 }, { t: "lowest", x: 540, y: 1020, z: 1.03 }] }),
    // 8. step 1: network + critical path
    S("now the steps", (r, d) => [
      <Head dur={d} text="STEP 1" y={170} size={130} sub="network and critical path" />,
      ...NET.map(([n, days, x, y], i) => <Box key={n} dur={d} x={x} y={y} w={210} h={120} label={n + " · " + days} size={50} at={r("network") + i * 0.12} />),
      ...netArrows(d, r("network") + 0.5, undefined, false),
      ...netArrows(d, r("critical"), undefined, true).filter((_, i) => i % 2 === 0),
      <Label dur={d} text="CRITICAL PATH: A-B-D = 11 days" x={540} y={1160} w={1000} size={52} color={C.coral} at={r("path")} />,
    ], { hold: "critical path", holdY: 900, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "network", x: 540, y: 900, z: 1.03 }] }),
    // 9. step 2: cost slope of every activity
    S("2", (r, d) => [
      <Head dur={d} text="STEP 2" y={170} size={130} sub="cost slope of each activity" />,
      ...Table({ dur: d, x: 60, y: 480, w: 960, cols: ["ACTIVITY", "SLOPE · Rs/day"], rowH: 100, fs: 44,
        rows: [["A", "300"], ["B", "200"], ["C", "400"], ["D", "500"]],
        cellAt: [[0.8, 0.9], [1.2, 1.3], [1.6, 1.7], [2.0, 2.1]] }),
    ], { hold: "every activity", holdY: 800, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: 2.0, x: 540, y: 860, z: 1.02 }] }),
    // 10. step 3: crash the lowest slope on the critical path, a day at a time
    S("3", (r, d) => [
      <Head dur={d} text="STEP 3" y={170} size={130} sub="crash the cheapest critical activity" />,
      ...NET.map(([n, days, x, y, sl], i) => <Box key={n} dur={d} x={x} y={y} w={210} h={140} label={n + " · " + days} sub={"Rs " + sl} size={46} tone={n === "C" ? "a" : "hot"} at={0.4 + i * 0.12} />),
      ...netArrows(d, 0.9, undefined, false),
      <Ring dur={d} x={470} y={700} r={120} at={r("lowest")} />,
      <Label dur={d} text="LOWEST SLOPE" x={540} y={1160} w={900} size={64} color={C.coral} at={r("lowest")} />,
      <Label dur={d} text="-1 day at a time" x={540} y={1260} w={900} size={52} at={r("one day")} />,
    ], { hold: "one day", holdY: 900, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "lowest", x: 540, y: 900, z: 1.03 }] }),
    // 11. step 3b: two critical paths -> shorten both
    S("if two paths", (r, d) => [
      ...NET.map(([n, days, x, y], i) => <Box key={n} dur={d} x={x} y={y} w={210} h={120} label={n + " · " + (n === "B" ? 3 : days)} size={50} tone="hot" at={0.2 + i * 0.1} />),
      ...netArrows(d, 0.6, C.coral, true).map((el, i) => (i % 2 ? el : el)),
      <Label dur={d} text="BOTH PATHS = 9 days" x={540} y={1160} w={1000} size={64} color={C.coral} at={r("two paths")} />,
      <Label dur={d} text="shorten BOTH" x={540} y={1260} w={900} size={64} at={r("both")} />,
    ], { hold: "both", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "both", x: 540, y: 900, z: 1.02 }] }),
    // 12. step 4: note direct, indirect, total after each step
    S("4", (r, d) => [
      <Head dur={d} text="STEP 4" y={170} size={130} sub="note the three costs each time" />,
      ...Table({ dur: d, x: 60, y: 480, w: 880, cols: ["DAYS", "DIRECT", "INDIRECT", "TOTAL"], rowH: 100, fs: 42,
        rows: [["11", "1000", "2750", "3750"], ["10", "1200", "2500", "3700"], ["9", "1400", "2250", "3650"]],
        cellAt: [[r("each"), r("direct"), r("indirect"), r("total")], [r("each") + 0.15, r("direct") + 0.15, r("indirect") + 0.15, r("total") + 0.15], [r("each") + 0.3, r("direct") + 0.3, r("indirect") + 0.3, r("total") + 0.3]] }),
      <Label dur={d} text="indirect = Rs 250 per day" x={540} y={1060} w={900} size={44} at={r("indirect")} />,
    ], { hold: "the total", holdY: 800, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "indirect", x: 540, y: 850, z: 1.02 }] }),
    // 13. step 5: stop when crashing costs more than it saves
    S("5", (r, d) => [
      <Head dur={d} text="STEP 5" y={170} size={130} sub="stop when it costs more than it saves" />,
      ...Table({ dur: d, x: 60, y: 480, w: 880, cols: ["DAYS", "DIRECT", "INDIRECT", "TOTAL"], rowH: 100, fs: 42,
        rows: [["11", "1000", "2750", "3750"], ["10", "1200", "2500", "3700"], ["9", "1400", "2250", "3650"], ["8", "1700", "2000", "3700"]],
        cellAt: [[0.2, 0.25, 0.3, 0.35], [0.4, 0.45, 0.5, 0.55], [0.6, 0.65, 0.7, 0.75], [r("crashing"), r("crashing") + 0.05, r("crashing") + 0.1, r("crashing") + 0.15]] }),
      <XMark dur={d} x={985} y={954} size={60} at={r("more") + 0.2} />,
      <Label dur={d} text="total goes UP: stop" x={540} y={1100} w={900} size={56} color={C.coral} at={r("saves")} />,
    ], { hold: "saves", holdY: 800, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "crashing", x: 540, y: 870, z: 1.02 }] }),
    // 14. the lowest total cost is the optimum
    S("the duration with", (r, d) => [
      ...Table({ dur: d, x: 60, y: 480, w: 880, cols: ["DAYS", "DIRECT", "INDIRECT", "TOTAL"], rowH: 100, fs: 42, hot: [[2, 0], [2, 1], [2, 2], [2, 3]],
        rows: [["11", "1000", "2750", "3750"], ["10", "1200", "2500", "3700"], ["9", "1400", "2250", "3650"], ["8", "1700", "2000", "3700"]],
        cellAt: [[0.1, 0.1, 0.1, 0.1], [0.15, 0.15, 0.15, 0.15], [0.2, 0.2, 0.2, 0.2], [0.25, 0.25, 0.25, 0.25]] }),
      <Label dur={d} text="LOWEST TOTAL = 3650" x={540} y={1100} w={900} size={60} at={r("lowest")} />,
      <Label dur={d} text="OPTIMUM = 9 DAYS" x={540} y={1210} w={900} size={90} color={C.coral} at={r("optimum")} />,
    ], { hold: "optimum", holdY: 850, cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "lowest", x: 540, y: 880, z: 1.02 }] }),
    // 15. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 42, title: "WRITE THIS · 5 MARKS", points: [
        "Total cost = direct cost + indirect cost.",
        "Crashing raises direct cost and lowers indirect cost.",
        "Crash critical activities in order of lowest cost slope; record the total each time.",
        "The duration where total cost is least is the optimum duration." ],
        times: [r("total cost"), r("crashing"), r("crash critical"), r("the duration where")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 16. memory trick + payoff
    S("and to remember", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "crash while", x: 540, y: 540, size: 80, w: 960 },
        { text: "the saving beats the cost", x: 540, y: 680, size: 72, w: 1000, color: C.coral, at: r("saving") },
        { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("5") } ] }),
      <Check dur={d} x={540} y={1360} size={180} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "saving", x: 540, y: 1000, z: 1.06 }] }),
  ];
};
