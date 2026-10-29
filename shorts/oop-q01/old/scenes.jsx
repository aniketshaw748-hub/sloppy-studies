import { Box, Arrow, Mover, Ico, Tree, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const Blk = (w, h, label, hot) => [
    <rect key="r" x={0} y={0} width={w} height={h} radius={14} fill={hot ? C.coral : C.chip} strokeColor={C.navy} strokeWidth={4} />,
    <text key="t" x={10} y={h / 2 - 34} width={w - 20} align="center" fontFamily={C.fBody} fontWeight={C.wBody} fontSize={56} lineHeight={1} color={hot ? C.ink : C.chipText}>{label}</text>];
  const drawer = [[300, 800, "Student"], [780, 800, "Main"], [300, 980, "Util"], [780, 980, "Cart"], [300, 1160, "Order"], [780, 1160, "Student"]];
  return [
    // HOOK: every class dumped into one junk drawer
    S(null, (r, d) => [
      <Head dur={d} text={"ONE JUNK\nDRAWER"} y={190} size={200} />,
      <Box dur={d} x={540} y={1020} w={900} h={760} tone="ghost" at={0.1} />,
      ...drawer.map(([x, y, l], i) => <Box key={i} dur={d} x={x} y={y} w={400} h={120} label={l} tone={i === 5 ? "hot" : "a"} at={[0.4, r("folders"), r("every"), r("lived"), r("giant"), r("junk")][i]} />),
      <Label dur={d} text="(no packages)" x={540} y={1290} size={44} font={C.fMono} at={r("one")} color={C.cobalt} />,
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "junk", x: 540, y: 900, z: 1.07 }] }),
    // two classes, same name -> crash
    S("two classes", (r, d) => [
      <Head dur={d} text="SAME NAME" y={190} size={200} />,
      <Mover dur={d} on cw={380} ch={130} pts={[{ t: 0, x: 230, y: 620 }, { t: r("same"), x: 230, y: 620 }, { t: r("crash"), x: 530, y: 620 }]}>{Blk(380, 130, "Student", false)}</Mover>,
      <Mover dur={d} on cw={380} ch={130} pts={[{ t: 0, x: 850, y: 620 }, { t: r("same"), x: 850, y: 620 }, { t: r("crash"), x: 550, y: 620 }]}>{Blk(380, 130, "Student", true)}</Mover>,
      <XMark dur={d} x={540} y={620} size={230} at={r("crash")} />,
      <Head dur={d} text="CRASH" y={860} size={330} at={r("crash")} color={C.coral} />,
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "crash", x: 540, y: 850, z: 1.1 }] }),
    // package keyword = separate folders, no clash
    S("the package", (r, d) => [
      <Head dur={d} text="package" y={190} size={230} />,
      <Box dur={d} x={290} y={900} w={400} h={460} tone="ghost" at={0.2} />,
      <Box dur={d} x={790} y={900} w={400} h={460} tone="ghost" at={0.2} />,
      <Label dur={d} text="school/" x={290} y={700} w={400} size={46} font={C.fMono} color={C.cobalt} at={0.3} />,
      <Label dur={d} text="shop/" x={790} y={700} w={400} size={46} font={C.fMono} color={C.cobalt} at={0.3} />,
      <Box dur={d} x={290} y={960} w={340} h={120} label="Student" at={r("keyword")} />,
      <Box dur={d} x={790} y={960} w={340} h={120} label="Student" tone="hot" at={r("keyword") + 0.2} />,
      <Label dur={d} text="school.Student ≠ shop.Student" x={540} y={1250} w={980} size={40} font={C.fMono} at={r("fixes")} />,
      <Check dur={d} x={540} y={1440} size={150} at={r("fixes")} />,
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "fixes", x: 540, y: 950, z: 1.05 }] }),
    // groups related classes + interfaces into one named namespace
    S("a package groups", (r, d) => [
      <Head dur={d} text="namespace" y={190} size={200} />,
      <Box dur={d} x={540} y={850} w={900} h={640} tone="ghost" at={r("one")} />,
      ...Tree({ dur: d, bx: 100, by: 640, bw: 880, bh: 420, nodes: [
        { id: "p", label: "shop", sub: "package", tone: "hot", at: 0.1 },
        { id: "c1", label: "Cart", sub: "class", parent: "p", at: r("classes") },
        { id: "c2", label: "Order", sub: "class", parent: "p", at: r("classes") + 0.25 },
        { id: "c3", label: "Payable", sub: "interface", parent: "p", tone: "b", at: r("interfaces") }] }),
    ], { cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "namespace", x: 540, y: 850, z: 1.04 }] }),
    // three jobs
    S("it prevents", (r, d) => [
      <Head dur={d} text="3 JOBS" y={190} size={200} />,
      <Ico dur={d} ctx={ctx} name="ban" x={130} y={600} size={110} color={C.coral} at={r("prevents")} />,
      <Box dur={d} x={610} y={600} w={760} h={140} label="no name clash" sub="shop.Student ≠ school.Student" at={r("prevents")} />,
      <Ico dur={d} ctx={ctx} name="lock" x={130} y={900} size={110} color={C.coral} at={r("controls")} />,
      <Box dur={d} x={610} y={900} w={760} h={140} label="controls access" sub="default = same package only" tone="b" at={r("controls")} />,
      <Ico dur={d} ctx={ctx} name="search" x={130} y={1200} size={110} color={C.coral} at={r("makes")} />,
      <Box dur={d} x={610} y={1200} w={760} h={140} label="find + reuse" sub="import shop.Cart;" at={r("makes")} />,
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "controls", x: 540, y: 900, z: 1.04 }, { t: "makes", x: 540, y: 1000, z: 1.05 }] }),
    // first statement in the file
    S("it must be", (r, d) => [
      <Head dur={d} text="FIRST LINE" y={190} size={200} />,
      <Box dur={d} x={540} y={800} w={900} h={110} label="import java.util.*;" at={0.1} />,
      <Box dur={d} x={540} y={940} w={900} h={110} label="class Cart { }" at={0.3} />,
      <Box dur={d} x={540} y={660} w={900} h={110} label="package shop;" tone="hot" at={r("first")} />,
      <Arrow dur={d} x1={540} y1={430} x2={540} y2={596} at={r("statement")} color={C.coral} />,
      <Label dur={d} text="LINE 1" x={800} y={470} w={300} size={50} color={C.coral} at={r("statement")} />,
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "statement", x: 540, y: 760, z: 1.1 }] }),
    // memory trick intro
    S("memory trick", (r, d) => [
      <Head dur={d} text={"MEMORY\nTRICK"} y={330} size={300} />,
      <Ico dur={d} ctx={ctx} name="lightbulb" x={540} y={1250} size={300} color={C.coral} at={0.4} />,
    ]),
    // package = folder
    S("package equals", (r, d) => [
      <Head dur={d} text="package = folder" y={190} size={120} />,
      <Ico dur={d} ctx={ctx} name="folder" x={540} y={950} size={520} color={C.coral} at={0.15} />,
      <Mascot dur={d} on size={300} tag="Cart" pts={[{ t: 0, x: 180, y: 1400, look: [1, -1] }, { t: r("equals"), x: 180, y: 1400, look: [1, -1] }, { t: r("folder") + 0.5, x: 540, y: 960, look: [0, 0], mood: "happy" }]} />,
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "folder", x: 540, y: 950, z: 1.08 }] }),
    // payoff
    S("write that", (r, d) => [
      <Head dur={d} text="2 MARKS" y={250} size={280} />,
      <Check dur={d} x={540} y={900} size={250} at={r("two")} />,
      <Mascot dur={d} size={300} tag="Cart" pts={[{ t: 0, x: 540, y: 1330, mood: "happy" }, { t: d - 0.1, x: 540, y: 1330, mood: "happy" }]} />,
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "marks", x: 540, y: 950, z: 1.1 }], cut: "punch" }),
  ];
};
