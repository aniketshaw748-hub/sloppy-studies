import { Box, Arrow, Ico, Table, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
  return [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "What are the types of purchase orders?", n: 13, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "purchase", x: 540, y: 780, z: 1.06 }] }),

  // 2. from zero: a purchase order = written order buyer -> supplier; what/how many/price/when; accepted = binding contract
  S("let's start", (r, d) => [
    <Head dur={d} text="PURCHASE ORDER" y={170} size={100} at={0.1} />,
    <Box dur={d} x={230} y={520} w={300} h={120} label="BUYER" at={r("buyer")} />,
    <Ico dur={d} ctx={ctx} name="file-text" x={540} y={520} size={150} at={r("written")} />,
    <Arrow dur={d} x1={385} y1={520} x2={462} y2={520} at={r("written") + 0.3} width={7} />,
    <Box dur={d} x={850} y={520} w={300} h={120} label="SUPPLIER" at={r("supplier")} />,
    <Arrow dur={d} x1={618} y1={520} x2={695} y2={520} at={r("supplier")} width={7} />,
    <Box dur={d} x={290} y={760} w={440} h={110} label="WHAT" at={r("what")} />,
    <Box dur={d} x={790} y={760} w={440} h={110} label="HOW MANY" at={r("how")} />,
    <Box dur={d} x={290} y={910} w={440} h={110} label="PRICE" at={r("price")} />,
    <Box dur={d} x={790} y={910} w={440} h={110} label="BY WHEN" at={r("by when")} />,
    <Check dur={d} x={360} y={1120} size={110} at={r("accepts")} color={C.coral} />,
    <Ico dur={d} ctx={ctx} name="handshake" x={700} y={1120} size={170} at={r("binding") - 0.3} />,
    <Label dur={d} text="BINDING CONTRACT" x={540} y={1280} w={900} size={64} at={r("contract")} color={C.coral} />,
    <Ico dur={d} ctx={ctx} name="utensils" x={540} y={1440} size={120} at={r("ordering")} />,
  ], { hold: "contract", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "what", x: 540, y: 820, z: 1.03 }, { t: "binding", x: 540, y: 960, z: 1.03 }] }),

  // 3. what the question wants: the main types
  S("so the question", (r, d) => [
    <Head dur={d} text="4 TYPES" y={190} size={190} at={0.1} />,
    <Box dur={d} x={290} y={640} w={440} h={120} label="STANDARD" at={r("main")} />,
    <Box dur={d} x={790} y={640} w={440} h={120} label="PLANNED" at={r("main") + 0.2} />,
    <Box dur={d} x={290} y={810} w={440} h={120} label="BLANKET" at={r("main") + 0.4} />,
    <Box dur={d} x={790} y={810} w={440} h={120} label="CONTRACT" at={r("main") + 0.6} />,
    <Label dur={d} text="what makes each one different?" x={540} y={1000} w={960} size={50} at={r("makes")} color={C.coral} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "makes", x: 540, y: 800, z: 1.03 }] }),

  // 4. standard: one-time, everything fixed
  S("first the standard", (r, d) => [
    <Head dur={d} text="1 · STANDARD" y={170} size={100} at={0.1} />,
    <Label dur={d} text="one-time purchase" x={540} y={420} w={900} size={56} at={r("one")} color={C.coral} />,
    ...Table({ dur: d, x: 120, y: 520, w: 840, cols: ["Field", "Fixed value"], rows: [["Items", "pizza"], ["Quantity", "1"], ["Price", "Rs 300"], ["Delivery", "today"]], rowH: 96, fs: 44, at: r("everything"),
      cellAt: [[r("items"), r("pizza") + 0.0], [r("quantity"), r("pizza") + 0.15], [r("price"), r("pizza") + 0.3], [r("delivery"), r("pizza") + 0.45]] }),
    <Label dur={d} text="EVERYTHING IS FIXED" x={540} y={1110} w={900} size={56} at={r("fixed")} color={C.coral} />,
    <Ico dur={d} ctx={ctx} name="pizza" x={540} y={1330} size={200} at={r("pizza")} />,
  ], { hold: "today", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "items", x: 540, y: 820, z: 1.03 }, { t: "pizza", x: 540, y: 940, z: 1.03 }] }),

  // 5. planned: long-term, schedule known, releases later
  S("second the planned", (r, d) => [
    <Head dur={d} text="2 · PLANNED" y={170} size={100} at={0.1} />,
    <Box dur={d} x={540} y={480} w={880} h={120} label="LONG-TERM AGREEMENT" tone="hot" size={50} at={r("long")} />,
    <Box dur={d} x={190} y={640} w={290} h={90} label="items" size={42} at={r("items")} />,
    <Box dur={d} x={540} y={640} w={290} h={90} label="quantities" size={42} at={r("quantities")} />,
    <Box dur={d} x={890} y={640} w={290} h={90} label="schedule" size={42} at={r("schedule")} />,
    <Check dur={d} x={300} y={600} size={60} at={r("items") + 0.5} color={C.coral} />,
    <Check dur={d} x={650} y={600} size={60} at={r("quantities") + 0.5} color={C.coral} />,
    <Check dur={d} x={1000} y={600} size={60} at={r("schedule") + 0.6} color={C.coral} />,
    <Label dur={d} text="exact deliveries released LATER" x={540} y={770} w={960} size={52} at={r("release")} color={C.coral} />,
    ...DAYS.map((t, i) => <Box key={t} dur={d} x={130 + 185 * i} y={950} w={170} h={100} label={t} size={44} at={r("tiffin") + i * 0.15} />),
    <Ico dur={d} ctx={ctx} name="utensils" x={540} y={1150} size={170} at={r("service")} />,
    <Label dur={d} text="tiffin service · weekly plan" x={540} y={1290} w={960} size={52} at={r("weekly")} />,
  ], { hold: "weekly", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "release", x: 540, y: 850, z: 1.0 }, { t: "tiffin", x: 540, y: 960, z: 1.0 }] }),

  // 6. blanket: one supplier, repeat buying at pre-agreed price, release when needed, no fixed dates; tea stall account
  S("third the blanket", (r, d) => [
    <Head dur={d} text="3 · BLANKET" y={170} size={100} at={0.1} />,
    <Box dur={d} x={540} y={500} w={640} h={120} label="ONE SUPPLIER" tone="hot" at={r("agreement")} />,
    <Label dur={d} text="price agreed in advance" x={540} y={600} w={900} size={48} at={r("pre")} color={C.coral} />,
    <Arrow dur={d} x1={100} y1={850} x2={980} y2={850} at={r("repeat")} width={8} />,
    <Label dur={d} text="time" x={930} y={870} w={160} size={38} font={C.fMono} at={r("repeat") + 0.3} />,
    ...[[170, "10"], [400, "25"], [700, "5"], [900, "40"]].map(([x, q], i) => <Box key={q} dur={d} x={x} y={760} w={140} h={90} label={q} size={50} at={r("release") + i * 0.35} />),
    <Ico dur={d} ctx={ctx} name="calendar-days" x={300} y={1010} size={120} at={r("fixed") - 0.4} />,
    <XMark dur={d} x={300} y={1010} size={130} at={r("fixed")} />,
    <Label dur={d} text="no fixed dates" x={720} y={985} w={500} size={52} at={r("fixed") + 0.1} color={C.coral} />,
    <Ico dur={d} ctx={ctx} name="coffee" x={300} y={1240} size={170} at={r("stall") - 0.2} />,
    <Label dur={d} text="take what you need" x={300} y={1370} w={520} size={44} at={r("take")} />,
    <Arrow dur={d} x1={410} y1={1240} x2={560} y2={1240} at={r("take") + 0.5} width={7} />,
    <Box dur={d} x={800} y={1240} w={420} h={120} label="PAY MONTHLY" tone="hot" at={r("pay")} />,
  ], { hold: "monthly", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "repeat", x: 540, y: 820, z: 1.03 }, { t: "stall", x: 540, y: 960, z: 1.03 }] }),

  // 7. contract: only terms agreed; items and quantities later by separate orders
  S("fourth the contract", (r, d) => [
    <Head dur={d} text="4 · CONTRACT" y={170} size={100} at={0.1} />,
    <Label dur={d} text="only the TERMS are agreed" x={540} y={420} w={960} size={52} at={r("only")} color={C.coral} />,
    <Box dur={d} x={290} y={560} w={440} h={110} label="price" size={46} at={r("price")} />,
    <Box dur={d} x={790} y={560} w={440} h={110} label="validity" size={46} at={r("validity")} />,
    <Box dur={d} x={290} y={700} w={440} h={110} label="payment" size={46} at={r("payment")} />,
    <Box dur={d} x={790} y={700} w={440} h={110} label="delivery terms" size={46} at={r("delivery")} />,
    <Arrow dur={d} x1={540} y1={790} x2={540} y2={915} at={r("items")} width={7} />,
    <Label dur={d} text="items + quantities come LATER" x={540} y={950} w={960} size={50} at={r("items") + 0.2} color={C.coral} />,
    ...[190, 540, 890].map((x, i) => <Box key={x} dur={d} x={x} y={1100} w={260} h={110} label={"order " + (i + 1)} size={46} at={r("separate") + i * 0.2} />),
    <Ico dur={d} ctx={ctx} name="calendar-days" x={540} y={1300} size={150} at={r("annual")} />,
    <Label dur={d} text="annual catering agreement" x={540} y={1420} w={960} size={50} at={r("catering")} />,
  ], { hold: "agreement", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "items", x: 540, y: 880, z: 1.03 }, { t: "annual", x: 540, y: 980, z: 1.03 }] }),

  // 8. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 40, title: "WRITE THIS · 5 MARKS", points: [
      "Purchase order = the buyer's written order to a supplier (items, quantity, price, delivery).",
      "Standard: one-time purchase, everything fixed.",
      "Planned: long-term; schedule known, exact deliveries released later.",
      "Blanket: repeat buying at a pre-agreed price; release when needed.",
      "Contract: only terms agreed; items and quantities follow in separate orders." ],
      times: [r("purchase order"), r("standard"), r("planned"), r("blanket"), r("contract")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  // 9. memory trick + payoff
  S("to remember", (r, d) => [
    <Ico dur={d} ctx={ctx} name="pizza" x={170} y={470} size={150} at={r("pizza")} />,
    <Ico dur={d} ctx={ctx} name="utensils" x={417} y={470} size={150} at={r("tiffin")} />,
    <Ico dur={d} ctx={ctx} name="coffee" x={663} y={470} size={150} at={r("stall")} />,
    <Ico dur={d} ctx={ctx} name="calendar-days" x={910} y={470} size={150} at={r("catering")} />,
    <Label dur={d} text="STANDARD" x={170} y={580} w={260} size={38} at={r("pizza") + 0.2} color={C.coral} />,
    <Label dur={d} text="PLANNED" x={417} y={580} w={260} size={38} at={r("tiffin") + 0.2} color={C.coral} />,
    <Label dur={d} text="BLANKET" x={663} y={580} w={260} size={38} at={r("stall") + 0.2} color={C.coral} />,
    <Label dur={d} text="CONTRACT" x={910} y={580} w={260} size={38} at={r("catering") + 0.2} color={C.coral} />,
    <Head dur={d} text="5 MARKS" y={800} size={220} at={r("five")} />,
    <Check dur={d} x={540} y={1260} size={240} at={r("secured")} color={C.coral} />,
    <Mascot dur={d} size={190} tag="5" at={r("five")} pts={[{ t: r("five"), x: 880, y: 1260, mood: "idle", look: [-1, -0.5] }, { t: r("secured"), x: 880, y: 1260, mood: "happy", look: [-1, -0.5] }]} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "five", x: 540, y: 940, z: 1.03 }], cut: "punch" }),
  ];
};
