import { Box, Arrow, Mover, Ico, Tree, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const Cls = (d, y, h, at = 0.2) => [
    <Box key="c" dur={d} x={540} y={y} w={940} h={h} tone="ghost" at={at} />,
    <Label key="l" dur={d} text="class Diary" x={540} y={y - h / 2 + 30} w={600} size={44} font={C.fMono} color={C.cobalt} at={at + 0.1} />];
  return [
    // HOOK: a diary with a lock
    S(null, (r, d) => [
      <Head dur={d} text="YOUR DIARY" y={190} size={220} />,
      <Box dur={d} x={540} y={900} w={460} h={560} label="DIARY" tone="b" at={0.2} />,
      <Ico dur={d} ctx={ctx} name="lock" x={540} y={1060} size={170} color={C.coral} on at={r("lock")} />,
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "lock", x: 540, y: 950, z: 1.08 }] }),
    // that lock = private
    S("in java", (r, d) => [
      <Box dur={d} x={270} y={700} w={400} h={120} label="private" tone="hot" at={0.1} />,
      <Box dur={d} x={730} y={700} w={480} h={120} label="String diary;" at={0.3} />,
      <Ico dur={d} ctx={ctx} name="lock" x={540} y={1030} size={300} color={C.coral} at={r("called")} />,
      <Head dur={d} text="private" y={190} size={230} at={r("private")} />,
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "private", x: 540, y: 850, z: 1.07 }] }),
    // accessed only within its own class
    S("the private", (r, d) => [
      <Head dur={d} text="PRIVATE" y={190} size={200} />,
      ...Cls(d, 1000, 700),
      <Box dur={d} x={540} y={820} w={760} h={110} label="private int pin;" tone="hot" at={r("member")} />,
      <Box dur={d} x={540} y={1130} w={400} h={110} label="show()" tone="b" at={r("accessed")} />,
      <Arrow dur={d} x1={540} y1={1070} x2={540} y2={885} at={r("only")} color={C.coral} />,
      <Check dur={d} x={860} y={980} size={120} at={r("within")} />,
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "within", x: 540, y: 960, z: 1.05 }] }),
    // not subclasses, not other classes, not same package
    S("not by subclasses", (r, d) => [
      <Head dur={d} text="ONLY MY CLASS" y={190} size={170} />,
      ...Cls(d, 1200, 330, 0.1),
      <Box dur={d} x={540} y={1250} w={700} h={100} label="private int pin;" tone="hot" at={0.2} />,
      <Box dur={d} x={200} y={640} w={270} h={110} label="subclass" tone="b" at={r("subclasses")} />,
      <Arrow dur={d} x1={200} y1={700} x2={200} y2={1030} at={r("subclasses") + 0.1} color={C.navy} />,
      <XMark dur={d} x={200} y={865} size={110} at={r("subclasses") + 0.4} />,
      <Box dur={d} x={540} y={640} w={270} h={110} label="other class" at={r("other")} />,
      <Arrow dur={d} x1={540} y1={700} x2={540} y2={1030} at={r("other") + 0.1} color={C.navy} />,
      <XMark dur={d} x={540} y={865} size={110} at={r("other") + 0.4} />,
      <Box dur={d} x={870} y={640} w={270} h={110} label="same package" tone="b" at={r("same")} />,
      <Arrow dur={d} x1={870} y1={700} x2={870} y2={1030} at={r("same") + 0.1} color={C.navy} />,
      <XMark dur={d} x={870} y={865} size={110} at={r("same") + 0.4} />,
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "other", x: 540, y: 930, z: 1.02 }, { t: "same", x: 540, y: 930, z: 1.03 }] }),
    // outsiders use public getters/setters
    S("outsiders must", (r, d) => [
      <Head dur={d} text="GET + SET" y={190} size={200} />,
      <Box dur={d} x={540} y={680} w={400} h={120} label="Outsider" at={0.1} />,
      ...Cls(d, 1250, 600, 0.2),
      <Box dur={d} x={330} y={1120} w={340} h={100} label="getPin()" tone="b" at={r("getters")} />,
      <Arrow dur={d} x1={440} y1={745} x2={340} y2={1065} at={r("getters")} color={C.cobalt} />,
      <Arrow dur={d} x1={330} y1={1175} x2={430} y2={1365} at={r("getters") + 0.3} color={C.cobalt} />,
      <Box dur={d} x={750} y={1120} w={340} h={100} label="setPin()" tone="b" at={r("setters")} />,
      <Arrow dur={d} x1={640} y1={745} x2={740} y2={1065} at={r("setters")} color={C.cobalt} />,
      <Arrow dur={d} x1={750} y1={1175} x2={650} y2={1365} at={r("setters") + 0.3} color={C.cobalt} />,
      <Box dur={d} x={540} y={1420} w={700} h={100} label="private int pin;" tone="hot" at={0.4} />,
    ], { cam: [{ t: 0, x: 540, y: 950, z: 1.0 }, { t: "getters", x: 540, y: 1000, z: 1.04 }] }),
    // encapsulation = data hiding
    S("this is", (r, d) => [
      <Head dur={d} text="encapsulation" y={190} size={160} />,
      <Box dur={d} x={540} y={1000} w={720} h={560} tone="ghost" at={0.15} />,
      <Box dur={d} x={540} y={960} w={420} h={120} label="data" tone="hot" at={0.3} />,
      <Label dur={d} text="= DATA HIDING" x={540} y={430} w={960} size={70} color={C.coral} at={r("data")} />,
      <Ico dur={d} ctx={ctx} name="eye-off" x={540} y={1180} size={110} color={C.cobalt} at={r("hiding")} />,
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "hiding", x: 540, y: 880, z: 1.04 }] }),
    // memory trick
    S("memory trick", (r, d) => [
      <Head dur={d} text={"MEMORY\nTRICK"} y={330} size={300} />,
      <Ico dur={d} ctx={ctx} name="lightbulb" x={540} y={1250} size={300} color={C.coral} at={0.4} />,
    ]),
    // private = only me
    S("private means", (r, d) => [
      <Head dur={d} text="private = only me" y={190} size={118} />,
      <Ico dur={d} ctx={ctx} name="lock" x={540} y={1000} size={560} color={C.coral} on at={0.15} />,
      <Mascot dur={d} on size={260} tag="Diary" pts={[{ t: 0, x: 170, y: 1450, look: [1, -1] }, { t: r("only") - 0.3, x: 170, y: 1450, look: [1, -1] }, { t: r("only") + 0.5, x: 540, y: 1130, look: [0, 0], mood: "happy" }]} />,
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "only", x: 540, y: 960, z: 1.06 }] }),
    // payoff
    S("write that", (r, d) => [
      <Head dur={d} text="2 MARKS" y={250} size={280} />,
      <Check dur={d} x={540} y={900} size={250} at={r("two")} />,
      <Mascot dur={d} size={300} tag="Diary" pts={[{ t: 0, x: 540, y: 1330, mood: "happy" }, { t: d - 0.1, x: 540, y: 1330, mood: "happy" }]} />,
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: "marks", x: 540, y: 950, z: 1.1 }], cut: "punch" }),
  ];
};
