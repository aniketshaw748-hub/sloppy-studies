import { Box, Arrow, Ico, Table, Head, Label, XMark, Check, Ring, Layer, bb } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const Y0 = 440;   // top of the drawn formula  EOQ = sqrt( 2DS / H )
  const ft = (key, txt, x, y, w, size, color, d, at) => <Layer key={key} at={at} dur={d}><text x={x} y={y} width={w} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={size} color={color}>{txt}</text></Layer>;
  const stroke = (key, dstr, d, at, wd = 8) => <Layer key={key} at={at} dur={d}><path d={dstr} x={0} y={0} width={1080} height={1920} stroke={{ width: wd, color: C.navy, cap: "round" }} /></Layer>;
  const calc = (key, txt, y, tone, d, at, w = 900) => <Box key={key} dur={d} x={540} y={y} w={w} h={110} label={txt} size={62} tone={tone} at={at} />;
  return [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "EOQ numericals: formula EOQ = sqrt(2DS/H), a worked example and how to solve the class sums.", n: 15, marks: 5, y: 520 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "formula", x: 540, y: 780, z: 1.05 }] }),

  // 2. from zero: EOQ = best number of units to order each time
  S("let's start", (r, d) => [
    <Head dur={d} text="EOQ" y={170} size={230} at={0.1} />,
    <Label dur={d} text="Economic Order Quantity" x={540} y={470} w={960} size={56} at={r("economic")} />,
    <Box dur={d} x={540} y={760} w={900} h={140} label="best number to order each time" tone="hot" size={52} at={r("best")} />,
    <Ico dur={d} ctx={ctx} name="boxes" x={540} y={1020} size={200} at={r("units")} />,
  ], { hold: "time", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "best", x: 540, y: 780, z: 1.03 }] }),

  // 3. analogy: grocery shopping, daily vs once a year, the best order is in between
  S("think of grocery", (r, d) => [
    <Ico dur={d} ctx={ctx} name="shopping-basket" x={540} y={330} size={170} at={0.1} />,
    <Box dur={d} x={270} y={560} w={420} h={110} label="shop DAILY" at={r("daily")} />,
    <Ico dur={d} ctx={ctx} name="clock" x={270} y={760} size={140} at={r("waste")} />,
    <Label dur={d} text="time wasted on trips" x={270} y={870} w={440} size={44} at={r("trips")} color={C.coral} />,
    <Box dur={d} x={810} y={560} w={420} h={110} label="shop ONCE a year" size={46} at={r("once")} />,
    <Ico dur={d} ctx={ctx} name="refrigerator" x={810} y={760} size={170} at={r("fridge")} />,
    <Label dur={d} text="fridge overflows" x={810} y={885} w={440} size={44} at={r("overflows")} color={C.coral} />,
    <Box dur={d} x={540} y={1160} w={900} h={130} label="BEST = somewhere in between" tone="hot" size={54} at={r("between") - 0.3} />,
  ], { hold: "between", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "once", x: 540, y: 820, z: 1.03 }, { t: "between", x: 540, y: 900, z: 1.03 }] }),

  // 4. what the question wants
  S("so the question", (r, d) => [
    <Head dur={d} text="3 THINGS" y={190} size={180} at={0.1} />,
    <Box dur={d} x={540} y={640} w={800} h={120} label="1 · the formula" at={r("formula")} />,
    <Box dur={d} x={540} y={800} w={800} h={120} label="2 · a worked sum" at={r("worked")} />,
    <Box dur={d} x={540} y={960} w={800} h={120} label="3 · the method" at={r("method")} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "worked", x: 540, y: 800, z: 1.04 }] }),

  // 5. the formula, built piece by piece: D, S, H
  S("first the formula", (r, d) => { bb({ k: "box", n: "formula", x: 50, y: Y0 - 20, w: 910, h: 290, t0: r("eoq"), t1: d }); return [
    <Head dur={d} text="THE FORMULA" y={170} size={120} at={0.1} />,
    ft("e", "EOQ =", 50, Y0 + 95, 330, 96, C.navy, d, r("eoq")),
    stroke("rad", `M 395 ${Y0 + 175} L 418 ${Y0 + 155} L 445 ${Y0 + 250} L 485 ${Y0 - 5} L 960 ${Y0 - 5}`, d, r("square")),
    ft("n2", "2", 560, Y0 + 8, 80, 104, C.navy, d, r("2ds")),
    ft("nD", "D", 680, Y0 + 8, 80, 104, C.coral, d, r("2ds") + 0.15),
    ft("nS", "S", 800, Y0 + 8, 80, 104, C.coral, d, r("2ds") + 0.3),
    stroke("bar", `M 540 ${Y0 + 135} L 900 ${Y0 + 135}`, d, r("over")),
    ft("dH", "H", 680, Y0 + 150, 80, 104, C.coral, d, r("over") + 0.25),
    <Ring dur={d} x={720} y={Y0 + 64} r={52} at={r("d is the")} />,
    <Box dur={d} x={540} y={900} w={900} h={110} label="D = yearly demand" size={54} at={r("yearly")} />,
    <Ring dur={d} x={840} y={Y0 + 64} r={52} at={r("s is the")} />,
    <Box dur={d} x={540} y={1030} w={900} h={110} label="S = cost of ONE order" size={54} at={r("placing") - 0.3} />,
    <Ring dur={d} x={720} y={Y0 + 205} r={52} at={r("h is the")} />,
    <Box dur={d} x={540} y={1160} w={900} h={110} label="H = holding cost / unit / year" size={50} at={r("holding") - 0.2} />,
  ]; }, { hold: "so root", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "yearly", x: 540, y: 800, z: 1.03 }, { t: "holding", x: 540, y: 880, z: 1.03 }] }),

  // 6a. worked sum: the given data
  S("second a worked", (r, d) => [
    <Head dur={d} text="WORKED SUM" y={170} size={120} at={0.1} />,
    ...Table({ dur: d, x: 60, y: 520, w: 960, cols: ["Given", "Value"], rows: [["D · demand", "9,000 / year"], ["S · per order", "Rs 200"], ["H · per unit / year", "Rs 10"]], rowH: 100, fs: 40, at: r("yearly") - 0.3,
      cellAt: [[r("yearly"), r("9")], [r("ordering"), r("200")], [r("holding"), r("10")]] }),
    <Ico dur={d} ctx={ctx} name="calculator" x={540} y={1180} size={200} at={r("per year") + 0.2} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "ordering", x: 540, y: 820, z: 1.03 }] }),

  // 6b. the calculation: 2 x 9,000 x 200 = 3,600,000 ; / 10 = 360,000 ; root = 600
  S("2 times 9", (r, d) => [
    <Head dur={d} text="CALCULATE" y={170} size={120} at={0.05} />,
    calc("c1", "2 × 9,000 × 200", 420, "a", d, r("times") - 0.1),
    <Arrow dur={d} x1={540} y1={480} x2={540} y2={540} at={r("3") - 0.3} width={7} />,
    calc("c2", "= 3,600,000", 600, "a", d, r("3") - 0.1),
    <Arrow dur={d} x1={540} y1={660} x2={540} y2={740} at={r("divide")} width={7} />,
    <Label dur={d} text="÷ 10" x={720} y={680} w={200} size={52} font={C.fMono} color={C.coral} at={r("divide")} />,
    calc("c3", "= 360,000", 800, "a", d, r("360") - 0.2),
    <Arrow dur={d} x1={540} y1={860} x2={540} y2={940} at={r("square")} width={7} />,
    <Label dur={d} text="square root" x={780} y={880} w={300} size={46} color={C.coral} at={r("square")} />,
    calc("c4", "EOQ = 600 units", 1010, "hot", d, r("600") - 0.1, 600),
    <Mascot dur={d} size={170} tag="600" at={r("units")} pts={[{ t: r("units"), x: 935, y: 1010, mood: "happy", look: [-1, 0] }, { t: r("each"), x: 935, y: 1010, mood: "happy", look: [-1, 0] }]} />,
    <Label dur={d} text="order 600 units EACH time" x={540} y={1190} w={960} size={56} color={C.coral} at={r("each")} />,
  ], { hold: "so order", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "3", x: 540, y: 780, z: 1.03 }, { t: "600", x: 540, y: 900, z: 1.03 }] }),

  // 6c. check: ordering cost = holding cost = 3,000, total 6,000
  S("check it", (r, d) => [
    <Head dur={d} text="CHECK IT" y={170} size={150} at={0.1} />,
    <Box dur={d} x={540} y={455} w={900} h={110} label="9,000 / 600 = 15 orders" size={56} at={r("orders")} />,
    <Label dur={d} text={"ordering cost\n(15 orders)"} x={280} y={555} w={420} size={40} color={C.coral} at={r("ordering")} />,
    <Label dur={d} text={"holding cost\n(average stock 300)"} x={800} y={555} w={420} size={40} color={C.coral} at={r("holding")} />,
    <Box dur={d} x={280} y={730} w={420} h={110} label="15 × 200" size={56} at={r("15 times")} />,
    <Box dur={d} x={280} y={880} w={420} h={110} label="= Rs 3,000" tone="hot" size={56} at={r("3")} />,
    <Box dur={d} x={800} y={730} w={420} h={110} label="300 × 10" size={56} at={r("average") + 0.5} />,
    <Box dur={d} x={800} y={880} w={420} h={110} label="= Rs 3,000" tone="hot" size={56} at={r("also") - 0.3} />,
    <Label dur={d} text="=" x={540} y={870} w={100} size={110} color={C.coral} at={r("match") - 0.2} />,
    <Box dur={d} x={540} y={1080} w={820} h={130} label="TOTAL = Rs 6,000" tone="hot" size={64} at={r("total")} />,
  ], { hold: "they match", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "ordering", x: 540, y: 800, z: 1.03 }, { t: "total", x: 540, y: 900, z: 1.03 }] }),

  // 7. the exam answer: the method
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 44, title: "WRITE THIS · 5 MARKS", points: [
      "Write D, S and H in yearly units. If H is a percentage, H = % x price.",
      "EOQ = root of (2DS / H).",
      "Orders per year = D / EOQ.",
      "Total cost = ordering + holding." ],
      times: [r("one"), r("two"), r("three"), r("four")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  // 8. memory trick + payoff
  S("to remember", (r, d) => [
    <Label dur={d} text="at the best order" x={540} y={370} w={900} size={56} at={r("best")} color={C.coral} />,
    <Box dur={d} x={265} y={540} w={400} h={140} label="ORDERING" size={56} at={r("ordering")} />,
    <Label dur={d} text="=" x={540} y={485} w={120} size={120} at={r("equals")} color={C.coral} />,
    <Box dur={d} x={815} y={540} w={400} h={140} label="HOLDING" tone="hot" size={56} at={r("holding")} />,
    <Head dur={d} text="5 MARKS" y={800} size={220} at={r("five")} />,
    <Check dur={d} x={540} y={1260} size={240} at={r("secured")} color={C.coral} />,
    <Mascot dur={d} size={190} tag="5" at={r("five")} pts={[{ t: r("five"), x: 880, y: 1260, mood: "idle", look: [-1, -0.5] }, { t: r("secured"), x: 880, y: 1260, mood: "happy", look: [-1, -0.5] }]} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "five", x: 540, y: 940, z: 1.03 }], cut: "punch" }),
  ];
};
