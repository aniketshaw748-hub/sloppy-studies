import { Box, Arrow, Mover, Ico, Tree, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
export const SCENES = ({ S, ctx, C }) => [
  // HOOK: an interface asks for a constructor
  S(null, (r, d) => [
    <Head dur={d} text={"INTERFACE\nCONSTRUCTOR?"} y={190} size={150} />,
    <Box dur={d} x={540} y={800} w={700} h={140} label="interface Shape" tone="b" at={0.2} />,
    <Box dur={d} x={540} y={1060} w={600} h={130} label="Shape() { }" tone="hot" at={r("constructor")} />,
    <Arrow dur={d} x1={540} y1={875} x2={540} y2={985} at={r("constructor")} color={C.coral} />,
    <Label dur={d} text="?" x={540} y={1190} w={300} size={200} color={C.coral} at={r("constructor") + 0.25} />,
  ], { cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "constructor", x: 540, y: 900, z: 1.06 }] }),
  // NO. a constructor builds an object
  S("no a constructor", (r, d) => [
    <Head dur={d} text="NO." y={190} size={330} color={C.coral} />,
    <Box dur={d} x={220} y={900} w={320} h={150} label="class Dog" tone="b" at={r("constructor")} />,
    <Arrow dur={d} x1={400} y1={900} x2={700} y2={900} label="constructor" at={r("builds")} color={C.coral} />,
    <Mascot dur={d} at={r("object")} size={300} tag="Dog" pts={[{ t: r("object"), x: 860, y: 900, look: [-1, 0], mood: "happy" }, { t: d - 0.1, x: 860, y: 900, mood: "happy" }]} />,
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "object", x: 540, y: 880, z: 1.04 }] }),
  // never create an object of an interface
  S("but you can never", (r, d) => [
    <Head dur={d} text="NEVER" y={190} size={260} />,
    <Box dur={d} x={540} y={640} w={760} h={140} label="interface Shape" tone="b" at={0.1} />,
    <Arrow dur={d} x1={540} y1={715} x2={540} y2={880} label="new" at={r("create")} color={C.cobalt} />,
    <Box dur={d} x={540} y={975} w={420} h={150} label="object" tone="ghost" at={r("object")} />,
    <XMark dur={d} x={540} y={975} size={260} at={r("interface")} />,
  ], { cam: [{ t: 0, x: 540, y: 750, z: 1.0 }, { t: "interface", x: 540, y: 800, z: 1.07 }], cut: "punch" }),
  // no instance fields to initialize
  S("it has no", (r, d) => [
    <Head dur={d} text="NO FIELDS" y={190} size={230} />,
    <Box dur={d} x={540} y={950} w={900} h={560} tone="ghost" at={0.1} />,
    <Label dur={d} text="interface Shape" x={540} y={700} w={700} size={44} font={C.fMono} color={C.cobalt} at={0.2} />,
    <Box dur={d} x={300} y={900} w={360} h={110} label="int x;" tone="ghost" at={r("instance")} />,
    <Box dur={d} x={780} y={900} w={360} h={110} label="int y;" tone="ghost" at={r("instance") + 0.15} />,
    <XMark dur={d} x={300} y={900} size={150} at={r("fields")} />,
    <XMark dur={d} x={780} y={900} size={150} at={r("fields") + 0.2} />,
    <Label dur={d} text="nothing to initialize" x={540} y={1100} w={860} size={46} font={C.fMono} color={C.coral} at={r("initialize")} />,
  ], { cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "fields", x: 540, y: 900, z: 1.05 }] }),
  // only public static final constants + abstract methods
  S("only public static", (r, d) => [
    <Head dur={d} text="ONLY 2 THINGS" y={190} size={175} />,
    <Box dur={d} x={200} y={640} w={260} h={120} label="public" tone="hot" at={r("public")} />,
    <Box dur={d} x={540} y={640} w={260} h={120} label="static" tone="hot" at={r("static")} />,
    <Box dur={d} x={880} y={640} w={260} h={120} label="final" tone="hot" at={r("final")} />,
    <Box dur={d} x={540} y={820} w={760} h={120} label="constants" tone="b" at={r("constants")} />,
    <Box dur={d} x={540} y={1050} w={560} h={120} label="abstract" tone="hot" at={r("abstract")} />,
    <Box dur={d} x={540} y={1210} w={560} h={120} label="methods" tone="b" at={r("methods")} />,
  ], { cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "abstract", x: 540, y: 950, z: 1.05 }] }),
  // nothing for a constructor to do
  S("so there is", (r, d) => [
    <Head dur={d} text="NOTHING TO DO" y={190} size={160} />,
    <Label dur={d} text="(no fields to set up)" x={540} y={1130} w={900} size={46} font={C.fMono} color={C.cobalt} at={r("nothing")} />,
    <Ico dur={d} ctx={ctx} name="hammer" x={540} y={760} size={320} color={C.coral} at={r("constructor")} />,
    <Label dur={d} text="constructor" x={540} y={960} w={900} size={60} at={r("constructor")} />,
    <XMark dur={d} x={540} y={760} size={300} at={r("do")} />,
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "constructor", x: 540, y: 880, z: 1.04 }] }),
  // compiler error
  S("java does not", (r, d) => [
    <Box dur={d} x={540} y={640} w={760} h={110} label="interface Shape {" tone="b" at={0.1} />,
    <Box dur={d} x={540} y={780} w={640} h={110} label="Shape() { }" tone="hot" at={r("allow") - 0.4} />,
    <XMark dur={d} x={540} y={780} size={200} at={r("allow")} />,
    <Box dur={d} x={540} y={920} w={300} h={100} label="}" tone="b" at={0.3} />,
    <Head dur={d} text={"COMPILE\nERROR"} y={1060} size={220} color={C.coral} at={r("error")} />,
  ], { cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "error", x: 540, y: 950, z: 1.05 }], cut: "punch" }),
  S("memory trick", (r, d) => [
    <Head dur={d} text={"MEMORY\nTRICK"} y={330} size={300} />,
    <Ico dur={d} ctx={ctx} name="lightbulb" x={540} y={1250} size={300} color={C.coral} at={0.3} />,
  ]),
  // no object, no constructor
  S("no object", (r, d) => [
    <Head dur={d} text="NO OBJECT" y={190} size={200} />,
    <Box dur={d} x={290} y={700} w={400} h={160} label="object" tone="ghost" at={0.15} />,
    <XMark dur={d} x={290} y={700} size={220} at={r("object")} />,
    <Ico dur={d} ctx={ctx} name="hammer" x={830} y={700} size={200} color={C.coral} at={r("constructor") - 0.2} />,
    <XMark dur={d} x={830} y={700} size={200} at={r("constructor") + 0.1} />,
    <Head dur={d} text="NO CONSTRUCTOR" y={960} size={160} color={C.coral} at={r("constructor")} />,
  ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "constructor", x: 540, y: 850, z: 1.05 }] }),
  S("write that", (r, d) => [
    <Head dur={d} text="2 MARKS" y={250} size={280} />,
    <Check dur={d} x={540} y={900} size={250} at={r("two")} />,
    <Mascot dur={d} size={300} tag="Dog" pts={[{ t: 0, x: 540, y: 1330, mood: "happy" }, { t: d - 0.1, x: 540, y: 1330, mood: "happy" }]} />,
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "marks", x: 540, y: 950, z: 1.1 }], cut: "punch" }),
];
