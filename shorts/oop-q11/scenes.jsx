import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Layer, bb } from "./prims.jsx";
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
      <text x={x - w / 2 + 28 + (s.col || 0) * cw} y={top + 20 + ty + i * lh + size * 0.12} width={w - 56 - (s.col || 0) * cw} fontFamily={C.fMono} fontWeight={700} fontSize={size} color={row.hot ? C.coral : C.navy}>{s.t}</text>
    </Layer>));
  });
  return out;
};
export const SCENES = ({ S, ctx, C }) => {
  const papers = [[240, 580], [560, 580], [860, 580], [400, 740], [720, 740], [240, 760]];
  const L = (col, t, at, hot) => ({ hot, segs: [{ t, col, at }] });
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Explain how to create a user-defined package in Java and import it into another program.", n: 11, marks: 5, y: 520 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "import", x: 540, y: 780, z: 1.05 }] }),
    // 2. zero: a cupboard of loose papers
    S("let's start", (r, d) => [
      <Head dur={d} text="a messy cupboard" y={170} size={130} at={0.1} />,
      ...Sketch({ dur: d, at: r("Imagine"), speed: 3800, items: [{ rect: [140, 470, 800, 380] }] }),
      ...papers.map(([x, y], i) => <Ico key={i} dur={d} ctx={ctx} name="file" x={x} y={y} size={100} at={r("stuffed") + i * 0.15} />),
      <XMark dur={d} x={540} y={660} size={220} at={r("never")} />,
      <Label dur={d} text="can't find anything" x={540} y={880} w={900} size={50} color={C.coral} at={r("never") + 0.2} />,
      ...[[200, "maths"], [540, "science"], [880, "art"]].map(([x, n], i) => [
        <Arrow key={"a" + i} dur={d} x1={540} y1={950} x2={x} y2={1060} color={C.coral} width={7} at={r("sort") + i * 0.2} />,
        <Ico key={"f" + i} dur={d} ctx={ctx} name="folder" x={x} y={1170} size={190} at={r("labeled") + i * 0.25} />,
        <Label key={"l" + i} dur={d} text={n} x={x} y={1290} w={300} size={46} at={r("labeled") + 0.2 + i * 0.25} />,
      ]).flat(),
    ], { hold: "folders", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "never", x: 540, y: 860, z: 1.03 }] }),
    // 3. a package = labelled folder of related classes
    S("a package is", (r, d) => [
      <Head dur={d} text="package" y={170} size={170} sub="a folder for related classes" at={0.1} />,
      <Box dur={d} x={540} y={830} w={860} h={380} tone="ghost" at={r("folder")} />,
      <Label dur={d} text="mypack/" x={540} y={660} w={500} size={50} font={C.fMono} color={C.cobalt} at={r("folder") + 0.2} />,
      ...[[300, "A"], [540, "B"], [780, "C"]].map(([x, n], i) => <Box key={i} dur={d} x={x} y={880} w={220} h={130} label={n} size={80} at={r("related") + i * 0.2} />),
      <Ico dur={d} ctx={ctx} name="user-round" x={300} y={1290} size={150} at={r("User")} />,
      <Arrow dur={d} x1={300} y1={1200} x2={300} y2={1040} color={C.coral} width={9} at={r("make")} />,
      <Label dur={d} text="= YOU make it" x={700} y={1260} w={500} size={60} color={C.coral} at={r("make") + 0.2} />,
    ], { hold: "just means", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "related", x: 540, y: 900, z: 1.03 }] }),
    // 4. the question wants two things
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 520, size: 72, w: 960 },
        { text: "1.  create the package", x: 110, y: 720, size: 56, w: 880, align: "left", at: r("Create") },
        { text: "2.  import it elsewhere", x: 110, y: 880, size: 56, w: 880, align: "left", at: r("import") } ] }),
      <Check dur={d} x={70} y={755} size={80} at={r("Create") + 1.0} />,
      <Check dur={d} x={70} y={915} size={80} at={r("import") + 1.0} />,
    ]),
    // 5. step 1: the first line says which folder
    S("step one", (r, d) => [
      <Head dur={d} text="STEP 1" y={170} size={150} sub="create it" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 790, w: 900, size: 42, title: "A.java", at: r("first") - 0.1, rows: [
        { hot: true, hotAt: r("line"), segs: [{ t: "package", col: 0, at: r("package") }, { t: "mypack", col: 8, at: r("mypack") }, { t: ";", col: 14, at: r("semicolon") }] },
        L(0, "public class A {", r("file")),
        L(2, "public void show() {", r("file") + 0.15),
        L(4, "System.out.println(\"Hi\");", r("file") + 0.3),
        L(2, "}", r("file") + 0.45),
        L(0, "}", r("file") + 0.6) ] }),
      <Ico dur={d} ctx={ctx} name="folder" x={540} y={1230} size={200} at={r("name")} />,
      <Label dur={d} text="mypack/" x={540} y={1350} w={500} size={50} font={C.fMono} at={r("name") + 0.2} />,
      <Arrow dur={d} x1={540} y1={1050} x2={540} y2={1120} color={C.coral} width={9} at={r("mypack")} />,
    ], { hold: "decides", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "Write", x: 540, y: 860, z: 1.03 }] }),
    // 6. step 2: save in the folder, compile
    S("step two", (r, d) => [
      <Head dur={d} text="STEP 2" y={170} size={150} sub="save and compile" at={0.1} />,
      <Ico dur={d} ctx={ctx} name="folder" x={700} y={640} size={300} at={r("inside")} />,
      <Label dur={d} text="mypack/" x={700} y={815} w={400} size={46} font={C.fMono} at={r("mypack")} />,
      <Label dur={d} text="A.java" x={200} y={725} w={300} size={42} font={C.fMono} at={r("file")} out={r("real") + 0.2} />,
      <Mover dur={d} on at={r("file")} cw={120} ch={120} pts={[{ t: r("file"), x: 200, y: 640 }, { t: r("real"), x: 200, y: 640 }, { t: r("same"), x: 700, y: 660 }]}>
        {ctx.icon("file-code", { x: 0, y: 0, size: 120, color: C.navy, strokeWidth: 2.4 })}
      </Mover>,
      ...Code({ C, dur: d, x: 540, y: 1030, w: 800, size: 46, title: "terminal", at: r("Compile with"), rows: [
        { segs: [{ t: "$", col: 0, at: r("Compile with") }, { t: "javac", col: 2, at: r("java") }, { t: "-d", col: 8, at: r("dash") }, { t: ".", col: 11, at: r("dot") }, { t: "A.java", col: 13, at: r("dot") + 0.15 }] } ] }),
      <Arrow dur={d} x1={540} y1={1130} x2={540} y2={1220} color={C.coral} width={9} at={r("builds")} />,
      <Box dur={d} x={540} y={1290} w={640} h={120} label="mypack/A.class" size={48} tone="b" at={r("builds") + 0.1} />,
      <Label dur={d} text="folder name = package name" x={540} y={1440} w={960} size={46} color={C.coral} at={r("match")} />,
    ], { hold: "must match", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "Compile with", x: 540, y: 900, z: 1.03 }] }),
    // 7. step 3: import it, create the object
    S("step three", (r, d) => [
      <Head dur={d} text="STEP 3" y={170} size={150} sub="import it" at={0.1} />,
      ...Code({ C, dur: d, x: 540, y: 700, w: 900, size: 34, title: "Test.java", at: r("other"), rows: [
        { hot: true, hotAt: r("write"), segs: [{ t: "import", col: 0, at: r("write") + 0.2 }, { t: "mypack", col: 7, at: r("mypack") }, { t: ".A;", col: 13, at: r("dot") }] },
        L(0, "class Test {", r("other") + 0.3),
        L(2, "public static void main(String[] a) {", r("other") + 0.45),
        L(4, "A obj = new A();", r("other") + 0.6),
        L(4, "obj.show();", r("other") + 0.75),
        L(2, "}", r("other") + 0.9),
        L(0, "}", r("other") + 1.05) ] }),
      <Box dur={d} x={270} y={1230} w={420} h={260} tone="ghost" at={r("folder")} />,
      <Label dur={d} text="mypack/" x={270} y={1120} w={360} size={46} font={C.fMono} color={C.cobalt} at={r("folder") + 0.1} />,
      <Box dur={d} x={270} y={1290} w={150} h={100} label="A" size={64} at={r("class")} />,
      <Arrow dur={d} x1={500} y1={1260} x2={650} y2={1260} color={C.coral} width={9} label="fetch" at={r("fetch")} />,
      <Mascot dur={d} size={250} tag="A" at={r("create")} pts={[{ t: r("create"), x: 830, y: 1260, look: [-1, 0] }, { t: r("method"), x: 830, y: 1260, look: [-1, 0], mood: "happy" }]} />,
    ], { hold: "import fetches", holdY: 900, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "folder", x: 540, y: 960, z: 1.03 }] }),
    // 8. the catch: public
    S("one catch", (r, d) => [
      <Head dur={d} text="ONE CATCH" y={170} size={150} at={0.1} />,
      <Box dur={d} x={175} y={650} w={240} h={110} label="Test" size={52} at={r("class")} />,
      <Arrow dur={d} x1={305} y1={650} x2={555} y2={650} color={C.cobalt} width={9} at={r("class") + 0.1} />,
      <Box dur={d} x={790} y={650} w={470} h={200} tone="ghost" at={r("class") + 0.2} />,
      <Box dur={d} x={790} y={650} w={390} h={100} label="public class A" size={40} tone="b" at={r("public")} />,
      <Check dur={d} x={430} y={650} size={90} at={r("public") + 0.4} />,
      <Box dur={d} x={175} y={950} w={240} h={110} label="Test" size={52} at={r("outside")} />,
      <Arrow dur={d} x1={305} y1={950} x2={555} y2={950} color={C.cobalt} width={9} at={r("outside") + 0.1} />,
      <Box dur={d} x={790} y={950} w={470} h={200} tone="ghost" at={r("outside") + 0.2} />,
      <Box dur={d} x={790} y={950} w={390} h={100} label="class A" size={44} at={r("outside") + 0.3} />,
      <XMark dur={d} x={430} y={950} size={90} at={r("cannot")} />,
      <Label dur={d} text="cannot see it" x={540} y={1090} w={800} size={52} color={C.coral} at={r("see")} />,
    ], { hold: "cannot see", holdY: 880, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "outside", x: 540, y: 840, z: 1.02 }] }),
    // 9. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
        "First line: package mypack;",
        "Save in folder mypack, compile: javac -d . A.java",
        "In the other program: import mypack.A;",
        "Class (and members used) must be public." ],
        times: [r("First"), r("save"), r("other"), r("Keep")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 10. memory trick + payoff
    S("to remember", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "memory trick", x: 540, y: 380, size: 64, w: 900, color: C.cobalt },
        { text: "Pack it", x: 60, y: 520, size: 66, w: 400, align: "left", at: r("pack") },
        { line: [430, 565, 530, 565], arrow: true, color: C.coral },
        { text: "package mypack;", x: 560, y: 535, size: 44, w: 480, align: "left", color: C.coral },
        { text: "Place it", x: 60, y: 650, size: 66, w: 400, align: "left", at: r("place") },
        { line: [430, 695, 530, 695], arrow: true, color: C.coral },
        { text: "save in mypack/", x: 560, y: 665, size: 44, w: 480, align: "left", color: C.coral },
        { text: "Pull it", x: 60, y: 780, size: 66, w: 400, align: "left", at: r("pull") },
        { line: [430, 825, 530, 825], arrow: true, color: C.coral },
        { text: "import mypack.A;", x: 560, y: 795, size: 44, w: 480, align: "left", color: C.coral },
        { text: "5 marks", x: 540, y: 980, size: 150, w: 900, at: r("Five") } ] }),
      <Check dur={d} x={540} y={1300} size={180} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 960, z: 1.05 }] }),
  ];
};
