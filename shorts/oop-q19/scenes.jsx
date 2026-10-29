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
  const SZ = 32;
  const xs = [200, 540, 880];
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "What is the purpose of the currentThread method in multithreading? Give a small program.", n: 19, marks: 5, y: 520 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "program", x: 540, y: 780, z: 1.05 }] }),
    // 2. zero: a thread = a path of work; the main thread
    S("let's start", (r, d) => [
      <Head dur={d} text="thread" y={170} size={190} sub="a path of work" at={0.1} />,
      ...Sketch({ dur: d, at: r("separate"), speed: 3800, items: [{ line: [80, 780, 1000, 780] }] }),
      <Mascot dur={d} size={240} tag="main" at={r("separate")} pts={[
        { t: r("separate"), x: 200, y: 640, look: [1, 0] }, { t: r("one"), x: 200, y: 640, look: [1, 0] }, { t: r("runs"), x: 800, y: 640, look: [1, 0], mood: "happy" }]} />,
      <Label dur={d} text="main thread" x={540} y={850} w={700} size={56} color={C.cobalt} at={r("main")} />,
    ], { hold: "which runs", holdY: 800, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "one", x: 540, y: 820, z: 1.03 }] }),
    // 3. many threads can run the same code
    S("and when you start", (r, d) => [
      <Head dur={d} text="many threads" y={170} size={150} sub="the very same code" at={0.1} />,
      <Box dur={d} x={540} y={640} w={600} h={130} label="same code" size={56} tone="b" at={r("same")} />,
      ...xs.map((x, i) => <Mascot key={i} dur={d} size={190} tag={"t" + (i + 1)} at={r("more") + i * 0.25} pts={[{ t: r("more") + i * 0.25, x, y: 990, look: [0, -1] }, { t: r("code"), x, y: 990, look: [0, -1], mood: "happy" }]} />),
      ...[[200, 400], [540, 540], [880, 680]].map(([x, tx], i) => <Arrow key={"a" + i} dur={d} x1={x} y1={880} x2={tx} y2={715} color={C.coral} width={8} at={r("code") + i * 0.1} />),
    ], { hold: "same code", holdY: 860, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "same", x: 540, y: 860, z: 1.02 }] }),
    // 4. the hospital analogy
    S("think of a hospital", (r, d) => [
      <Head dur={d} text="hospital" y={170} size={170} sub="same instructions" at={0.1} />,
      <Box dur={d} x={540} y={600} w={700} h={110} label="same instructions" size={44} at={r("instructions")} />,
      ...xs.map((x, i) => <Ico key={"n" + i} dur={d} ctx={ctx} name="user-round" x={x} y={870} size={150} at={r("nurses") + i * 0.2} />),
      ...xs.map((x, i) => <Arrow key={"r" + i} dur={d} x1={540 + (x - 540) * 0.3} y1={660} x2={540 + (x - 540) * 0.85} y2={780} color={C.coral} width={6} at={r("instructions") + 0.2} />),
      ...[[200, "Ann"], [540, "Ben"], [880, "Cy"]].map(([x, n], i) => <Box key={"b" + i} dur={d} x={x} y={1040} w={240} h={100} label={n} size={46} tone="b" at={r("badge") + i * 0.3} />),
      <Label dur={d} text="who am I?" x={540} y={1190} w={800} size={84} color={C.coral} at={r("Who")} />,
    ], { hold: "who am", holdY: 860, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "badge", x: 540, y: 900, z: 1.03 }] }),
    // 5. the question wants
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 500, size: 72, w: 960 },
        { text: "1.  the purpose of currentThread", x: 100, y: 700, size: 46, w: 940, align: "left", at: r("purpose") },
        { text: "2.  a small program", x: 100, y: 850, size: 46, w: 940, align: "left", at: r("small") } ] }),
      <Check dur={d} x={62} y={730} size={64} at={r("purpose") + 1.6} />,
      <Check dur={d} x={62} y={880} size={64} at={r("small") + 1.2} />,
    ]),
    // 6. the purpose: static method returns the running thread
    S("the purpose", (r, d) => [
      <Head dur={d} text={"current\nThread"} y={150} size={120} at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 690, w: 800, size: 44, title: "static method of Thread", at: 0.3, rows: [
        { segs: [{ t: "Thread", col: 0, color: C.cobalt, at: r("Thread") }, { t: ".currentThread()", col: 6, color: C.coral, at: r("Thread") + 0.3 }] } ] }),
      <Arrow dur={d} x1={540} y1={790} x2={540} y2={865} color={C.coral} width={9} at={r("hands")} />,
      <Box dur={d} x={540} y={930} w={800} h={110} label="the thread running THIS line" size={38} tone="hot" at={r("running")} />,
      <Mascot dur={d} size={230} tag="main" at={r("looking")} pts={[{ t: r("looking"), x: 260, y: 1230, look: [1, 0] }, { t: r("badge"), x: 260, y: 1230, look: [1, 0], mood: "happy" }]} />,
      <Box dur={d} x={740} y={1230} w={420} h={100} label="badge: main" size={40} tone="b" at={r("badge")} />,
    ], { n: 3, hold: "own badge", holdY: 880, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "hands", x: 540, y: 900, z: 1.03 }] }),
    // 7. what you can do with it
    S("with it you can", (r, d) => [
      <Head dur={d} text="use it to" y={170} size={160} at={0.1} />,
      <Box dur={d} x={290} y={700} w={440} h={120} label="read name" size={48} tone="b" at={r("read")} />,
      <Box dur={d} x={790} y={700} w={440} h={120} label="change name" size={48} tone="b" at={r("change")} />,
      <Box dur={d} x={540} y={900} w={440} h={120} label="priority" size={48} tone="hot" at={r("priority")} />,
    ], { hold: "priority", holdY: 780, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "change", x: 540, y: 800, z: 1.02 }] }),
    // 8. why it matters: many threads share the same code
    S("it matters most", (r, d) => [
      <Head dur={d} text="which one?" y={170} size={150} at={0.1} />,
      <Box dur={d} x={540} y={590} w={760} h={110} label="Thread.currentThread()" size={40} tone="b" at={r("same")} />,
      ...xs.map((x, i) => <Mascot key={i} dur={d} size={200} tag={"t" + (i + 1)} at={r("many") + i * 0.2} pts={[{ t: r("many") + i * 0.2, x, y: 900, look: [0, -1] }, { t: r("which"), x, y: 900, look: [0, 0], mood: "think" }]} />),
      ...[[200, "main"], [540, "Thread-0"], [880, "Thread-1"]].map(([x, n], i) => <Box key={"b" + i} dur={d} x={x} y={1060} w={250} h={90} label={n} size={38} at={r("tells") + i * 0.2} />),
      <Label dur={d} text="which one is running?" x={540} y={1180} w={940} size={52} color={C.coral} at={r("which")} />,
      <Box dur={d} x={540} y={1340} w={940} h={110} label="= the thread running this line" size={40} tone="hot" at={r("returns")} />,
    ], { hold: "executing this", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "which", x: 540, y: 900, z: 1.02 }] }),
    // 9. the program: main prints "main"
    S("now the program", (r, d) => [
      <Head dur={d} text="THE PROGRAM" y={150} size={130} at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 620, w: 900, size: SZ, title: "Main", at: r("In") - 0.2, rows: [
        L(0, "public class Main {", r("In")),
        L(2, "public static void main(String[] a) {", r("In") + 0.1),
        L(4, "Thread m = Thread.currentThread();", r("call")),
        L(4, "System.out.println(m.getName());", r("print")),
        L(4, "new Worker().start();", d - 0.5),
        L(2, "}", r("print") + 0.3),
        L(0, "}", r("print") + 0.4) ] }),
      ...Code({ C, dur: d, x: 330, y: 1080, w: 560, size: 40, title: "output", at: r("prints") - 0.1, rows: [
        L(0, "main", r("prints") + 0.35) ] }),
      <Mascot dur={d} size={220} tag="main" at={r("prints")} pts={[{ t: r("prints"), x: 760, y: 1080, look: [-1, 0] }, { t: r("prints") + 0.5, x: 760, y: 1080, look: [-1, 0], mood: "happy" }]} />,
    ], { hold: "prints main", holdY: 880, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "call", x: 540, y: 880, z: 1.02 }] }),
    // 10. the worker thread prints Thread-0
    S("then we start", (r, d) => [
      <Head dur={d} text="THE WORKER" y={150} size={130} at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 500, w: 900, size: SZ, title: "Worker", at: r("worker") - 0.2, rows: [
        L(0, "class Worker extends Thread {", r("worker")),
        L(2, "public void run() {", r("Inside")),
        L(4, "Thread t = Thread.currentThread();", r("call")),
        L(4, "System.out.println(t.getName());", r("print")),
        L(2, "}", r("print") + 0.3),
        L(0, "}", r("print") + 0.4) ] }),
      ...Code({ C, dur: d, x: 540, y: 920, w: 900, size: SZ, title: "Main", at: 0.1, rows: [
        L(0, "public class Main {", 0.1),
        L(2, "public static void main(String[] a) {", 0.1),
        L(4, "Thread m = Thread.currentThread();", 0.1),
        L(4, "System.out.println(m.getName());", 0.1),
        L(4, "new Worker().start();", r("start")),
        L(2, "}", 0.1),
        L(0, "}", 0.1) ] }),
      ...Code({ C, dur: d, x: 330, y: 1330, w: 560, size: 40, title: "output", at: 0.1, rows: [
        L(0, "main", 0.1),
        L(0, "Thread-0", r("prints") + 0.6) ] }),
      <Mascot dur={d} size={170} tag="main" at={0.1} pts={[{ t: 0.1, x: 700, y: 1330, look: [-1, 0] }, { t: 1, x: 700, y: 1330, look: [-1, 0] }]} />,
      <Mascot dur={d} size={170} tag="Thread-0" at={r("prints")} pts={[{ t: r("prints"), x: 900, y: 1330, look: [-1, 0] }, { t: r("prints") + 0.6, x: 900, y: 1330, look: [-1, 0], mood: "happy" }]} />,
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "call", x: 540, y: 920, z: 1.02 }] }),
    // 11. recap: same code, different badge
    S("so same code", (r, d) => [
      <Head dur={d} text="different badge" y={170} size={140} at={0.1} />,
      <Box dur={d} x={540} y={600} w={760} h={110} label="Thread.currentThread()" size={40} tone="b" at={0.2} />,
      <Arrow dur={d} x1={440} y1={660} x2={320} y2={820} color={C.coral} width={9} at={r("different") - 0.3} />,
      <Arrow dur={d} x1={640} y1={660} x2={760} y2={820} color={C.coral} width={9} at={r("different") - 0.3} />,
      <Box dur={d} x={290} y={900} w={360} h={130} label="main" size={56} at={r("different") - 0.2} />,
      <Box dur={d} x={790} y={900} w={360} h={130} label="Thread-0" size={52} tone="hot" at={r("different")} />,
      <Label dur={d} text="same code" x={540} y={1060} w={800} size={56} color={C.cobalt} at={r("same") + 0.1} />,
    ], { hold: "different badge", holdY: 820, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "different", x: 540, y: 840, z: 1.02 }] }),
    // 12. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "currentThread() is a static method of Thread.",
        "It returns a reference to the thread now executing.",
        "Use: get or set the thread's name and priority.",
        "Program output: main, Thread-0." ],
        times: [r("Current"), r("returns"), r("Use"), r("Then")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 13. memory trick + payoff
    S("to remember", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [{ text: "memory trick", x: 540, y: 380, size: 64, w: 900, color: C.cobalt }] }),
      <Box dur={d} x={740} y={600} w={540} h={120} label="currentThread()" size={44} tone="b" at={r("current")} />,
      <Box dur={d} x={740} y={780} w={540} h={120} label="who am I?" size={56} tone="hot" at={r("who")} />,
      <Mascot dur={d} size={300} tag="main" at={r("current")} pts={[{ t: r("current"), x: 250, y: 720, look: [1, 0] }, { t: r("asks"), x: 250, y: 720, look: [1, 0], mood: "think" }, { t: r("Five"), x: 250, y: 720, look: [1, 0], mood: "happy" }]} />,
      <Label dur={d} text="5 marks" x={540} y={1060} w={900} size={140} at={r("Five")} />,
      <Check dur={d} x={540} y={1380} size={180} at={r("Secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 980, z: 1.04 }] }),
  ];
};
