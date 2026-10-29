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
  // the example program (rows of the code panel) shared by several scenes
  const ex = (r, t) => [
    L(0, "try {", t[0]),
    L(2, "int n = Integer.parseInt(\"abc\");", t[1]),
    L(2, "int r = 10 / 0;", t[2]),
    { segs: [{ t: "} catch (", col: 0, at: t[3] }, { t: "ArithmeticException", col: 9, color: C.coral, at: t[3] + 0.2 }, { t: "e) {", col: 29, at: t[3] + 0.2 }] },
    L(2, "System.out.println(\"divide by zero\");", t[4]),
    { segs: [{ t: "} catch (", col: 0, at: t[5] }, { t: "NumberFormatException", col: 9, color: C.coral, at: t[5] + 0.2 }, { t: "e) {", col: 31, at: t[5] + 0.2 }] },
    L(2, "System.out.println(\"not a number\");", t[6]),
    L(0, "}", t[7]),
  ];
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Explain try, catch, and multiple catch blocks, with an example.", n: 13, marks: 5, y: 520 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "multiple", x: 540, y: 780, z: 1.05 }] }),
    // 2. zero: an exception crashes the program
    S("let's start", (r, d) => [
      <Head dur={d} text="exception" y={170} size={170} sub="a problem while running" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 640, w: 700, size: 46, title: "program", at: r("running"), rows: [L(0, "int x = 10 / 0;", r("dividing"))] }),
      <Arrow dur={d} x1={540} y1={745} x2={540} y2={845} color={C.coral} width={9} at={r("by zero")} />,
      <Box dur={d} x={540} y={920} w={560} h={120} label="EXCEPTION" size={60} tone="hot" at={r("exception")} />,
      <Mascot dur={d} size={240} tag="program" at={r("running")} pts={[
        { t: r("running"), x: 270, y: 1250, look: [1, -1] }, { t: r("exception"), x: 270, y: 1250, look: [1, -1], mood: "shock" }, { t: r("crashes"), x: 270, y: 1250, look: [1, 0], mood: "sad" }]} />,
      <XMark dur={d} x={450} y={1180} size={70} at={r("crashes") + 0.2} />,
      <Label dur={d} text="program crashes" x={700} y={1215} w={560} size={52} color={C.coral} at={r("crashes")} />,
    ], { hold: "crashes", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "exception", x: 540, y: 920, z: 1.03 }] }),
    // 3. the acrobat analogy
    S("think of an acrobat", (r, d) => [
      <Head dur={d} text="acrobat" y={170} size={170} sub="on a rope, with a net" at={0.1} />,
      ...Sketch({ dur: d, at: r("acrobat") + 0.1, speed: 3800, items: [{ line: [80, 650, 1000, 650] }] }),
      <Label dur={d} text="rope" x={860} y={580} w={300} size={50} color={C.cobalt} at={r("rope")} />,
      <Mover dur={d} on at={r("acrobat") + 0.3} cw={120} ch={120} pts={[
        { t: r("acrobat") + 0.3, x: 400, y: 590 }, { t: r("falls"), x: 400, y: 590 }, { t: r("net") + 0.6, x: 400, y: 960 }]}>
        {ctx.icon("person-standing", { x: 0, y: 0, size: 120, color: C.navy, strokeWidth: 2.4 })}
      </Mover>,
      ...Sketch({ dur: d, at: r("safety"), items: [
        { rect: [140, 880, 800, 200] }, { line: [340, 880, 340, 1080] }, { line: [540, 880, 540, 1080] }, { line: [740, 880, 740, 1080] }, { line: [140, 980, 940, 980] },
        { text: "safety net", x: 540, y: 1120, size: 56, w: 700, color: C.cobalt } ] }),
    ], { hold: "catches him", holdY: 860, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "falls", x: 540, y: 860, z: 1.03 }] }),
    // 4. the question wants
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 500, size: 72, w: 960 },
        { text: "1.  try", x: 110, y: 700, size: 60, w: 860, align: "left", at: r("try") },
        { text: "2.  catch", x: 110, y: 830, size: 60, w: 860, align: "left", at: r("catch") },
        { text: "3.  multiple catch + example", x: 110, y: 960, size: 52, w: 900, align: "left", at: r("multiple") } ] }),
      <Check dur={d} x={65} y={735} size={70} at={r("try") + 0.8} />,
      <Check dur={d} x={65} y={865} size={70} at={r("catch") + 0.8} />,
      <Check dur={d} x={65} y={995} size={70} at={r("multiple") + 1.4} />,
    ]),
    // 5. try = the rope
    S("first try", (r, d) => [
      <Head dur={d} text="try" y={170} size={190} sub="the rope" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 700, w: 900, size: SZ, title: "example", at: r("First") + 0.2, rows: [
        L(0, "try {", r("try")),
        L(2, "int n = Integer.parseInt(\"abc\");", r("risky")),
        L(2, "int r = 10 / 0;", r("risky") + 0.2),
        L(0, "}", r("risky") + 0.4) ] }),
      <Arrow dur={d} x1={540} y1={950} x2={540} y2={885} color={C.coral} width={9} at={r("risky")} />,
      <Label dur={d} text="risky code" x={540} y={970} w={700} size={56} color={C.coral} at={r("risky")} />,
      <Label dur={d} text="= the rope" x={540} y={1120} w={700} size={60} color={C.cobalt} at={r("rope")} />,
    ], { hold: "the rope", holdY: 860, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "risky", x: 540, y: 860, z: 1.03 }] }),
    // 6. catch = the net
    S("second catch", (r, d) => [
      <Head dur={d} text="catch" y={170} size={190} sub="the net" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 700, w: 900, size: SZ, title: "example", at: 0.15, rows: [
        L(0, "try {", 0.15),
        L(2, "int n = Integer.parseInt(\"abc\");", 0.15),
        L(2, "int r = 10 / 0;", 0.15),
        { segs: [{ t: "} catch (", col: 0, at: r("catch") }, { t: "ArithmeticException", col: 9, color: C.coral, at: r("names") }, { t: "e) {", col: 29, at: r("names") }] },
        L(2, "System.out.println(\"divide by zero\");", r("net") + 0.4),
        L(0, "}", r("net") + 0.6) ] }),
      <Label dur={d} text="catch = the net" x={540} y={1010} w={800} size={56} color={C.cobalt} at={r("net")} />,
      <Label dur={d} text="runs only if that problem happens" x={540} y={1130} w={940} size={46} color={C.coral} at={r("runs")} />,
    ], { hold: "catch handles", holdY: 880, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "names", x: 540, y: 870, z: 1.03 }] }),
    // 7. multiple catch: checked top to bottom, first match runs
    S("now multiple", (r, d) => [
      <Head dur={d} text="multiple catch" y={170} size={140} sub="one try, many nets" at={0.1} />,
      <Box dur={d} x={540} y={640} w={700} h={120} label="try { risky code }" size={44} tone="hot" at={r("write")} />,
      <Box dur={d} x={540} y={830} w={700} h={110} label="catch (TypeA e)" size={44} out={r("matches")} at={r("several")} />,
      <Box dur={d} x={540} y={990} w={700} h={110} label="catch (TypeB e)" size={44} out={r("matches")} at={r("several") + 0.4} />,
      <Box dur={d} x={540} y={1150} w={700} h={110} label="catch (TypeC e)" size={44} at={r("several") + 0.8} />,
      <Box dur={d} x={540} y={990} w={700} h={110} label="catch (TypeB e)" size={44} tone="b" at={r("matches")} />,
      <Box dur={d} x={540} y={830} w={700} h={110} label="catch (TypeA e)" size={44} at={r("matches")} />,
      <Mover dur={d} on at={r("checks")} cw={80} ch={80} pts={[
        { t: r("checks"), x: 100, y: 830 }, { t: r("top") + 0.4, x: 100, y: 830 }, { t: r("bottom") + 0.5, x: 100, y: 990 }, { t: r("matches"), x: 100, y: 990 }]}>
        {ctx.icon("arrow-right", { x: 0, y: 0, size: 80, color: C.coral, strokeWidth: 3 })}
      </Mover>,
      <XMark dur={d} x={955} y={830} size={60} at={r("bottom") + 0.6} />,
      <Check dur={d} x={955} y={990} size={70} at={r("matches")} />,
      <Label dur={d} text="only one runs" x={540} y={1260} w={800} size={56} color={C.coral} at={r("only")} />,
    ], { hold: "many nets", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "several", x: 540, y: 900, z: 1.03 }] }),
    // 8. the example, step by step
    S("example", (r, d) => [
      <Head dur={d} text="EXAMPLE" y={170} size={150} at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 720, w: 900, size: SZ, title: "example", at: r("Inside") - 0.2, rows: [
        L(0, "try {", r("Inside")),
        L(2, "int n = Integer.parseInt(\"abc\");", r("convert")),
        L(2, "int r = 10 / 0;", r("divided")),
        { segs: [{ t: "} catch (", col: 0, at: r("catch") }, { t: "ArithmeticException", col: 9, color: C.coral, at: r("catch") + 0.1 }, { t: "e) {", col: 29, at: r("catch") + 0.1 }] },
        L(2, "System.out.println(\"divide by zero\");", r("catch") + 0.3),
        { segs: [{ t: "} catch (", col: 0, at: r("catch") + 0.5 }, { t: "NumberFormatException", col: 9, color: C.coral, at: r("catch") + 0.6 }, { t: "e) {", col: 31, at: r("catch") + 0.6 }] },
        L(2, "System.out.println(\"not a number\");", r("catch") + 0.8),
        L(0, "}", r("catch") + 0.9) ] }),
      <XMark dur={d} x={925} y={618} size={50} at={r("fails")} />,
      <Box dur={d} x={540} y={1110} w={720} h={110} label="NumberFormatException" size={40} tone="hot" at={r("fails")} />,
      <Arrow dur={d} x1={1015} y1={618} x2={1015} y2={720} color={C.coral} width={9} at={r("jumps")} />,
      ...Sketch({ dur: d, at: r("never"), color: C.coral, items: [{ line: [152, 670, 475, 670] }] }),
    ], { n: 3, hold: "never runs", holdY: 880, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "convert", x: 540, y: 880, z: 1.02 }] }),
    // 9. which catch matches?
    S("the arithmetic", (r, d) => [
      <Head dur={d} text="who matches?" y={170} size={150} at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 720, w: 900, size: SZ, title: "example", at: 0.1, rows: ex(r, [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]) }),
      <Mover dur={d} on at={r("arithmetic")} cw={60} ch={60} pts={[
        { t: r("arithmetic"), x: 70, y: 720 }, { t: r("match") - 0.2, x: 70, y: 720 }, { t: r("number"), x: 70, y: 822 }]}>
        {ctx.icon("arrow-right", { x: 0, y: 0, size: 60, color: C.coral, strokeWidth: 3 })}
      </Mover>,
      <XMark dur={d} x={1015} y={720} size={50} at={r("match")} />,
      <Check dur={d} x={1015} y={822} size={60} at={r("prints")} />,
      ...Code({ C, dur: d, x: 540, y: 1160, w: 640, size: 44, title: "output", at: r("prints"), rows: [L(0, "not a number", r("not a number"))] }),
    ], { hold: "not a number", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "number", x: 540, y: 900, z: 1.02 }] }),
    // 10. order: specific first, general last
    S("put specific", (r, d) => [
      <Head dur={d} text="the order" y={170} size={150} sub="specific first, general last" at={0.1} />,
      <Box dur={d} x={500} y={640} w={720} h={110} label="catch (ArithmeticException e)" size={34} tone="b" at={r("specific")} />,
      <Box dur={d} x={500} y={800} w={720} h={110} label="catch (NumberFormatException e)" size={34} tone="b" at={r("specific") + 0.4} />,
      <Box dur={d} x={500} y={960} w={720} h={110} label="catch (Exception e)" size={40} tone="hot" at={r("general")} />,
      <Arrow dur={d} x1={940} y1={600} x2={940} y2={990} color={C.coral} width={9} at={r("general")} />,
      <Label dur={d} text="general = last" x={540} y={1110} w={800} size={52} color={C.coral} at={r("last")} />,
    ], { hold: "last", holdY: 880, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "general", x: 540, y: 880, z: 1.02 }] }),
    // 11. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "try: holds the risky code.",
        "catch: handles one exception type, only if it occurs in try.",
        "multiple catch: first matching catch runs." ],
        times: [r("Try"), r("Catch"), r("Multiple")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 12. memory trick + payoff
    S("to remember", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "memory trick", x: 540, y: 380, size: 64, w: 900, color: C.cobalt },
        { text: "try", x: 60, y: 520, size: 80, w: 400, align: "left", at: r("try") },
        { line: [330, 570, 470, 570], arrow: true, color: C.coral },
        { text: "the rope", x: 500, y: 535, size: 62, w: 520, align: "left", color: C.coral, at: r("rope") },
        { text: "catch", x: 60, y: 690, size: 80, w: 400, align: "left", at: r("Catch") },
        { line: [330, 740, 470, 740], arrow: true, color: C.coral },
        { text: "the net", x: 500, y: 705, size: 62, w: 520, align: "left", color: C.coral, at: r("net") },
        { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("Five") } ] }),
      <Check dur={d} x={540} y={1290} size={180} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 960, z: 1.05 }] }),
  ];
};
