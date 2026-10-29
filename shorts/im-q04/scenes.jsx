import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "What is JIT?", n: 4, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "jit", x: 540, y: 780, z: 1.06 }] }),
  // 2a. from zero: a restaurant that cooks only when you order
  S("let's start", (r, d) => [
    <Ico dur={d} ctx={ctx} name="user-round" x={170} y={770} size={140} at={0.15} />,
    <Ico dur={d} ctx={ctx} name="chef-hat" x={540} y={770} size={140} at={0.35} />,
    <Ico dur={d} ctx={ctx} name="utensils" x={910} y={770} size={140} at={0.55} />,
    <Label dur={d} text="you" x={170} y={860} w={200} size={40} at={0.4} />,
    <Label dur={d} text="kitchen" x={540} y={860} w={240} size={40} at={0.55} />,
    <Label dur={d} text="your table" x={910} y={860} w={240} size={40} at={0.7} />,
    <Arrow dur={d} x1={260} y1={770} x2={440} y2={770} at={r("order")} label="order" color={C.coral} />,
    <Label dur={d} text="NO FOOD WAITING" x={540} y={990} w={960} size={86} color={C.coral} at={r("waiting")} />,
    <Arrow dur={d} x1={640} y1={770} x2={810} y2={770} at={r("plate")} />,
    <Mascot dur={d} on size={100} tag="1" at={r("plate") + 0.2} pts={[{ t: r("plate") + 0.2, x: 600, y: 630, look: [1, 0] }, { t: r("reaches") + 0.3, x: 850, y: 630, look: [1, 0], mood: "happy" }]} />,
    <Label dur={d} text="made as you ask = fresh" x={540} y={1150} w={960} size={60} at={r("table")} />,
  ], { hold: "fresh", holdY: 850, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "waiting", x: 540, y: 880, z: 1.03 }] }),
  // 2b. the opposite: 500 plates cooked in the morning and kept
  S("now picture", (r, d) => [
    <Head dur={d} text="500 PLATES" y={170} size={140} sub="cooked in the morning, then kept" />,
    ...Sketch({ dur: d, at: 0.3, speed: 3200, items: [{ line: [120, 760, 960, 760] }, { line: [120, 960, 960, 960] }] }),
    ...[190, 365, 540, 715, 890].map((x, i) => <Ico key={"a" + i} dur={d} ctx={ctx} name="utensils" x={x} y={690} size={100} at={r("cooks") + i * 0.12} />),
    ...[190, 365, 540, 715, 890].map((x, i) => <Ico key={"b" + i} dur={d} ctx={ctx} name="utensils" x={x} y={890} size={100} at={r("cooks") + 0.7 + i * 0.12} />),
    <Box dur={d} x={195} y={1170} w={270} h={120} label="FOOD" size={56} at={r("food")} />,
    <XMark dur={d} x={195} y={1290} size={70} at={r("food") + 0.4} />,
    <Box dur={d} x={540} y={1170} w={270} h={120} label="SPACE" size={56} at={r("space")} />,
    <XMark dur={d} x={540} y={1290} size={70} at={r("space") + 0.4} />,
    <Box dur={d} x={885} y={1170} w={270} h={120} label="MONEY" size={56} at={r("money")} />,
    <XMark dur={d} x={885} y={1290} size={70} at={r("money") + 0.4} />,
  ], { hold: "money", holdY: 900, cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "food", x: 540, y: 900, z: 1.03 }] }),
  // 3. the factory faces the same choice: stock costs money, space, spoils
  S("a factory faces", (r, d) => [
    <Ico dur={d} ctx={ctx} name="warehouse" x={540} y={560} size={230} at={0.15} />,
    <Ico dur={d} ctx={ctx} name="coins" x={150} y={850} size={110} color={C.coral} at={r("costs")} />,
    <Box dur={d} x={640} y={850} w={700} h={120} label="COSTS MONEY" size={52} at={r("costs")} />,
    <Ico dur={d} ctx={ctx} name="expand" x={150} y={1030} size={110} at={r("takes")} />,
    <Box dur={d} x={640} y={1030} w={700} h={120} label="TAKES SPACE" size={52} at={r("takes")} />,
    <Ico dur={d} ctx={ctx} name="hourglass" x={150} y={1210} size={110} color={C.coral} at={r("spoiled")} />,
    <Box dur={d} x={640} y={1210} w={700} h={120} label="SPOILS · GOES OUTDATED" size={46} at={r("spoiled")} />,
  ], { hold: "outdated", holdY: 880, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "takes", x: 540, y: 900, z: 1.03 }] }),
  // 4. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  what JIT stands for", x: 190, y: 720, size: 56, w: 860, align: "left", at: r("what jit") },
      { text: "2.  what the idea is", x: 190, y: 880, size: 56, w: 860, align: "left", at: r("what the") } ] }),
    <Check dur={d} x={125} y={755} size={80} at={r("what jit") + 0.9} />,
    <Check dur={d} x={125} y={915} size={80} at={r("what the") + 0.9} />,
  ]),
  // 5. JIT = just in time: the right moment, only the quantity needed
  S("jit stands for", (r, d) => [
    <Head dur={d} text="JUST IN TIME" y={170} size={120} />,
    <Arrow dur={d} x1={120} y1={880} x2={980} y2={880} at={0.4} label="TIME" />,
    <Arrow dur={d} x1={700} y1={600} x2={700} y2={880} head={false} color={C.coral} width={8} at={r("system")} />,
    <Label dur={d} text="WHEN NEEDED" x={700} y={540} w={420} size={44} color={C.coral} at={r("system")} />,
    <Mascot dur={d} on size={110} tag="5" at={r("arrive") - 0.3} pts={[{ t: r("arrive") - 0.3, x: 220, y: 780, look: [1, 0] }, { t: r("exactly") + 0.2, x: 700, y: 780, look: [1, 0], mood: "happy" }]} />,
    ...[200, 340, 480, 620, 760].map((x, i) => <Ico key={"q" + i} dur={d} ctx={ctx} name="package" x={x} y={1090} size={110} at={r("quantity") + i * 0.12} />),
    <Label dur={d} text="needed: 5   made: 5" x={540} y={1190} w={960} size={52} at={r("quantity") + 0.7} />,
    <XMark dur={d} x={420} y={780} size={80} at={r("earlier")} />,
    <Label dur={d} text="too early" x={420} y={915} w={300} size={40} color={C.coral} at={r("earlier")} />,
    <Ico dur={d} ctx={ctx} name="package" x={900} y={1090} size={110} color={C.coral} at={r("more")} />,
    <XMark dur={d} x={900} y={1090} size={90} at={r("more") + 0.15} />,
  ], { n: 2, hold: "not more", holdY: 880, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "exactly", x: 540, y: 880, z: 1.03 }] }),
  // 6. recap: right item, right amount, right time
  S("so right item", (r, d) => [
    <Box dur={d} x={540} y={700} w={700} h={130} label="RIGHT ITEM" size={64} at={r("item")} />,
    <Check dur={d} x={965} y={700} size={90} at={r("item") + 0.3} />,
    <Box dur={d} x={540} y={880} w={700} h={130} label="RIGHT AMOUNT" size={64} at={r("amount")} />,
    <Check dur={d} x={965} y={880} size={90} at={r("amount") + 0.3} />,
    <Box dur={d} x={540} y={1060} w={700} h={130} label="RIGHT TIME" size={64} tone="hot" at={r("time")} />,
    <Check dur={d} x={965} y={1060} size={90} at={r("time") + 0.3} />,
  ], { hold: "right time", holdY: 880, cam: [{ t: 0, x: 540, y: 880, z: 1.0 }, { t: "amount", x: 540, y: 890, z: 1.02 }] }),
  // 7. how it works: a PULL system, orders travel backwards
  S("how does it work", (r, d) => [
    <Head dur={d} text="PULL SYSTEM" y={170} size={120} sub="orders travel backwards" />,
    <Box dur={d} x={150} y={800} w={190} h={130} label="SUPPLIER" size={36} at={0.4} />,
    <Box dur={d} x={400} y={800} w={190} h={130} label="MAKE" size={42} at={0.55} />,
    <Box dur={d} x={650} y={800} w={190} h={130} label="ASSEMBLE" size={36} at={0.7} />,
    <Box dur={d} x={900} y={800} w={190} h={130} label="CUSTOMER" size={36} tone="hot" at={0.85} />,
    <Arrow dur={d} x1={880} y1={950} x2={680} y2={950} at={r("customer's")} color={C.coral} label="order" />,
    <Arrow dur={d} x1={630} y1={950} x2={430} y2={950} at={r("last stage")} color={C.coral} label="kanban" />,
    <Arrow dur={d} x1={380} y1={950} x2={180} y2={950} at={r("that stage")} color={C.coral} label="kanban" />,
    <Label dur={d} text="NOTHING MADE UNTIL ASKED" x={540} y={1120} w={980} size={66} color={C.coral} at={r("nothing")} />,
    <Mascot dur={d} on size={90} tag="1" at={r("downstream") - 0.1} pts={[{ t: r("downstream") - 0.1, x: 150, y: 670, look: [1, 0] }, { t: d - 0.35, x: 900, y: 670, look: [1, 0], mood: "happy" }]} />,
  ], { hold: "nothing", holdY: 900, cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "customer's", x: 540, y: 900, z: 1.03 }] }),
  // 8a. what we gain: inventory to zero, less space, lower holding cost, less waste
  S("what do we gain", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, speed: 3200, items: [{ line: [120, 720, 960, 720] }] }),
    ...[200, 330, 460, 590, 720, 850].map((x, i) => <Ico key={"p" + i} dur={d} ctx={ctx} name="package" x={x} y={645} size={100} at={0.2 + i * 0.1} out={r("falls") + 0.3 + i * 0.25} />),
    <Label dur={d} text="INVENTORY: CLOSE TO ZERO" x={540} y={760} w={980} size={66} color={C.coral} at={r("zero")} />,
    <Box dur={d} x={420} y={960} w={620} h={110} label="LESS STORAGE SPACE" size={46} at={r("storage")} />,
    <Check dur={d} x={830} y={960} size={80} at={r("storage") + 0.4} />,
    <Box dur={d} x={420} y={1110} w={620} h={110} label="LOWER HOLDING COST" size={46} at={r("holding")} />,
    <Check dur={d} x={830} y={1110} size={80} at={r("holding") + 0.4} />,
    <Box dur={d} x={420} y={1260} w={620} h={110} label="LESS WASTE" size={46} at={r("waste")} />,
    <Check dur={d} x={830} y={1260} size={80} at={r("waste") + 0.4} />,
  ], { hold: "waste", holdY: 950, cam: [{ t: 0, x: 540, y: 850, z: 1.0 }, { t: "storage", x: 540, y: 950, z: 1.03 }] }),
  // 8b. the price is trust: suppliers must deliver on time, no stock to fall back on
  S("the price is", (r, d) => [
    <Head dur={d} text="THE PRICE: TRUST" y={170} size={100} />,
    <Ico dur={d} ctx={ctx} name="truck" x={190} y={800} size={150} at={r("suppliers")} />,
    <Arrow dur={d} x1={290} y1={800} x2={600} y2={800} at={r("deliver")} />,
    <Box dur={d} x={800} y={800} w={320} h={150} label="FACTORY" size={54} at={0.3} />,
    <Ico dur={d} ctx={ctx} name="clock" x={450} y={650} size={110} color={C.coral} at={r("time")} />,
    <Label dur={d} text="EVERY TIME" x={450} y={900} w={500} size={64} color={C.coral} at={r("every")} />,
    <Mascot dur={d} on size={100} tag="?" at={0.5} pts={[{ t: 0.5, x: 800, y: 650, look: [-1, 0] }, { t: r("because") - 0.1, x: 800, y: 650, look: [-1, 0], mood: "think" }, { t: r("because") + 0.4, x: 800, y: 650, look: [0, 1], mood: "shock" }]} />,
    <Label dur={d} text="NO STOCK TO FALL BACK ON" x={540} y={1060} w={980} size={66} color={C.coral} at={r("stock")} />,
  ], { hold: "fall back", holdY: 880, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "every", x: 540, y: 870, z: 1.03 }] }),
  // 9. the exam answer
  S("in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 42, title: "WRITE THIS · 5 MARKS", points: [
      "JIT (Just In Time): produces and delivers goods only when needed, and only in the quantity needed.",
      "It works as a pull system, using kanban.",
      "Aim: zero inventory and removal of waste." ],
      times: [r("jit"), r("it works"), r("its aim")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 10. memory trick + payoff
  S("and to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "JIT means", x: 540, y: 540, size: 80, w: 960 },
      { text: "no stock, just ON TIME", x: 540, y: 680, size: 72, w: 980, color: C.coral, at: r("no stock") },
      { text: "5 marks", x: 540, y: 960, size: 150, w: 900, at: r("five") } ] }),
    <Check dur={d} x={540} y={1360} size={180} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.06 }] }),
];
