import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Layer, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
import { Sketch } from "./sketch.jsx";
const Code = ({ C, x, y, w, rows, dur, at = 0, size = 42, title }) => {
  const lh = size * 1.5, ty = title ? 56 : 0, h = rows.length * lh + 44 + ty, top = y - h / 2, cw = size * 0.602;
  bb({ k: "box", n: title || "code", x: x - w / 2, y: top, w: w + 8, h: h + 8, t0: at, t1: dur });
  const out = [<Layer key="p" at={at} dur={dur}>
    <rect x={x - w / 2 + 8} y={top + 8} width={w} height={h} radius={14} fill={C.navy} opacity={0.9} />
    <rect x={x - w / 2} y={top} width={w} height={h} radius={14} fill={C.ink} strokeColor={C.navy} strokeWidth={4} />
    {title ? <text x={x - w / 2 + 26} y={top + 12} width={w - 52} fontFamily={C.fMono} fontWeight={700} fontSize={30} color={C.cobalt}>{title}</text> : null}
  </Layer>];
  rows.forEach((row, i) => {
    if (row.hot) out.push(<Layer key={"h" + i} at={row.hotAt ?? at} dur={dur}><rect x={x - w / 2 + 10} y={top + 20 + ty + i * lh} width={w - 20} height={lh} radius={8} fill={C.coral} opacity={0.2} /></Layer>);
    row.segs.forEach((s, j) => out.push(<Layer key={"t" + i + "_" + j} at={s.at ?? at} dur={dur}>
      <text x={x - w / 2 + 28 + (s.col || 0) * cw} y={top + 20 + ty + i * lh + size * 0.12} width={w - 56 - (s.col || 0) * cw} fontFamily={C.fMono} fontWeight={700} fontSize={size} color={s.color ?? (row.hot ? C.coral : C.navy)}>{s.t}</text>
    </Layer>));
  });
  return out;
};
export const SCENES = ({ S, ctx, C }) => {
  const L = (col, t, at, hot) => ({ hot, segs: [{ t, col, at }] });
  const SZ = 34;
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Explain checked versus unchecked exceptions in Java, with examples.", n: 18, marks: 5, y: 520 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "versus", x: 540, y: 780, z: 1.05 }] }),
    // 2. zero: the exception family tree
    S("let's start", (r, d) => [
      <Head dur={d} text="exception" y={170} size={170} sub="a problem while running" at={0.1} />,
      <Box dur={d} x={540} y={640} w={520} h={110} label="Throwable" size={52} at={r("Throwable")} />,
      <Box dur={d} x={540} y={850} w={520} h={110} label="Exception" size={52} tone="b" at={r("then exception")} />,
      <Arrow dur={d} x1={540} y1={795} x2={540} y2={700} color={C.coral} width={9} at={r("then exception") + 0.15} />,
      <Box dur={d} x={540} y={1060} w={520} h={110} label="RuntimeException" size={38} tone="hot" at={r("run exception")} />,
      <Arrow dur={d} x1={540} y1={1005} x2={540} y2={910} color={C.coral} width={9} at={r("run exception") + 0.15} />,
    ], { hold: "run exception", holdY: 880, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "Throwable", x: 540, y: 880, z: 1.03 }] }),
    // 3. the airport analogy
    S("think of an airport", (r, d) => [
      <Head dur={d} text="airport" y={170} size={170} at={0.1} />,
      <Mover dur={d} on at={r("bags")} cw={130} ch={130} pts={[
        { t: r("bags"), x: 160, y: 760 }, { t: r("scanned"), x: 160, y: 760 }, { t: r("gate"), x: 490, y: 760 }, { t: r("board") + 0.3, x: 690, y: 760 }]}>
        {ctx.icon("luggage", { x: 0, y: 0, size: 130, color: C.navy, strokeWidth: 2.4 })}
      </Mover>,
      ...Sketch({ dur: d, at: r("scanned"), items: [{ rect: [350, 610, 280, 300], label: "scan", size: 52 }] }),
      <Ico dur={d} ctx={ctx} name="plane" x={870} y={760} size={150} color={C.cobalt} at={r("board")} />,
      <Ico dur={d} ctx={ctx} name="alert-triangle" x={870} y={990} size={130} color={C.coral} at={r("mid")} />,
      <Label dur={d} text="nobody scans" x={700} y={1100} w={700} size={56} color={C.coral} at={r("nobody")} />,
    ], { hold: "nobody scans", holdY: 860, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "scanned", x: 540, y: 860, z: 1.03 }] }),
    // 4. the question wants
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 500, size: 72, w: 960 },
        { text: "1.  the two kinds", x: 125, y: 700, size: 50, w: 930, align: "left", at: r("two") },
        { text: "2.  how they differ", x: 125, y: 840, size: 50, w: 930, align: "left", at: r("differ") },
        { text: "3.  an example of each", x: 125, y: 980, size: 50, w: 930, align: "left", at: r("example") } ] }),
      <Check dur={d} x={72} y={730} size={70} at={r("two") + 0.9} />,
      <Check dur={d} x={72} y={870} size={70} at={r("differ") + 0.9} />,
      <Check dur={d} x={72} y={1010} size={70} at={r("example") + 1.0} />,
    ]),
    // 5. checked: the compiler checks
    S("first checked", (r, d) => [
      <Head dur={d} text="checked" y={170} size={190} sub="the compiler checks" at={0.1} />,
      <Box dur={d} x={540} y={620} w={420} h={110} label="your code" size={48} at={0.3} />,
      <Arrow dur={d} x1={540} y1={680} x2={540} y2={795} color={C.coral} width={9} at={r("compiler")} />,
      <Box dur={d} x={540} y={860} w={620} h={120} label="COMPILER checks" size={46} tone="hot" at={r("compiler")} />,
      <Label dur={d} text="outside your control" x={700} y={1050} w={600} size={46} color={C.coral} at={r("outside")} />,
      <Ico dur={d} ctx={ctx} name="file-x" x={250} y={1140} size={150} at={r("missing")} />,
      <Label dur={d} text="missing file" x={250} y={1250} w={400} size={46} at={r("missing") + 0.2} />,
    ], { hold: "compiler checks", holdY: 860, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "compiler", x: 540, y: 880, z: 1.03 }] }),
    // 6. checked: handle or declare
    S("java will not", (r, d) => [
      <Head dur={d} text="must handle" y={170} size={150} at={0.1} />,
      <Box dur={d} x={540} y={580} w={420} h={110} label="your code" size={48} at={0.2} />,
      <Arrow dur={d} x1={540} y1={640} x2={540} y2={715} color={C.coral} width={9} at={r("will")} />,
      <Box dur={d} x={540} y={780} w={600} h={110} label="compiler says STOP" size={40} tone="hot" at={r("will")} />,
      <Arrow dur={d} x1={440} y1={840} x2={330} y2={945} color={C.coral} width={8} at={r("catch")} />,
      <Box dur={d} x={290} y={1010} w={420} h={120} label="try catch" size={48} tone="b" at={r("catch")} />,
      <Label dur={d} text="handle it" x={290} y={1100} w={400} size={46} color={C.cobalt} at={r("catch") + 0.2} />,
      <Arrow dur={d} x1={640} y1={840} x2={750} y2={945} color={C.coral} width={8} at={r("declare")} />,
      <Box dur={d} x={790} y={1010} w={420} h={120} label="throws" size={48} tone="b" at={r("declare")} />,
      <Label dur={d} text="declare it" x={790} y={1100} w={400} size={46} color={C.cobalt} at={r("declare") + 0.2} />,
    ], { hold: "declare it", holdY: 860, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "catch", x: 540, y: 880, z: 1.02 }] }),
    // 7. checked: example, opening a file
    S("example opening", (r, d) => [
      <Head dur={d} text="example" y={170} size={150} at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 600, w: 900, size: SZ, title: "opening a file", at: r("opening"), rows: [
        L(0, "FileReader f = new FileReader(\"a.txt\");", r("file")) ] }),
      <Arrow dur={d} x1={540} y1={690} x2={540} y2={785} color={C.coral} width={9} at={r("throw")} />,
      <Box dur={d} x={540} y={850} w={520} h={110} label="IOException" size={52} tone="hot" at={r("IO")} />,
      <Box dur={d} x={540} y={1060} w={900} h={120} label="checked = forced to handle" size={44} tone="b" at={r("forces")} />,
    ], { hold: "forces you", holdY: 860, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "throw", x: 540, y: 870, z: 1.03 }] }),
    // 8. unchecked: the compiler forces nothing
    S("second unchecked", (r, d) => [
      <Head dur={d} text="unchecked" y={170} size={170} sub="not checked by the compiler" at={0.1} />,
      <Box dur={d} x={540} y={590} w={520} h={100} label="RuntimeException" size={38} tone="hot" at={r("unchecked") + 0.6} />,
      <Label dur={d} text="its children are unchecked" x={540} y={665} w={900} size={44} color={C.cobalt} at={r("children")} />,
      <Box dur={d} x={540} y={800} w={420} h={110} label="your code" size={48} at={r("compiler") - 0.3} />,
      <Arrow dur={d} x1={540} y1={860} x2={540} y2={945} color={C.coral} width={9} at={r("forces")} />,
      <Box dur={d} x={540} y={1000} w={600} h={110} label="compiler: silent" size={46} tone="b" at={r("forces")} />,
      <Arrow dur={d} x1={540} y1={1060} x2={540} y2={1145} color={C.coral} width={9} at={r("compiles")} />,
      <Box dur={d} x={540} y={1210} w={520} h={110} label="program runs" size={48} at={r("compiles")} />,
      <Ico dur={d} ctx={ctx} name="alert-triangle" x={880} y={1210} size={140} color={C.coral} at={r("when")} />,
      <Label dur={d} text="problem appears" x={540} y={1330} w={800} size={52} color={C.coral} at={r("when") + 0.1} />,
    ], { hold: "when it runs", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "forces", x: 540, y: 900, z: 1.03 }] }),
    // 9. unchecked: example 5 / 0
    S("example 5", (r, d) => [
      <Head dur={d} text="example" y={170} size={150} at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 600, w: 700, size: 46, title: "5 divided by 0", at: r("divided") - 0.2, rows: [L(0, "int x = 5 / 0;", r("divided"))] }),
      <Check dur={d} x={960} y={600} size={70} at={r("compiles")} />,
      <Arrow dur={d} x1={540} y1={700} x2={540} y2={795} color={C.coral} width={9} at={r("crashes")} />,
      <Box dur={d} x={540} y={860} w={720} h={120} label="ArithmeticException" size={44} tone="hot" at={r("arithmetic")} />,
      <Label dur={d} text="compiles fine, crashes later" x={540} y={1020} w={940} size={46} color={C.cobalt} at={r("arithmetic") + 0.3} />,
    ], { hold: "arithmetic", holdY: 860, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "compiles", x: 540, y: 860, z: 1.03 }] }),
    // 10. unchecked recap: silent until it crashes
    S("so unchecked", (r, d) => [
      <Head dur={d} text="unchecked" y={170} size={170} sub="silent, then crash" at={0.1} />,
      <Box dur={d} x={290} y={720} w={420} h={130} label="compile time" size={44} tone="b" at={r("compiler")} />,
      <Label dur={d} text="compiler silent" x={290} y={830} w={420} size={44} color={C.cobalt} at={r("silent")} />,
      <Arrow dur={d} x1={510} y1={720} x2={570} y2={720} color={C.coral} width={9} at={r("crashes") - 0.2} />,
      <Box dur={d} x={790} y={720} w={420} h={130} label="run time" size={48} tone="hot" at={r("crashes")} />,
      <Label dur={d} text="crash!" x={790} y={830} w={420} size={52} color={C.coral} at={r("crashes") + 0.2} />,
    ], { hold: "run time", holdY: 780, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "silent", x: 540, y: 780, z: 1.02 }] }),
    // 11. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "Checked: compiler verifies; handle or declare.",
        "Example: IOException.",
        "Unchecked: subclasses of RuntimeException; not verified at compile time; usually bugs.",
        "Example: ArithmeticException." ],
        times: [r("checked"), r("IO"), r("unchecked"), r("arithmetic")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 12. memory trick + payoff
    S("to remember", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "memory trick", x: 540, y: 380, size: 64, w: 900, color: C.cobalt },
        { text: "checked", x: 60, y: 520, size: 72, w: 400, align: "left", at: r("checked") },
        { line: [400, 565, 520, 565], arrow: true, color: C.coral },
        { text: "compiler checks", x: 550, y: 540, size: 42, w: 490, align: "left", color: C.coral, at: r("compiler") },
        { text: "unchecked", x: 60, y: 690, size: 72, w: 450, align: "left", at: r("Unchecked") },
        { line: [470, 735, 540, 735], arrow: true, color: C.coral },
        { text: "crashes at runtime", x: 560, y: 712, size: 40, w: 460, align: "left", color: C.coral, at: r("crashes") },
        { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("Five") } ] }),
      <Check dur={d} x={540} y={1290} size={180} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 960, z: 1.05 }] }),
  ];
};
