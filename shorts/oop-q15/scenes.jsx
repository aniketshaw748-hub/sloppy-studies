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
      ...QuestionCard({ dur: d, text: "Create a thread by extending the Thread class, and state one difference between extending Thread and implementing Runnable.", n: 15, marks: 5, y: 480 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "difference", x: 540, y: 780, z: 1.05 }] }),
    // 2. zero: a thread = a separate path of work
    S("let's start", (r, d) => [
      <Head dur={d} text="thread" y={170} size={190} sub="a separate path of work" at={0.1} />,
      ...[250, 540, 830].map((x, i) => <Box key={"a" + i} dur={d} x={x} y={640} w={240} h={100} label={"task " + (i + 1)} size={44} at={r("one") + i * 0.35} />),
      <Label dur={d} text="one at a time" x={540} y={720} w={800} size={46} color={C.cobalt} at={r("one") + 1.0} />,
      ...[250, 540, 830].map((x, i) => <Box key={"b" + i} dur={d} x={x} y={920} w={240} h={100} label={"task " + "ABC"[i]} size={44} tone="b" at={r("separate") + i * 0.2} />),
      <Label dur={d} text="alongside the others" x={540} y={1010} w={900} size={50} color={C.coral} at={r("alongside")} />,
    ], { hold: "alongside", holdY: 860, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "separate", x: 540, y: 860, z: 1.03 }] }),
    // 3. the kitchen analogy
    S("think of a kitchen", (r, d) => [
      <Head dur={d} text="kitchen" y={170} size={170} sub="one cook = one dish" at={0.1} />,
      <Ico dur={d} ctx={ctx} name="chef-hat" x={270} y={700} size={170} at={r("kitchen")} />,
      <Ico dur={d} ctx={ctx} name="soup" x={270} y={960} size={130} color={C.coral} at={r("dishes") - 0.4} />,
      <Ico dur={d} ctx={ctx} name="chef-hat" x={810} y={700} size={170} color={C.cobalt} at={r("second")} />,
      <Ico dur={d} ctx={ctx} name="soup" x={810} y={960} size={130} color={C.coral} at={r("dishes")} />,
      <Label dur={d} text="thread 1" x={270} y={1100} w={400} size={52} at={r("Each")} />,
      <Label dur={d} text="thread 2" x={810} y={1100} w={400} size={52} color={C.cobalt} at={r("Each") + 0.4} />,
    ], { hold: "cook is a thread", holdY: 860, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "second", x: 540, y: 860, z: 1.03 }] }),
    // 4. the question wants
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 500, size: 72, w: 960 },
        { text: "1.  a thread via extends Thread", x: 125, y: 700, size: 46, w: 930, align: "left", at: r("Creating") },
        { text: "2.  one difference from Runnable", x: 125, y: 850, size: 46, w: 930, align: "left", at: r("one") } ] }),
      <Check dur={d} x={72} y={730} size={70} at={r("Creating") + 1.5} />,
      <Check dur={d} x={72} y={880} size={70} at={r("one") + 1.4} />,
    ]),
    // 5. step 1: the class with run()
    S("step one", (r, d) => [
      <Head dur={d} text="STEP 1" y={170} size={150} sub="make the cook" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 620, w: 900, size: SZ, title: "MyThread", at: r("Write") - 0.2, rows: [
        { segs: [{ t: "class MyThread", col: 0, at: r("Write") }, { t: "extends Thread {", col: 15, at: r("extends") }] },
        { segs: [{ t: "public void", col: 2, at: r("override") }, { t: "run", col: 14, color: C.coral, at: r("run") }, { t: "() {", col: 17, at: r("run") }] },
        L(4, "System.out.println(\"Thread running\");", r("Whatever")),
        L(2, "}", r("Whatever") + 0.5),
        L(0, "}", r("Whatever") + 0.6) ] }),
      <Arrow dur={d} x1={540} y1={795} x2={540} y2={885} color={C.coral} width={9} at={r("work")} />,
      <Box dur={d} x={540} y={960} w={640} h={110} label="the thread's work" size={46} tone="hot" at={r("work")} />,
    ], { hold: "run holds", holdY: 880, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "override", x: 540, y: 880, z: 1.03 }] }),
    // 6. step 2a: create the object, call start (not run)
    S("step two", (r, d) => [
      <Head dur={d} text="STEP 2" y={170} size={150} sub="hire the cook" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 620, w: 900, size: SZ, title: "main", at: r("main") - 0.2, rows: [
        L(0, "public static void main(String[] a) {", r("main")),
        L(2, "MyThread t = new MyThread();", r("create")),
        { segs: [{ t: "t.", col: 2, at: r("call") }, { t: "start", col: 4, color: C.coral, at: r("start,") }, { t: "();", col: 9, at: r("start,") }] },
        L(0, "}", r("start,") + 0.3) ] }),
      <Mascot dur={d} size={260} tag="t" at={r("object")} pts={[
        { t: r("object"), x: 250, y: 1100, look: [1, -1] }, { t: r("start,"), x: 250, y: 1100, look: [1, -1], mood: "happy" }]} />,
      <Box dur={d} x={760} y={1020} w={420} h={110} label="t.start()" size={50} tone="hot" at={r("start,")} />,
      <Check dur={d} x={1000} y={1020} size={70} at={r("start,") + 0.3} />,
      <Box dur={d} x={760} y={1190} w={420} h={110} label="t.run()" size={50} at={r("not")} />,
      <XMark dur={d} x={1000} y={1190} size={70} at={r("not") + 0.5} />,
    ], { hold: "not run", holdY: 880, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "create", x: 540, y: 900, z: 1.03 }] }),
    // 7. step 2b: start creates a new thread that calls run
    S("start", (r, d) => [
      <Head dur={d} text="START" y={170} size={190} sub="creates the thread" at={0.1} />,
      ...Sketch({ dur: d, at: 0.3, speed: 3800, items: [{ line: [80, 700, 1000, 700] }] }),
      <Label dur={d} text="main thread" x={800} y={640} w={400} size={40} color={C.cobalt} at={0.4} />,
      <Box dur={d} x={300} y={560} w={300} h={90} label="t.start()" size={40} tone="b" at={r("makes")} />,
      ...Sketch({ dur: d, at: r("brand"), color: C.coral, items: [{ line: [300, 700, 420, 900] }, { line: [420, 900, 1000, 900] }] }),
      <Label dur={d} text="new thread" x={520} y={830} w={300} size={40} color={C.coral} at={r("brand") + 0.3} />,
      <Box dur={d} x={780} y={900} w={240} h={100} label="run()" size={46} tone="hot" at={r("calls")} />,
      <Box dur={d} x={300} y={1160} w={300} h={100} label="t.run()" size={44} at={r("Calling")} />,
      <XMark dur={d} x={500} y={1160} size={60} at={r("no")} />,
      <Label dur={d} text="no new thread" x={760} y={1135} w={460} size={46} color={C.coral} at={r("no")} />,
    ], { n: 3, hold: "start creates", holdY: 900, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "brand", x: 540, y: 900, z: 1.03 }] }),
    // 8. the difference: one parent slot
    S("now the difference", (r, d) => [
      <Head dur={d} text="one parent" y={170} size={160} sub="a class extends only one" at={0.1} />,
      <Box dur={d} x={290} y={900} w={300} h={110} label="MyClass" size={44} at={r("class")} />,
      <Box dur={d} x={790} y={900} w={300} h={110} label="MyClass" size={44} at={r("class") + 0.2} />,
      <Label dur={d} text="extends Thread" x={290} y={560} w={420} size={40} color={C.cobalt} at={r("extends")} />,
      <Box dur={d} x={290} y={700} w={300} h={110} label="Thread" size={44} tone="hot" at={r("Thread")} />,
      <Arrow dur={d} x1={290} y1={845} x2={290} y2={760} color={C.coral} width={8} at={r("Thread") + 0.1} />,
      <Box dur={d} x={290} y={1100} w={300} h={100} label="Other" size={40} tone="ghost" at={r("slot")} />,
      <Arrow dur={d} x1={290} y1={960} x2={290} y2={1045} color={C.coral} width={8} at={r("slot") + 0.1} />,
      <XMark dur={d} x={290} y={1000} size={60} at={r("used")} />,
      <Label dur={d} text="implements Runnable" x={790} y={560} w={460} size={36} color={C.cobalt} at={r("implements")} />,
      <Box dur={d} x={790} y={700} w={300} h={110} label="Runnable" size={44} tone="b" at={r("Runnable")} />,
      <Arrow dur={d} x1={790} y1={845} x2={790} y2={760} color={C.cobalt} width={8} at={r("Runnable") + 0.1} />,
      <Box dur={d} x={790} y={1100} w={300} h={100} label="Other" size={40} tone="b" at={r("free") - 0.3} />,
      <Arrow dur={d} x1={790} y1={960} x2={790} y2={1045} color={C.coral} width={8} at={r("free") - 0.2} />,
      <Check dur={d} x={790} y={1000} size={60} at={r("free")} />,
    ], { hold: "only parent", holdY: 880, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "extends", x: 540, y: 880, z: 1.02 }] }),
    // 9. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "class extends Thread; override run().",
        "main: new object, then start().",
        "Difference: extending Thread uses up the only parent.",
        "Runnable leaves it free." ],
        times: [r("class"), r("main"), r("Difference"), r("Runnable")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 10. memory trick + payoff
    S("to remember", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "memory trick", x: 540, y: 380, size: 64, w: 900, color: C.cobalt },
        { text: "start", x: 60, y: 520, size: 80, w: 400, align: "left", at: r("start") },
        { line: [340, 570, 470, 570], arrow: true, color: C.coral },
        { text: "hires", x: 500, y: 535, size: 62, w: 480, align: "left", color: C.coral },
        { text: "run", x: 60, y: 690, size: 80, w: 400, align: "left", at: r("Run") },
        { line: [340, 740, 470, 740], arrow: true, color: C.coral },
        { text: "works", x: 500, y: 705, size: 62, w: 480, align: "left", color: C.coral },
        { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("Five") } ] }),
      <Check dur={d} x={540} y={1290} size={180} at={r("Secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 960, z: 1.05 }] }),
  ];
};
