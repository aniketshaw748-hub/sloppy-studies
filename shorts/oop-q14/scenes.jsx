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
      ...QuestionCard({ dur: d, text: "Write a Java program with a user-defined exception, thrown when the age is less than 18.", n: 14, marks: 5, y: 520 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "less", x: 540, y: 780, z: 1.05 }] }),
    // 2. zero: your own rule needs your own exception
    S("let's start", (r, d) => [
      <Head dur={d} text="your own rule" y={170} size={150} sub="nobody under 18 may enter" at={0.1} />,
      <Box dur={d} x={300} y={700} w={440} h={150} label="built-in exceptions" size={34} at={r("built")} />,
      <Box dur={d} x={800} y={700} w={380} h={150} label="age < 18" size={52} tone="hot" at={r("rules")} />,
      <XMark dur={d} x={555} y={700} size={70} at={r("nothing")} />,
      <Arrow dur={d} x1={800} y1={785} x2={700} y2={925} color={C.coral} width={9} at={r("create")} />,
      <Box dur={d} x={540} y={1000} w={600} h={140} label="AgeException" size={56} tone="b" at={r("create") + 0.1} />,
      <Label dur={d} text="= user-defined" x={540} y={1180} w={800} size={64} color={C.coral} at={r("user")} />,
    ], { hold: "defined means", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "create", x: 540, y: 900, z: 1.03 }] }),
    // 3. the bouncer analogy
    S("think of a club", (r, d) => [
      <Head dur={d} text="bouncer" y={170} size={170} sub="checks your age" at={0.1} />,
      ...Sketch({ dur: d, at: r("club") - 0.2, speed: 3800, items: [{ rect: [700, 540, 300, 440], label: "club", size: 52 }] }),
      <Ico dur={d} ctx={ctx} name="user-round" x={580} y={780} size={150} color={C.coral} at={r("bouncer")} />,
      <Mover dur={d} on at={r("club")} cw={130} ch={130} pts={[
        { t: r("club"), x: 130, y: 780 }, { t: r("too"), x: 340, y: 780 }, { t: r("throws") + 0.3, x: 130, y: 780 }]}>
        {ctx.icon("person-standing", { x: 0, y: 0, size: 130, color: C.navy, strokeWidth: 2.4 })}
      </Mover>,
      <Box dur={d} x={330} y={620} w={360} h={100} label="Too young!" size={44} tone="hot" at={r("throws")} />,
    ], { hold: "message", holdY: 800, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "too", x: 540, y: 800, z: 1.03 }] }),
    // 4. the question wants
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 500, size: 72, w: 960 },
        { text: "1.  our own exception class", x: 120, y: 700, size: 50, w: 940, align: "left", at: r("Our") },
        { text: "2.  a method that throws it", x: 120, y: 840, size: 50, w: 940, align: "left", at: r("method") },
        { text: "3.  main, which catches it", x: 120, y: 980, size: 50, w: 940, align: "left", at: r("main") } ] }),
      <Check dur={d} x={72} y={730} size={70} at={r("Our") + 1.2} />,
      <Check dur={d} x={72} y={870} size={70} at={r("method") + 1.2} />,
      <Check dur={d} x={72} y={1010} size={70} at={r("main") + 1.0} />,
    ]),
    // 5. step 1: the exception class
    S("step one", (r, d) => [
      <Head dur={d} text="STEP 1" y={170} size={150} sub="the exception class" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 620, w: 900, size: SZ, title: "AgeException", at: r("Write") - 0.2, rows: [
        { segs: [{ t: "class AgeException", col: 0, at: r("Write") }, { t: "extends Exception {", col: 19, at: r("extends") }] },
        L(2, "AgeException(String msg) {", r("constructor")),
        L(4, "super(msg);", r("super")),
        L(2, "}", r("super") + 0.3),
        L(0, "}", r("super") + 0.4) ] }),
      <Box dur={d} x={540} y={930} w={420} h={110} label="Exception" size={48} at={r("extends")} />,
      <Box dur={d} x={540} y={1140} w={520} h={110} label="AgeException" size={48} tone="b" at={r("Write")} />,
      <Arrow dur={d} x1={540} y1={1080} x2={540} y2={995} color={C.coral} width={9} at={r("extends") + 0.2} />,
      <Label dur={d} text="extends" x={860} y={1030} w={300} size={46} color={C.coral} at={r("extends") + 0.3} />,
    ], { hold: "makes our own", holdY: 880, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "extends", x: 540, y: 880, z: 1.03 }] }),
    // 6. step 2a: the bouncer method
    S("step two", (r, d) => [
      <Head dur={d} text="STEP 2" y={170} size={150} sub="the bouncer" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 640, w: 900, size: SZ, title: "check", at: r("method") - 0.2, rows: [
        L(0, "static void check(int age) {", r("method")),
        L(2, "if (age < 18)", r("If")),
        L(4, "throw new AgeException(\"Too young\");", r("throw")),
        L(0, "}", r("throw") + 0.4) ] }),
      <Arrow dur={d} x1={540} y1={790} x2={540} y2={885} color={C.coral} width={9} at={r("new")} />,
      <Box dur={d} x={540} y={960} w={700} h={110} label="new AgeException(...)" size={38} tone="hot" at={r("new") + 0.1} />,
      <Ico dur={d} ctx={ctx} name="user-round" x={540} y={1130} size={120} color={C.coral} at={r("bouncer")} />,
      <Label dur={d} text="bouncer = check()" x={540} y={1210} w={800} size={48} at={r("bouncer") + 0.2} />,
    ], { hold: "our message", holdY: 900, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "If", x: 540, y: 900, z: 1.03 }] }),
    // 7. step 2b: throw vs throws
    S("notice two words", (r, d) => [
      <Head dur={d} text="two words" y={170} size={150} at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 560, w: 900, size: 36, title: "inside the method", at: r("Throw"), rows: [
        { segs: [{ t: "throw", col: 0, color: C.coral, at: r("Throw") + 0.1 }, { t: "new AgeException(\"Too young\");", col: 6, at: r("Throw") + 0.1 }] } ] }),
      <Label dur={d} text="throw = does it" x={540} y={680} w={800} size={56} color={C.coral} at={r("actually")} />,
      ...Code({ C, dur: d, x: 540, y: 890, w: 900, size: 36, title: "the heading", at: r("Throws with"), rows: [
        L(0, "static void check(int age)", r("Throws with") + 0.1),
        { segs: [{ t: "throws", col: 4, color: C.coral, at: r("Throws with") + 0.2 }, { t: "AgeException {", col: 11, at: r("Throws with") + 0.2 }] } ] }),
      <Label dur={d} text="throws = warns the caller" x={540} y={1040} w={940} size={52} color={C.cobalt} at={r("warns")} />,
    ], { hold: "does it", holdY: 840, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "Throws with", x: 540, y: 840, z: 1.03 }] }),
    // 8. step 3: main calls check, catches
    S("step three", (r, d) => [
      <Head dur={d} text="STEP 3" y={170} size={150} sub="call it, catch it" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 640, w: 900, size: SZ, title: "main", at: r("main"), rows: [
        L(0, "try {", r("inside")),
        L(2, "check(15);", r("check")),
        L(0, "} catch (AgeException e) {", r("catch")),
        { segs: [{ t: "System.out.println(", col: 2, at: r("prints") }, { t: "e.getMessage()", col: 21, color: C.coral, at: r("get") }, { t: ");", col: 35, at: r("get") }] },
        L(0, "}", r("get") + 0.3) ] }),
      <Box dur={d} x={540} y={940} w={420} h={110} label="15 < 18" size={56} tone="hot" at={r("below")} />,
      <Check dur={d} x={850} y={940} size={80} at={r("below") + 0.4} />,
      ...Code({ C, dur: d, x: 540, y: 1170, w: 600, size: 44, title: "output", at: r("too young"), rows: [L(0, "Too young", r("too young"))] }),
    ], { hold: "too young", holdY: 900, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "catch", x: 540, y: 900, z: 1.03 }] }),
    // 9. the recap: check throws, main catches
    S("so check", (r, d) => [
      <Head dur={d} text="thrown, caught" y={170} size={150} at={0.1} />,
      <Box dur={d} x={250} y={720} w={300} h={130} label="check()" size={56} tone="hot" at={0.2} />,
      <Box dur={d} x={830} y={720} w={300} h={130} label="main()" size={56} tone="b" at={0.3} />,
      <Arrow dur={d} x1={405} y1={720} x2={670} y2={720} color={C.cobalt} width={8} at={0.5} />,
      <Mover dur={d} on at={r("throws")} cw={110} ch={110} pts={[{ t: r("throws"), x: 440, y: 720 }, { t: r("catches"), x: 640, y: 720 }]}>
        {ctx.icon("zap", { x: 0, y: 0, size: 110, color: C.coral, strokeWidth: 3 })}
      </Mover>,
      <Label dur={d} text="throws it" x={250} y={830} w={400} size={50} color={C.coral} at={r("throws")} />,
      <Label dur={d} text="catches it" x={830} y={830} w={400} size={50} color={C.cobalt} at={r("catches")} />,
    ], { hold: "catches it", holdY: 800, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "throws", x: 540, y: 800, z: 1.02 }] }),
    // 10. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "class extends Exception; constructor calls super(msg).",
        "method check(age): if age < 18, throw new AgeException(msg).",
        "main: try-catch calls check(15)." ],
        times: [r("class"), r("method"), r("try")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 11. memory trick + payoff
    S("to remember", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "memory trick", x: 540, y: 380, size: 64, w: 900, color: C.cobalt },
        { text: "throw", x: 60, y: 520, size: 80, w: 400, align: "left", at: r("throw") },
        { line: [370, 570, 500, 570], arrow: true, color: C.coral },
        { text: "does it", x: 530, y: 535, size: 62, w: 480, align: "left", color: C.coral },
        { text: "throws", x: 60, y: 690, size: 80, w: 400, align: "left", at: r("throws") },
        { line: [370, 740, 500, 740], arrow: true, color: C.coral },
        { text: "warns", x: 530, y: 705, size: 62, w: 480, align: "left", color: C.coral },
        { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("Five") } ] }),
      <Check dur={d} x={540} y={1290} size={180} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 960, z: 1.05 }] }),
  ];
};
