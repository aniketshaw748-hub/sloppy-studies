import { Box, Arrow, Ico, Head, Label, Check, Layer } from "./prims.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const cx = 540, cy = 930;
  const RX = [150, 280, 410, 500], RY = [110, 205, 300, 395];
  const colX = [359, 549, 739, 929], rowY = [610, 770, 930, 1090];
  const heads = ["same\nclass", "same\npackage", "diff pkg\nsubclass", "diff pkg\nothers"];
  const rowNames = ["private", "default", "protected", "public"];
  const ok = [[1, 0, 0, 0], [1, 1, 0, 0], [1, 1, 1, 0], [1, 1, 1, 1]];
  return [
    // 1. the question, read out
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Discuss the access privileges of class members within the same package and in different packages.", n: 16, marks: 5, y: 520 }),
    ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "different", x: 540, y: 780, z: 1.05 }] }),
    // 2. from zero: a class member + access privilege
    S("let's start", (r, d) => [
      <Head dur={d} text="class member" y={170} size={140} sub="a variable or a method" at={0.1} />,
      ...Sketch({ dur: d, at: r("member") - 0.6, speed: 3800, items: [
        { rect: [60, 470, 600, 300], label: "class Student", size: 52, divider: [100], lines: ["int age;", "void show() { }"] } ] }),
      ...Sketch({ dur: d, at: r("variable"), color: C.coral, items: [
        { line: [740, 610, 330, 610], arrow: true, color: C.coral },
        { text: "members", x: 860, y: 640, size: 52, w: 300, color: C.coral, at: r("variable") + 0.3 },
        { line: [740, 700, 420, 700], arrow: true, color: C.coral, at: r("method") } ] }),
      ...Sketch({ dur: d, at: r("Access"), items: [
        { text: "access privilege", x: 540, y: 850, size: 70, w: 900 },
        { text: "= who may use it", x: 540, y: 960, size: 62, w: 900, color: C.cobalt, at: r("who") } ] }),
      ...Sketch({ dur: d, at: r("four"), color: C.coral, items: [{ text: "4 levels", x: 540, y: 1110, size: 120, w: 700, color: C.coral }] }),
      <Ico dur={d} ctx={ctx} name="key-round" x={540} y={1350} size={150} color={C.cobalt} at={r("levels") + 0.5} />,
    ], { hold: "levels", holdY: 860, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "member", x: 540, y: 880, z: 1.03 }] }),
    // 3. the house: four rings of who can walk in
    S("think of a house", (r, d) => [
      <Head dur={d} text="the house" y={170} size={140} sub="who may walk in?" at={0.1} />,
      ...Sketch({ dur: d, at: r("Private"), speed: 3200, items: [{ oval: [cx, cy, RX[0], RY[0]], label: "private", size: 54 }] }),
      <Ico dur={d} ctx={ctx} name="bed-double" x={cx} y={cy + 70} size={64} at={r("bedroom")} />,
      ...Sketch({ dur: d, at: r("Default"), speed: 3200, items: [
        { oval: [cx, cy, RX[1], RY[1]] }, { text: "default", x: cx, y: cy - RY[1] + 30, size: 46, w: 300 } ] }),
      <Ico dur={d} ctx={ctx} name="house" x={cx} y={cy + RY[1] - 50} size={70} at={r("whole")} />,
      ...Sketch({ dur: d, at: r("Protected"), speed: 3200, items: [
        { oval: [cx, cy, RX[2], RY[2]] }, { text: "protected", x: cx, y: cy - RY[2] + 30, size: 46, w: 320 } ] }),
      <Ico dur={d} ctx={ctx} name="baby" x={cx} y={cy + RY[2] - 50} size={70} at={r("children")} />,
      ...Sketch({ dur: d, at: r("Public"), speed: 3200, items: [
        { oval: [cx, cy, RX[3], RY[3]] }, { text: "public", x: cx, y: cy - RY[3] + 30, size: 46, w: 300 } ] }),
      <Ico dur={d} ctx={ctx} name="signpost" x={cx} y={cy + RY[3] - 50} size={70} at={r("street")} />,
    ], { hold: "walk in", holdY: 930, cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "Private", x: 540, y: 930, z: 1.0 }] }),
    // 4. what the question wants
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 520, size: 72, w: 960 },
        { text: "1.  the same package", x: 130, y: 720, size: 58, w: 880, align: "left", at: r("same") },
        { text: "2.  a different package", x: 130, y: 880, size: 58, w: 880, align: "left", at: r("different") } ] }),
      <Check dur={d} x={80} y={755} size={80} at={r("same") + 1.0} />,
      <Check dur={d} x={80} y={915} size={80} at={r("different") + 1.0} />,
    ]),
    // 5. fill the table column by column
    S("let's fill", (r, d) => [
      <Head dur={d} text="the table" y={160} size={140} sub="who can use what?" at={0.1} />,
      ...heads.map((h, i) => <Label key={"h" + i} dur={d} text={h} x={colX[i]} y={400} w={186} size={34} at={0.4 + i * 0.12} color={C.cobalt} />),
      ...rowNames.map((n, i) => <Box key={"r" + i} dur={d} x={150} y={rowY[i]} w={220} h={140} label={n} size={34} tone="b" at={0.6 + i * 0.12} />),
      ...[r("Same"), r("Same package"), r("Different package"), r("unrelated")].map((t, c) =>
        rowNames.map((n, ri) => [
          <Box key={"b" + c + ri} dur={d} x={colX[c]} y={rowY[ri]} w={186} h={140} tone={ok[ri][c] ? "b" : "a"} at={t + ri * 0.12} />,
          <Ico key={"i" + c + ri} dur={d} ctx={ctx} name={ok[ri][c] ? "check" : "x"} x={colX[c]} y={rowY[ri]} size={84} color={ok[ri][c] ? C.ink : C.coral} at={t + ri * 0.12 + 0.05} />,
        ])).flat(2),
      <Arrow dur={d} x1={266} y1={1250} x2={1022} y2={1250} color={C.coral} width={9} at={r("circle")} />,
      <Label dur={d} text="further away = fewer yes" x={644} y={1285} w={900} size={46} color={C.coral} at={r("circle") + 0.2} />,
    ], { hold: "circle shrinks", holdY: 830, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "Same", x: 540, y: 840, z: 1.02 }] }),
    // 6. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 160, fs: 44, title: "WRITE THIS · 5 MARKS", points: [
        "private: only inside the same class.",
        "default (no keyword): the same package only.",
        "protected: same package + subclasses in other packages.",
        "public: accessible from everywhere." ],
        times: [r("Private"), r("Default"), r("Protected"), r("Public")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 7. memory trick + payoff
    S("to remember", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "memory trick", x: 540, y: 380, size: 64, w: 900, color: C.cobalt },
        { text: "Me", x: 60, y: 520, size: 66, w: 480, align: "left", at: r("me") },
        { line: [545, 565, 655, 565], arrow: true, color: C.coral },
        { text: "private", x: 685, y: 530, size: 60, w: 380, align: "left", color: C.coral },
        { text: "My package", x: 60, y: 650, size: 66, w: 480, align: "left", at: r("My package") },
        { line: [545, 695, 655, 695], arrow: true, color: C.coral },
        { text: "default", x: 685, y: 660, size: 60, w: 380, align: "left", color: C.coral },
        { text: "My children", x: 60, y: 780, size: 66, w: 480, align: "left", at: r("My children") },
        { line: [545, 825, 655, 825], arrow: true, color: C.coral },
        { text: "protected", x: 685, y: 790, size: 60, w: 380, align: "left", color: C.coral },
        { text: "Everyone", x: 60, y: 910, size: 66, w: 480, align: "left", at: r("Everyone") },
        { line: [545, 955, 655, 955], arrow: true, color: C.coral },
        { text: "public", x: 685, y: 920, size: 60, w: 380, align: "left", color: C.coral },
        { text: "5 marks", x: 540, y: 1100, size: 150, w: 900, at: r("Five") } ] }),
      <Check dur={d} x={540} y={1440} size={180} at={r("Secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "Five", x: 540, y: 1000, z: 1.05 }] }),
  ];
};
