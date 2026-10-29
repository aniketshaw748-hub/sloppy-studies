import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Layer, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
import { Sketch } from "./sketch.jsx";
const Code = ({ C, x, y, w, rows, dur, at = 0, size = 42, title }) => {
  const lh = size * 1.5, ty = title ? 56 : 0, h = rows.length * lh + 44 + ty, top = y - h / 2, cw = size * 0.62;
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
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Write a Java program in which one class implements two interfaces.", n: 12, marks: 5, y: 520 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "two", x: 540, y: 780, z: 1.05 }] }),
    // 2. zero: an interface = a list of promises
    S("let's start", (r, d) => [
      <Head dur={d} text="interface" y={170} size={170} sub="a list of promises" at={0.1} />,
      ...Sketch({ dur: d, at: 0.3, speed: 3800, items: [
        { rect: [190, 520, 700, 340], label: "interface", size: 52, divider: [100], lines: ["promise 1", "promise 2", "promise 3"] } ] }),
    ], { hold: "promises", holdY: 700, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "list", x: 540, y: 760, z: 1.03 }] }),
    // 3. a certificate lists skills
    S("think of a", (r, d) => [
      <Head dur={d} text="certificate" y={170} size={150} sub="a list of skills" at={0.1} />,
      ...Sketch({ dur: d, at: r("swimming") - 0.4, speed: 3800, items: [
        { rect: [60, 520, 460, 380], label: "swimming", size: 48, divider: [100], lines: ["this animal", "CAN swim"] } ] }),
      <Ico dur={d} ctx={ctx} name="waves" x={290} y={830} size={80} color={C.cobalt} at={r("can swim") + 0.4} />,
      ...Sketch({ dur: d, at: r("flying") - 0.4, speed: 3800, items: [
        { rect: [560, 520, 460, 380], label: "flying", size: 48, divider: [100], lines: ["this animal", "CAN fly"] } ] }),
      <Ico dur={d} ctx={ctx} name="bird" x={790} y={830} size={80} color={C.cobalt} at={r("can fly") + 0.4} />,
      ...Sketch({ dur: d, at: r("lists"), color: C.coral, items: [
        { text: "it only lists skills", x: 540, y: 1030, size: 60, w: 940 },
        { text: "it does not DO them", x: 540, y: 1140, size: 60, w: 940, at: r("not") } ] }),
    ], { hold: "does not", holdY: 860, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "flying", x: 540, y: 860, z: 1.03 }] }),
    // 4. a class signs up, writes code, can hold many
    S("a class that", (r, d) => [
      <Head dur={d} text="sign up" y={170} size={150} sub="write the code" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 640, w: 760, size: 44, title: "class", at: 0.2, rows: [
        L(0, "swim() { code }", r("write")),
        L(0, "fly() { code }", r("more")) ] }),
      <Box dur={d} x={220} y={1000} w={300} h={110} label="swim cert" size={40} tone="b" at={r("signs")} />,
      <Arrow dur={d} x1={220} y1={940} x2={270} y2={775} color={C.coral} width={9} at={r("signs") + 0.15} />,
      <Box dur={d} x={860} y={1000} w={300} h={110} label="fly cert" size={40} tone="b" at={r("more")} />,
      <Arrow dur={d} x1={860} y1={940} x2={810} y2={775} color={C.coral} width={9} at={r("more") + 0.15} />,
    ], { hold: "certificate", holdY: 800, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "write", x: 540, y: 820, z: 1.03 }] }),
    // 5. the question wants three things
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 500, size: 72, w: 960 },
        { text: "1.  two interfaces", x: 90, y: 700, size: 48, w: 940, align: "left", at: r("Two") },
        { text: "2.  one class implementing both", x: 90, y: 840, size: 48, w: 940, align: "left", at: r("one") },
        { text: "3.  main, to run it", x: 90, y: 980, size: 48, w: 940, align: "left", at: r("main") } ] }),
      <Check dur={d} x={50} y={730} size={70} at={r("Two") + 1.0} />,
      <Check dur={d} x={50} y={870} size={70} at={r("one") + 1.2} />,
      <Check dur={d} x={50} y={1010} size={70} at={r("main") + 0.8} />,
    ]),
    // 6. step 1: the two interfaces
    S("step one", (r, d) => [
      <Head dur={d} text="STEP 1" y={170} size={150} sub="the interfaces" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 640, w: 760, size: 46, title: "Flyer", at: r("Flyer") - 0.1, rows: [
        L(0, "interface Flyer {", r("Flyer")),
        L(2, "void fly();", r("called fly")),
        L(0, "}", r("called fly") + 0.3) ] }),
      ...Code({ C, dur: d, x: 540, y: 1010, w: 760, size: 46, title: "Swimmer", at: r("Swimmer") - 0.1, rows: [
        L(0, "interface Swimmer {", r("Swimmer")),
        L(2, "void swim();", r("called swim")),
        L(0, "}", r("called swim") + 0.3) ] }),
      <Label dur={d} text="no body: just the name and ;" x={540} y={1240} w={940} size={48} color={C.coral} at={r("body")} />,
    ], { hold: "only declares", holdY: 860, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "Swimmer", x: 540, y: 860, z: 1.02 }] }),
    // 7. step 2a: implements A, B
    S("step two", (r, d) => [
      <Head dur={d} text="STEP 2" y={170} size={150} sub="the class" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 640, w: 900, size: 34, title: "Duck", at: r("write") , rows: [
        { hot: true, hotAt: r("Duck"), segs: [{ t: "class Duck", col: 0, at: r("Duck") }, { t: "implements", col: 11, at: r("implements") }, { t: "Flyer,", col: 22, at: r("flyer") }, { t: "Swimmer {", col: 29, at: r("swimmer") }] },
        L(0, "}", r("swimmer") + 0.6) ] }),
      <Box dur={d} x={560} y={950} w={260} h={120} label="Flyer" size={44} tone="b" at={r("flyer")} />,
      <Arrow dur={d} x1={645} y1={890} x2={645} y2={765} color={C.coral} width={9} at={r("flyer") + 0.15} />,
      <Box dur={d} x={840} y={950} w={260} h={120} label="Swimmer" size={40} tone="b" at={r("swimmer")} />,
      <Arrow dur={d} x1={805} y1={890} x2={805} y2={765} color={C.coral} width={9} at={r("swimmer") + 0.15} />,
      <Label dur={d} text="separated by a comma" x={540} y={1130} w={940} size={50} color={C.coral} at={r("separated")} />,
    ], { hold: "by a comma", holdY: 860, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "Duck", x: 540, y: 860, z: 1.02 }] }),
    // 8. step 2b: both methods, public
    S("now duck must", (r, d) => [
      <Head dur={d} text="BOTH" y={170} size={150} sub="methods, and public" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 620, w: 900, size: 34, title: "Duck", at: 0.1, rows: [
        L(0, "class Duck implements Flyer, Swimmer {", 0.1),
        { segs: [{ t: "void fly() { }", col: 9, at: r("write") }, { t: "public", col: 2, color: C.coral, at: r("public") }] },
        { segs: [{ t: "void swim() { }", col: 9, at: r("methods") }, { t: "public", col: 2, color: C.coral, at: r("public") + 0.25 }] },
        L(0, "}", 0.1) ] }),
      <Box dur={d} x={540} y={900} w={560} h={110} label="will not compile" size={44} tone="hot" at={r("compile")} />,
      <XMark dur={d} x={900} y={900} size={100} at={r("compile") + 0.2} />,
      <Box dur={d} x={300} y={1150} w={300} h={110} label="Flyer" size={44} tone="b" at={r("So")} />,
      <Box dur={d} x={780} y={1150} w={300} h={110} label="Swimmer" size={40} tone="b" at={r("So") + 0.2} />,
      <Check dur={d} x={500} y={1150} size={70} at={r("kept")} />,
      <Check dur={d} x={980} y={1150} size={70} at={r("kept") + 0.25} />,
    ], { hold: "both kept", holdY: 880, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "public", x: 540, y: 860, z: 1.02 }] }),
    // 9. step 3: run it
    S("step three", (r, d) => [
      <Head dur={d} text="STEP 3" y={170} size={150} sub="run it" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 660, w: 900, size: 34, title: "Main", at: r("main") - 0.3, rows: [
        L(0, "public class Main {", r("main")),
        L(2, "public static void main(String[] a) {", r("main") + 0.2),
        L(4, "Duck d = new Duck();", r("create")),
        L(4, "d.fly();", r("Call")),
        L(4, "d.swim();", r("swim")),
        L(2, "}", r("swim") + 0.3),
        L(0, "}", r("swim") + 0.4) ] }),
      ...Code({ C, dur: d, x: 330, y: 1170, w: 560, size: 40, title: "output", at: r("output"), rows: [
        L(0, "Duck flies", r("flies")),
        L(0, "Duck swims", r("swims")) ] }),
      <Mascot dur={d} size={260} tag="Duck" at={r("create")} pts={[{ t: r("create"), x: 840, y: 1150, look: [-1, 0] }, { t: r("flies"), x: 840, y: 1150, look: [-1, 0], mood: "happy" }]} />,
    ], { hold: "answers to", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "create", x: 540, y: 900, z: 1.02 }] }),
    // 10. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "Two interfaces, method names only: void fly(); void swim();",
        "Duck implements Flyer, Swimmer; both methods public.",
        "In main: Duck d = new Duck(); d.fly(); d.swim();" ],
        times: [r("Two"), r("class"), r("Then")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 11. memory trick + payoff
    S("to remember", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [{ text: "memory trick", x: 540, y: 380, size: 64, w: 900, color: C.cobalt }] }),
      <Box dur={d} x={540} y={620} w={460} h={150} label="1 class" size={70} tone="hot" at={r("one")} />,
      ...[[200, "cert 1"], [540, "cert 2"], [880, "cert 3"]].map(([x, n], i) => [
        <Box key={"b" + i} dur={d} x={x} y={920} w={270} h={110} label={n} size={44} tone="b" at={r("many") + i * 0.2} />,
        <Arrow key={"a" + i} dur={d} x1={x} y1={865} x2={540 + (x - 540) * 0.4} y2={700} color={C.coral} width={8} at={r("many") + 0.1 + i * 0.2} />,
      ]).flat(),
      <Label dur={d} text="5 marks" x={540} y={1090} w={900} size={140} at={r("five")} />,
      <Check dur={d} x={540} y={1400} size={180} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "five", x: 540, y: 980, z: 1.04 }] }),
  ];
};
