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
      ...QuestionCard({ dur: d, text: "Write a program showing one interface extending another interface.", n: 17, marks: 5, y: 520 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "extending", x: 540, y: 780, z: 1.05 }] }),
    // 2. zero: an interface = a list of promises
    S("let's start", (r, d) => [
      <Head dur={d} text="interface" y={170} size={170} sub="a list of promises" at={0.1} />,
      ...Sketch({ dur: d, at: 0.3, speed: 3800, items: [
        { rect: [190, 520, 700, 340], label: "interface", size: 52, divider: [100], lines: ["promise 1", "promise 2", "promise 3"] } ] }),
    ], { hold: "promises", holdY: 700, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "list", x: 540, y: 760, z: 1.03 }] }),
    // 3. driving licences: full = learner + more
    S("think of a driving", (r, d) => [
      <Head dur={d} text="licence" y={170} size={170} sub="a list of skills" at={0.1} />,
      <Box dur={d} x={540} y={600} w={640} h={130} label="learner licence" size={44} tone="b" at={r("learner")} />,
      <Label dur={d} text="basic skills" x={540} y={700} w={600} size={46} color={C.cobalt} at={r("basic")} />,
      <Box dur={d} x={540} y={1040} w={900} h={330} tone="ghost" at={r("full")} />,
      <Label dur={d} text="full licence" x={540} y={895} w={600} size={48} color={C.cobalt} at={r("full") + 0.2} />,
      <Box dur={d} x={330} y={1080} w={360} h={120} label="learner licence" size={34} tone="b" at={r("everything")} />,
      <Box dur={d} x={740} y={1080} w={340} h={120} label="+ some more" size={40} tone="hot" at={r("plus")} />,
    ], { hold: "some more", holdY: 860, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "full", x: 540, y: 860, z: 1.03 }] }),
    // 4. extends
    S("one interface can", (r, d) => [
      <Head dur={d} text="extends" y={170} size={190} sub="an interface builds on another" at={0.1} />,
      <Box dur={d} x={540} y={640} w={440} h={110} label="Animal" size={52} at={r("build")} />,
      <Box dur={d} x={540} y={920} w={440} h={110} label="Pet" size={52} tone="b" at={r("another")} />,
      <Arrow dur={d} x1={540} y1={860} x2={540} y2={705} color={C.coral} width={10} at={r("extends")} />,
      <Label dur={d} text="extends" x={800} y={750} w={360} size={60} color={C.coral} at={r("extends") + 0.1} />,
    ], { hold: "extends", holdY: 860, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "another", x: 540, y: 840, z: 1.03 }] }),
    // 5. the question wants
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 500, size: 72, w: 960 },
        { text: "1.  a first interface", x: 125, y: 700, size: 46, w: 930, align: "left", at: r("first") },
        { text: "2.  a second one that extends it", x: 125, y: 840, size: 46, w: 930, align: "left", at: r("second") },
        { text: "3.  a class that uses the second", x: 125, y: 980, size: 46, w: 930, align: "left", at: r("class") } ] }),
      <Check dur={d} x={72} y={730} size={70} at={r("first") + 1.2} />,
      <Check dur={d} x={72} y={870} size={70} at={r("second") + 1.4} />,
      <Check dur={d} x={72} y={1010} size={70} at={r("class") + 1.4} />,
    ]),
    // 6. step 1: the base interface
    S("step one", (r, d) => [
      <Head dur={d} text="STEP 1" y={170} size={150} sub="the base interface" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 620, w: 900, size: SZ, title: "Animal", at: r("base") - 0.2, rows: [
        L(0, "interface Animal {", r("Animal")),
        L(2, "void eat();", r("eat")),
        L(0, "}", r("eat") + 0.3) ] }),
      <Box dur={d} x={540} y={900} w={560} h={120} label="Animal: eat()" size={48} at={r("eat") + 0.2} />,
    ], { hold: "one method", holdY: 800, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "Animal", x: 540, y: 840, z: 1.03 }] }),
    // 7. step 2a: the child interface line
    S("step two", (r, d) => [
      <Head dur={d} text="STEP 2" y={170} size={150} sub="the child interface" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 600, w: 900, size: SZ, title: "Pet", at: r("child") - 0.2, rows: [
        { segs: [{ t: "interface Pet", col: 0, at: r("Pet") }, { t: "extends Animal {", col: 14, at: r("extends") }] },
        L(2, "void play();", r("play")),
        L(0, "}", r("play") + 0.3) ] }),
      <Box dur={d} x={540} y={850} w={560} h={110} label="Animal: eat()" size={48} at={0.2} />,
      <Box dur={d} x={540} y={1120} w={560} h={110} label="Pet" size={52} tone="b" at={r("extends")} />,
      <Arrow dur={d} x1={540} y1={1060} x2={540} y2={915} color={C.coral} width={10} at={r("extends") + 0.2} />,
      <Label dur={d} text="extends" x={840} y={985} w={360} size={52} color={C.coral} at={r("extends") + 0.3} />,
    ], { hold: "adds one", holdY: 860, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "extends", x: 540, y: 880, z: 1.03 }] }),
    // 8. step 2b: Pet holds two promises
    S("so pet holds", (r, d) => [
      <Head dur={d} text="two promises" y={170} size={150} at={0.1} />,
      <Box dur={d} x={540} y={530} w={440} h={100} label="Animal" size={48} at={0.2} />,
      <Box dur={d} x={540} y={920} w={880} h={420} tone="ghost" at={0.3} />,
      <Label dur={d} text="interface Pet" x={720} y={735} w={400} size={50} color={C.cobalt} at={0.4} />,
      <Box dur={d} x={750} y={950} w={300} h={120} label="play()" size={52} tone="hot" at={0.5} />,
      <Box dur={d} x={330} y={950} w={300} h={120} label="eat()" size={52} tone="b" at={r("Eat")} />,
      <Arrow dur={d} x1={470} y1={585} x2={350} y2={885} color={C.coral} width={8} at={r("Eat") + 0.2} />,
      <Label dur={d} text="inherited" x={330} y={1050} w={300} size={44} color={C.cobalt} at={r("inherited")} />,
      <Label dur={d} text="its own" x={750} y={1050} w={300} size={44} color={C.coral} at={r("own")} />,
    ], { hold: "play", holdY: 840, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "Eat", x: 540, y: 840, z: 1.03 }] }),
    // 9. notice: extends, not implements
    S("notice extends", (r, d) => [
      <Head dur={d} text="extends" y={170} size={190} sub="not implements" at={0.1} />,
      <Box dur={d} x={500} y={640} w={760} h={110} label="interface Pet extends Animal" size={36} tone="b" at={r("extends")} />,
      <Check dur={d} x={965} y={640} size={80} at={r("extends") + 0.3} />,
      <Box dur={d} x={500} y={800} w={780} h={110} label="interface Pet implements Animal" size={34} at={r("implements")} />,
      <XMark dur={d} x={965} y={800} size={70} at={r("implements") + 0.4} />,
      <Label dur={d} text="interface extends interface" x={540} y={960} w={940} size={50} color={C.cobalt} at={r("Interfaces")} />,
      <Box dur={d} x={540} y={1160} w={900} h={120} label="Pet = Animal's + its own" size={48} tone="hot" at={r("carries")} />,
    ], { hold: "its own", holdY: 880, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "implements", x: 540, y: 880, z: 1.02 }] }),
    // 10. step 3a: the class
    S("step three", (r, d) => [
      <Head dur={d} text="STEP 3" y={170} size={150} sub="the class" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 700, w: 900, size: SZ, title: "Dog", at: r("Dog") - 0.2, rows: [
        { segs: [{ t: "class Dog", col: 0, at: r("Dog") }, { t: "implements Pet {", col: 10, at: r("implements") }] },
        { segs: [{ t: "void eat() {", col: 9, at: r("both") }, { t: "public", col: 2, color: C.coral, at: r("public") }] },
        L(4, "System.out.println(\"Dog eats\");", r("both") + 0.2),
        L(2, "}", r("both") + 0.3),
        { segs: [{ t: "void play() {", col: 9, at: r("play") }, { t: "public", col: 2, color: C.coral, at: r("public") + 0.25 }] },
        L(4, "System.out.println(\"Dog plays\");", r("play") + 0.2),
        L(2, "}", r("play") + 0.3),
        L(0, "}", r("play") + 0.4) ] }),
    ], { hold: "public", holdY: 800, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "both", x: 540, y: 830, z: 1.02 }] }),
    // 11. step 3b: main, output
    S("in main", (r, d) => [
      <Head dur={d} text="STEP 3" y={170} size={150} sub="run it" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 620, w: 900, size: SZ, title: "main", at: r("main"), rows: [
        L(0, "public static void main(String[] a) {", r("main")),
        L(2, "Dog d = new Dog();", r("create")),
        L(2, "d.eat();", r("eat")),
        L(2, "d.play();", r("play")),
        L(0, "}", r("play") + 0.3) ] }),
      ...Code({ C, dur: d, x: 330, y: 1060, w: 560, size: 44, title: "output", at: r("output"), rows: [
        L(0, "Dog eats", r("eats")),
        L(0, "Dog plays", r("plays")) ] }),
      <Mascot dur={d} size={260} tag="Dog" at={r("create")} pts={[{ t: r("create"), x: 840, y: 1050, look: [-1, 0] }, { t: r("eats"), x: 840, y: 1050, look: [-1, 0], mood: "happy" }]} />,
    ], { hold: "plays", holdY: 860, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "create", x: 540, y: 860, z: 1.02 }] }),
    // 12. recap: the whole chain
    S("so the class", (r, d) => [
      <Head dur={d} text="the chain" y={170} size={150} at={0.1} />,
      <Box dur={d} x={540} y={640} w={640} h={110} label="Animal: eat()" size={46} at={0.2} />,
      <Box dur={d} x={540} y={850} w={640} h={110} label="Pet: + play()" size={46} tone="b" at={0.4} />,
      <Arrow dur={d} x1={540} y1={795} x2={540} y2={700} color={C.coral} width={9} at={0.5} />,
      <Box dur={d} x={540} y={1060} w={640} h={110} label="Dog: eat() + play()" size={46} tone="hot" at={r("every")} />,
      <Arrow dur={d} x1={540} y1={1005} x2={540} y2={910} color={C.coral} width={9} at={r("every") + 0.1} />,
      <Label dur={d} text="keeps the whole chain" x={540} y={1200} w={900} size={52} color={C.cobalt} at={r("whole")} />,
    ], { hold: "whole chain", holdY: 860, cam: [{ t: 0, x: 540, y: 840, z: 1.0 }, { t: "every", x: 540, y: 880, z: 1.02 }] }),
    // 13. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "interface Animal { void eat(); }",
        "interface Pet extends Animal { void play(); }",
        "class Dog implements Pet; both methods public.",
        "main: create Dog; call eat(), play()." ],
        times: [r("Interface"), r("Interface pet"), r("Class"), r("Then")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 14. memory trick + payoff
    S("to remember", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "memory trick", x: 540, y: 380, size: 64, w: 900, color: C.cobalt },
        { text: "interface", x: 60, y: 540, size: 54, w: 330, align: "left", at: r("interface") },
        { text: "extends", x: 400, y: 540, size: 54, w: 270, align: "left", color: C.coral, at: r("extends") },
        { text: "interface", x: 670, y: 540, size: 54, w: 330, align: "left", at: r("extends") + 0.8 },
        { text: "class", x: 60, y: 700, size: 54, w: 330, align: "left", at: r("Class") },
        { text: "implements", x: 270, y: 700, size: 54, w: 400, align: "left", color: C.coral, at: r("implements") },
        { text: "interface", x: 670, y: 700, size: 54, w: 330, align: "left", at: r("implements") + 0.7 },
        { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("Five") } ] }),
      <Check dur={d} x={540} y={1290} size={180} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 960, z: 1.05 }] }),
  ];
};
