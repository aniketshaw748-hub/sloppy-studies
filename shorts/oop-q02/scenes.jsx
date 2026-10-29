import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const lvl = (d, y, name, icon, who, at, whoAt, tone, nl) => [
    <Box key={"b" + y} dur={d} x={370} y={y} w={380} h={120} label={name} tone={tone || "a"} at={at} />,
    <Ico key={"i" + y} dur={d} ctx={ctx} name={icon} x={100} y={y} size={100} color={tone === "hot" ? C.coral : C.cobalt} at={at + 0.15} />,
    <Label key={"l" + y} dur={d} text={who} x={600} y={y - (nl ? 45 : 22)} w={420} align="left" size={36} color={tone === "hot" ? C.coral : C.navy} at={whoAt} />,
  ];
  return [
    // 1. the question
    S(null, (r, d) => [
      ...QuestionCard({ dur: d, text: "Which access specifier allows a class member to be accessed only within its own class?", n: 2, marks: 2, y: 500 }),
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "only", x: 540, y: 780, z: 1.05 }] }),
    // 2a. from zero: a class has members; an access specifier decides who may use a member
    S("let's start", (r, d) => [
      <Head dur={d} text="members" y={190} size={170} sub="what a class holds" />,
      ...Sketch({ dur: d, at: r("class"), speed: 3600, items: [{ rect: [140, 500, 800, 380], divider: [100], label: "class Account", size: 44 }] }),
      ...Sketch({ dur: d, at: r("variables"), items: [{ text: "int balance;", x: 190, y: 640, size: 46, w: 480, align: "left" }, { text: "variable", x: 720, y: 648, size: 36, w: 220, align: "left", color: C.coral }] }),
      ...Sketch({ dur: d, at: r("methods"), items: [{ text: "void deposit()", x: 190, y: 770, size: 46, w: 520, align: "left" }, { text: "method", x: 720, y: 778, size: 36, w: 220, align: "left", color: C.coral }] }),
      <Box dur={d} x={540} y={1110} w={700} h={120} label="access specifier" tone="b" at={r("access")} />,
      <Arrow dur={d} x1={540} y1={1040} x2={540} y2={905} color={C.coral} width={9} at={r("keyword")} />,
      ...Sketch({ dur: d, at: r("decides"), items: [{ text: "decides WHO may use it", x: 540, y: 1260, size: 50, w: 960, color: C.coral }] }),
    ], { hold: "use", holdY: 900, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "access", x: 540, y: 930, z: 1.04 }] }),
    // 2b. analogy: your house
    S("think of", (r, d) => [
      <Head dur={d} text="your house" y={190} size={150} />,
      ...Sketch({ dur: d, at: r("house"), speed: 3400, items: [{ line: [240, 650, 540, 450] }, { line: [540, 450, 840, 650] }, { rect: [260, 650, 560, 440] }, { line: [540, 650, 540, 1090] }] }),
      ...Sketch({ dur: d, at: r("living"), items: [{ text: "living room", x: 400, y: 690, size: 34, w: 260, color: C.coral }] }),
      <Ico dur={d} ctx={ctx} name="door-open" x={400} y={930} size={130} color={C.cobalt} at={r("open")} />,
      <Ico dur={d} ctx={ctx} name="users-round" x={145} y={930} size={110} at={r("guests")} />,
      <Arrow dur={d} x1={210} y1={930} x2={320} y2={930} color={C.coral} width={8} at={r("guests") + 0.3} />,
      ...Sketch({ dur: d, at: r("but"), items: [{ text: "your room", x: 680, y: 690, size: 34, w: 260, color: C.coral }] }),
      <Ico dur={d} ctx={ctx} name="notebook" x={680} y={860} size={130} at={r("diary")} />,
      <Ico dur={d} ctx={ctx} name="lock" x={680} y={1010} size={100} color={C.coral} at={r("locked")} />,
    ], { hold: "own", holdY: 900, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "diary", x: 560, y: 880, z: 1.04 }] }),
    // 3. what the question wants
    S("so the question", (r, d) => [
      ...Sketch({ dur: d, at: 0.1, items: [
        { text: "the question wants:", x: 540, y: 520, size: 72, w: 960 },
        { text: "one word", x: 540, y: 700, size: 100, w: 900, color: C.coral, at: r("one") },
        { text: "the lock that opens", x: 540, y: 880, size: 54, w: 900, at: r("lock") },
        { text: "only from inside", x: 540, y: 960, size: 54, w: 900, at: r("only") } ] }),
      <Ico dur={d} ctx={ctx} name="lock" x={540} y={1230} size={220} color={C.coral} at={r("inside")} />,
    ]),
    // 4. four levels
    S("java has", (r, d) => [
      <Head dur={d} text="4 levels" y={190} size={150} sub="who may use it?" />,
      ...lvl(d, 520, "public", "lock-open", "anyone", r("public"), r("anyone")),
      ...lvl(d, 710, "protected", "lock-keyhole-open", "same package\n+ child classes", r("protected"), r("same"), "a", true),
      ...lvl(d, 900, "default", "lock-keyhole", "same package\nonly", r("default"), r("default") + 1.0, "a", true),
      ...lvl(d, 1090, "private", "lock", "only the class\nitself", r("private"), r("private") + 0.9, "hot", true),
    ], { hold: "itself", holdY: 900, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "protected", x: 540, y: 860, z: 1.03 }, { t: "private", x: 540, y: 960, z: 1.03 }] }),
    // 5. private = tightest lock: nobody outside, not even a child class
    S("so private is", (r, d) => [
      <Head dur={d} text="private" y={190} size={170} sub="the tightest lock" />,
      ...Sketch({ dur: d, at: 0.3, speed: 3400, items: [{ rect: [140, 540, 800, 420], divider: [100], label: "class Home", size: 44 }] }),
      <Box dur={d} x={540} y={800} w={560} h={110} label="private pin" tone="hot" at={r("tightest")} />,
      <Mascot dur={d} size={200} tag="Other" pts={[{ t: 0, x: 250, y: 1330, look: [1, -1] }, { t: r("touch") - 0.3, x: 250, y: 1330, look: [1, -1] }, { t: r("touch") + 0.4, x: 330, y: 1130, look: [1, -1] }, { t: r("touch") + 0.9, x: 250, y: 1330, look: [0, 0], mood: "shock" }]} />,
      <XMark dur={d} x={380} y={985} size={90} at={r("touch") + 0.5} />,
      <Box dur={d} x={800} y={1330} w={300} h={110} label="Child" tone="b" at={r("even") - 0.3} />,
      <Arrow dur={d} x1={800} y1={1260} x2={800} y2={1020} color={C.coral} width={9} at={r("child")} />,
      <XMark dur={d} x={800} y={1000} size={90} at={r("child") + 0.5} />,
    ], { hold: "even", holdY: 900, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "touch", x: 540, y: 1000, z: 1.04 }] }),
    // 6. the exam answer
    S("so in your exam", (r, d) => [
      ...AnswerSheet({ dur: d, y: 200, fs: 36, title: "WRITE THIS · 2 MARKS", points: [
        "The answer is the private access specifier.",
        "A private member is accessible only within its own class.",
        "No other class can use it, not even a subclass." ],
        times: [r("private"), r("member"), r("own")] }),
    ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
    // 7. memory trick + payoff
    S("remember", (r, d) => [
      <Head dur={d} text="private = diary lock" y={190} size={130} />,
      <Ico dur={d} ctx={ctx} name="notebook" x={380} y={800} size={280} at={r("diary") - 0.4} />,
      <Ico dur={d} ctx={ctx} name="lock" x={700} y={800} size={280} color={C.coral} at={r("lock") - 0.3} />,
      <Mascot dur={d} size={220} tag="Home" pts={[{ t: 0, x: 540, y: 1080, look: [0, -1] }, { t: r("two"), x: 540, y: 1080, look: [0, 0], mood: "happy" }]} />,
      ...Sketch({ dur: d, at: r("two"), items: [{ text: "2 marks", x: 540, y: 1200, size: 120, w: 900 }] }),
      <Check dur={d} x={540} y={1400} size={110} at={r("secured")} />,
    ], { cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "lock", x: 540, y: 900, z: 1.02 }] }),
  ];
};
