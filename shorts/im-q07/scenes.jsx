import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Table, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  // train timeline: 8:00 -> x200, 8:30 -> x500, 9:00 -> x800
  const trainAxis = (d) => [
    ...Sketch({ dur: d, at: 0.1, speed: 4200, items: [{ line: [140, 1180, 960, 1180] }, { line: [200, 1165, 200, 1195] }, { line: [500, 1165, 500, 1195] }, { line: [800, 1165, 800, 1195] }] }),
    <Label key="t0" dur={d} text="8:00" x={200} y={1205} w={160} size={40} at={0.4} />,
    <Label key="t1" dur={d} text="8:30" x={500} y={1205} w={160} size={40} at={0.5} />,
    <Label key="t2" dur={d} text="9:00" x={800} y={1205} w={160} size={40} at={0.6} /> ];
  const NET = [["A", 2, 170, 860], ["B", 5, 470, 700], ["C", 3, 470, 1020], ["D", 4, 770, 860]];
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "What is the value of total float for critical activities?", n: 7, marks: 5, y: 520 }),
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "critical", x: 540, y: 760, z: 1.05 }] }),
    // 2. float = spare time
    S("let's start", (r, d) => [
      <Ico dur={d} ctx={ctx} name="clock" x={540} y={680} size={220} at={0.15} />,
      <Label dur={d} text="FLOAT = SPARE TIME" x={540} y={880} w={960} size={76} color={C.coral} at={r("float")} />,
    ], { hold: "spare time", holdY: 800, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "float", x: 540, y: 800, z: 1.03 }] }),
    // 3a. analogy: leave at eight -> 30 minutes spare
    S("think of catching", (r, d) => [
      ...trainAxis(d),
      <Ico dur={d} ctx={ctx} name="train-front" x={800} y={420} size={110} at={r("train")} />,
      <Label dur={d} text="leaves 9:00" x={800} y={490} w={300} size={40} at={r("nine")} />,
      <Arrow dur={d} x1={800} y1={560} x2={800} y2={1150} head={false} color={C.coral} width={8} at={r("nine")} />,
      <Box dur={d} x={350} y={720} w={300} h={100} label="30 min" size={46} at={r("journey")} />,
      <Label dur={d} text="leave at 8:00" x={350} y={600} w={400} size={46} at={r("leave at eight")} />,
      ...Sketch({ dur: d, at: r("30 minutes spare"), speed: 3000, items: [{ line: [510, 670, 800, 670], dashed: true }, { line: [800, 670, 800, 770], dashed: true }, { line: [800, 770, 510, 770], dashed: true }, { line: [510, 770, 510, 670], dashed: true }] }),
      <Label dur={d} text="30 min SPARE" x={655} y={695} w={290} size={40} color={C.coral} at={r("30 minutes spare") + 0.8} />,
      <Label dur={d} text="SPARE TIME = FLOAT" x={420} y={950} w={700} size={54} color={C.coral} at={r("your float")} />,
    ], { hold: "your float", holdY: 860, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "journey", x: 540, y: 850, z: 1.03 }] }),
    // 3b. leave at eight thirty -> zero spare
    S("leave at eight thirty", (r, d) => [
      ...trainAxis(d),
      <Ico dur={d} ctx={ctx} name="train-front" x={800} y={420} size={110} at={0.2} />,
      <Label dur={d} text="leaves 9:00" x={800} y={490} w={300} size={40} at={0.3} />,
      <Arrow dur={d} x1={800} y1={560} x2={800} y2={1150} head={false} color={C.coral} width={8} at={0.4} />,
      <Label dur={d} text="leave at 8:30" x={650} y={600} w={400} size={46} at={0.5} />,
      <Box dur={d} x={650} y={720} w={300} h={100} label="30 min" size={46} at={0.6} />,
      <Label dur={d} text="NO SPARE TIME" x={420} y={900} w={700} size={64} at={r("no spare")} />,
      <Label dur={d} text="FLOAT = 0" x={420} y={1010} w={700} size={100} color={C.coral} at={r("zero")} />,
    ], { hold: "zero float", holdY: 860, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "no spare", x: 540, y: 850, z: 1.03 }] }),
    // 4. in a project: earliest start, latest start
    S("in a project", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, speed: 4200, items: [{ line: [120, 1060, 980, 1060] }] }),
      <Label dur={d} text="TIME" x={900} y={1080} w={200} size={40} at={0.5} />,
      <Box dur={d} x={430} y={780} w={240} h={110} label="ACTIVITY" size={44} at={r("activity")} />,
      <Arrow dur={d} x1={310} y1={700} x2={310} y2={1050} head={false} color={C.coral} width={7} at={r("earliest")} />,
      <Label dur={d} text="EARLIEST START" x={310} y={600} w={420} size={44} color={C.coral} at={r("earliest")} />,
      <Box dur={d} x={670} y={930} w={240} h={110} label="ACTIVITY" size={44} tone="ghost" at={r("latest")} />,
      <Arrow dur={d} x1={550} y1={850} x2={550} y2={1050} head={false} color={C.coral} width={7} at={r("latest")} />,
      <Label dur={d} text="LATEST START" x={640} y={520} w={420} size={44} color={C.coral} at={r("latest")} />,
      <Label dur={d} text="the last moment before the project slips" x={540} y={1180} w={1000} size={48} at={r("last")} />,
    ], { hold: "whole project", holdY: 880, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "latest", x: 540, y: 850, z: 1.03 }] }),
    // 5. total float = the gap = LS - ES = LF - EF
    S("total float is the gap", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, speed: 5200, items: [{ line: [120, 1000, 980, 1000] }, { line: [310, 700, 310, 1000], dashed: true }, { line: [550, 700, 550, 1000], dashed: true }] }),
      <Label dur={d} text="ES = 2" x={310} y={620} w={200} size={44} at={0.6} />,
      <Label dur={d} text="LS = 5" x={550} y={620} w={200} size={44} at={0.7} />,
      <Arrow dur={d} x1={330} y1={860} x2={530} y2={860} at={r("gap")} color={C.coral} width={9} />,
      <Label dur={d} text="TOTAL FLOAT = 5 - 2 = 3 days" x={540} y={1040} w={1000} size={56} color={C.coral} at={r("between")} />,
      ...Sketch({ dur: d, at: r("equals"), items: [
        { text: "TF = LS - ES", x: 540, y: 1160, size: 76, w: 900 },
        { text: "TF = LF - EF", x: 540, y: 1270, size: 76, w: 900, color: C.coral, at: r("or") } ] }),
    ], { hold: "earliest finish", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "equals", x: 540, y: 960, z: 1.03 }] }),
    // 6. what the question wants
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
        { text: "1.  one number", x: 190, y: 720, size: 60, w: 860, align: "left", at: r("one number") },
        { text: "2.  the reason", x: 190, y: 880, size: 60, w: 860, align: "left", at: r("reason") } ] }),
      <Check dur={d} x={125} y={755} size={80} at={r("one number") + 0.7} />,
      <Check dur={d} x={125} y={915} size={80} at={r("reason") + 0.5} />,
    ]),
    // 7a. critical activities sit on the longest path
    S("now think about", (r, d) => [
      ...NET.map(([n, days, x, y], i) => <Box key={n} dur={d} x={x} y={y} w={200} h={120} label={n + " · " + days} size={48} at={0.15 + i * 0.15} />),
      <Arrow dur={d} x1={265} y1={825} x2={375} y2={745} at={0.8} />, <Arrow dur={d} x1={265} y1={895} x2={375} y2={975} at={0.9} />,
      <Arrow dur={d} x1={565} y1={745} x2={665} y2={825} at={1.0} />, <Arrow dur={d} x1={565} y1={975} x2={665} y2={895} at={1.1} />,
      <Arrow dur={d} x1={265} y1={825} x2={375} y2={745} at={r("sit")} color={C.coral} width={11} />,
      <Arrow dur={d} x1={565} y1={745} x2={665} y2={825} at={r("sit") + 0.2} color={C.coral} width={11} />,
      <Label dur={d} text="LONGEST PATH" x={540} y={1160} w={900} size={72} color={C.coral} at={r("longest")} />,
      <Ico dur={d} ctx={ctx} name="flag" x={955} y={860} size={90} at={r("project")} />,
      <Arrow dur={d} x1={880} y1={860} x2={915} y2={860} at={r("project")} />,
      <Label dur={d} text="no finish until they finish" x={540} y={1260} w={1000} size={52} at={r("until")} />,
    ], { hold: "they finish", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "longest", x: 540, y: 900, z: 1.03 }] }),
    // 7b. so ES = LS, gap nothing, TF = zero
    S("so their earliest", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, speed: 4200, items: [{ line: [120, 1000, 980, 1000] }] }),
      <Box dur={d} x={430} y={800} w={240} h={110} label="CRITICAL" size={44} tone="hot" at={0.2} />,
      <Arrow dur={d} x1={310} y1={700} x2={310} y2={990} head={false} color={C.coral} width={7} at={r("earliest")} />,
      <Label dur={d} text="EARLIEST START" x={310} y={560} w={420} size={44} at={r("earliest")} />,
      <Label dur={d} text="= LATEST START" x={310} y={620} w={420} size={44} at={r("latest")} />,
      <Label dur={d} text="gap = nothing" x={700} y={870} w={500} size={56} at={r("gap")} />,
      <Label dur={d} text="TOTAL FLOAT = ZERO" x={540} y={1100} w={960} size={76} color={C.coral} at={r("zero")} />,
    ], { hold: "zero", holdY: 880, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "gap", x: 540, y: 880, z: 1.03 }] }),
    // 8. critical = zero float: any delay delays the project by the same amount
    S("so critical means", (r, d) => [
      <Label dur={d} text="CRITICAL = ZERO FLOAT" x={540} y={480} w={960} size={60} color={C.coral} at={0.15} />,
      <Box dur={d} x={430} y={760} w={240} h={110} label="CRITICAL" size={44} tone="hot" at={0.5} />,
      <Arrow dur={d} x1={565} y1={680} x2={565} y2={1000} head={false} color={C.coral} width={7} at={r("no spare")} />,
      <Label dur={d} text="END" x={565} y={620} w={140} size={40} at={r("no spare")} />,
      <Box dur={d} x={650} y={760} w={170} h={110} label="+2" size={52} tone="ghost" at={r("delay")} />,
      <Arrow dur={d} x1={735} y1={680} x2={735} y2={1000} head={false} color={C.cobalt} width={7} at={r("delays")} />,
      <Label dur={d} text="NEW END" x={800} y={620} w={240} size={40} at={r("delays")} />,
      <Arrow dur={d} x1={575} y1={940} x2={725} y2={940} at={r("same")} color={C.coral} />,
      <Label dur={d} text="project late by the same 2 days" x={540} y={1060} w={1000} size={52} at={r("same")} />,
    ], { hold: "same amount", holdY: 840, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "delay", x: 540, y: 850, z: 1.03 }] }),
    // 9. quick check with numbers
    S("a quick check", (r, d) => [
      <Head dur={d} text="QUICK CHECK" y={170} size={110} />,
      ...Table({ dur: d, x: 60, y: 480, w: 960, cols: ["ACTIVITY", "ES", "LS", "FLOAT"], rowH: 100, fs: 44,
        rows: [["A", "0", "0", "0"], ["B", "2", "5", "3"]],
        cellAt: [[r("activity"), r("start zero") + 0.4, r("latest start zero") + 0.7, r("float zero") + 0.4], [r("activity b"), r("two"), r("five"), r("three")]] }),
      <Label dur={d} text="A = CRITICAL" x={540} y={900} w={900} size={72} color={C.coral} at={r("critical")} />,
      <Label dur={d} text="B = NOT CRITICAL" x={540} y={1030} w={900} size={72} at={r("not critical")} />,
    ], { hold: "not critical", holdY: 800, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "latest start zero", x: 540, y: 850, z: 1.03 }] }),
    // 10. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 42, title: "WRITE THIS · 5 MARKS", points: [
        "The total float of critical activities is zero.",
        "Total float = latest start - earliest start.",
        "Critical activities have no spare time, so any delay in them delays the project.",
        "Together they form the critical path." ],
        times: [r("the total float"), r("total float equals"), r("critical activities have"), r("together")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 11. memory trick + payoff
    S("and to remember", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "critical means", x: 540, y: 540, size: 80, w: 960 },
        { text: "ZERO spare", x: 540, y: 680, size: 100, w: 980, color: C.coral, at: r("zero") },
        { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("five") } ] }),
      <Check dur={d} x={540} y={1360} size={180} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.06 }] }),
  ];
};
