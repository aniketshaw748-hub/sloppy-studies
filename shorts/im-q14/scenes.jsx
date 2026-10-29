import { Box, Arrow, Ico, Table, Head, Label, XMark, Check, Ring, Layer, bb, ev } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  // PlotR: axes + curve revealed left to right (frame.reveal)
  const PlotR = ({ x = 120, y = 460, w = 860, h = 760, pts, xmax, ymax, at = 0, drawDur = 1.2, dur, color, xlabel, ylabel, width = 9 }) => {
    const P = ([a, b]) => [x + w * a / xmax, y + h - h * b / ymax];
    const dd = pts.map((p, i) => (i ? "L " : "M ") + P(p).join(" ")).join(" ");
    const a0 = Math.min(at, dur - 0.5); bb({ k: "plot", n: "plot", x, y: y - 60, w, h: h + 70, t0: 0, t1: dur }); ev(a0, "draw");
    return <Layer at={0} dur={dur}>
      <path d={`M ${x} ${y} L ${x} ${y + h} L ${x + w} ${y + h}`} x={0} y={0} width={1080} height={1920} stroke={{ width: 6, color: C.navy, cap: "round" }} />
      {xlabel ? <text x={x + w - 500} y={y + h + 16} width={500} align="right" fontFamily={C.fMono} fontWeight={700} fontSize={34} color={C.navy}>{xlabel}</text> : null}
      {ylabel ? <text x={x + 16} y={y - 50} width={700} fontFamily={C.fMono} fontWeight={700} fontSize={34} color={C.navy}>{ylabel}</text> : null}
      <frame at={a0} duration={Math.max(0.3, dur - a0)} width={1080} height={1920} layout="none" reveal={{ from: "left", at: 0, duration: drawDur, easing: "ease-in-out" }}>
        <path d={dd} x={0} y={0} width={1080} height={1920} stroke={{ width, color: color || C.coral, cap: "round" }} />
      </frame>
    </Layer>; };
  const PB = { x: 150, y: 560, w: 780, h: 520, xmax: 10, ymax: 12, xlabel: "time", ylabel: "stock" };
  const gx = t => PB.x + PB.w * t / PB.xmax, gy = v => PB.y + PB.h - PB.h * v / PB.ymax;
  const EOQ = [[0, 0], [0, 10], [5, 0], [5, 10], [10, 0]];   // whole lot at once, falls at the demand rate
  const EPQ = [[0, 0], [2, 6], [5, 0], [7, 6], [10, 0]];     // builds at (p - d), peak 0.6Q (p = 5, d = 2), falls at d
  return [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Difference between EOQ and EPQ.", n: 14, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "epq", x: 540, y: 780, z: 1.06 }] }),

  // 2. from zero: both answer "how much in one go, lowest total cost?"
  S("let's start", (r, d) => [
    <Head dur={d} text="HOW MUCH?" y={190} size={150} at={0.1} />,
    <Box dur={d} x={270} y={620} w={340} h={140} label="EOQ" size={80} at={r("both")} />,
    <Box dur={d} x={810} y={620} w={340} h={140} label="EPQ" size={80} at={r("both") + 0.2} />,
    <Arrow dur={d} x1={290} y1={692} x2={440} y2={832} at={r("much")} width={7} />,
    <Arrow dur={d} x1={790} y1={692} x2={640} y2={832} at={r("much") + 0.1} width={7} />,
    <Box dur={d} x={540} y={900} w={880} h={130} label="how much in ONE go?" tone="hot" size={62} at={r("much")} />,
    <Box dur={d} x={540} y={1110} w={880} h={120} label="so total cost is LOWEST" size={54} at={r("total")} />,
  ], { hold: "lowest", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "much", x: 540, y: 800, z: 1.03 }, { t: "total", x: 540, y: 900, z: 1.03 }] }),

  // 3. analogy: a bread shop. buy = van drops all at once; bake = loaves come out slowly
  S("imagine a shop", (r, d) => [
    <Ico dur={d} ctx={ctx} name="store" x={540} y={310} size={170} at={0.1} />,
    <Box dur={d} x={270} y={540} w={400} h={110} label="1 · BUY" size={56} at={r("option one")} />,
    <Box dur={d} x={810} y={540} w={400} h={110} label="2 · BAKE" size={56} at={r("option two")} />,
    <Ico dur={d} ctx={ctx} name="truck" x={270} y={700} size={150} at={r("van")} />,
    ...[0, 1, 2, 3].map(i => <Box key={"l" + i} dur={d} x={270} y={1050 - 72 * i} w={240} h={64} size={34} label="bread" at={r("drops") + 0.2} />),
    <Label dur={d} text="ALL at once" x={270} y={1150} w={420} size={54} at={r("once")} color={C.coral} />,
    <Ico dur={d} ctx={ctx} name="flame" x={810} y={700} size={150} at={r("bake")} />,
    ...[0, 1, 2, 3].map(i => <Box key={"r" + i} dur={d} x={810} y={1050 - 72 * i} w={240} h={64} size={34} label="bread" at={r("slowly") + i * 0.55} />),
    <Ico dur={d} ctx={ctx} name="users" x={810} y={1220} size={130} at={r("customers")} />,
    <Label dur={d} text="customers keep buying" x={810} y={1320} w={520} size={44} at={r("already")} color={C.coral} />,
  ], { hold: "buying", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "van", x: 540, y: 880, z: 1.03 }, { t: "bake", x: 540, y: 960, z: 1.03 }] }),

  // 4. what the question wants: differences, point by point
  S("so the question", (r, d) => [
    <Head dur={d} text="DIFFERENCES" y={190} size={120} at={0.1} />,
    ...Table({ dur: d, x: 60, y: 520, w: 960, cols: ["Basis", "EOQ", "EPQ"], rows: [["source", " ", " "], ["arrival", " ", " "], ["costs", " ", " "], ["formula", " ", " "]], rowH: 96, fs: 46, at: r("differences"),
      cellAt: [0, 1, 2, 3].map(i => [r("point") + i * 0.2, r("point") + i * 0.2 + 0.05, r("point") + i * 0.2 + 0.1]) }),
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "point", x: 540, y: 800, z: 1.03 }] }),

  // 5a. EOQ: bought from outside
  S("first eoq", (r, d) => [
    <Head dur={d} text="EOQ" y={170} size={230} at={0.1} />,
    <Label dur={d} text="Economic Order Quantity" x={540} y={470} w={960} size={56} at={r("economic")} />,
    <Box dur={d} x={240} y={830} w={330} h={130} label="YOUR SHOP" at={r("items")} />,
    <Box dur={d} x={840} y={830} w={330} h={130} label="SUPPLIER" at={r("items") + 0.1} />,
    <Arrow dur={d} x1={680} y1={830} x2={425} y2={830} at={r("bought")} width={9} label="bought" />,
    <Label dur={d} text="from OUTSIDE" x={540} y={990} w={900} size={56} at={r("outside")} color={C.coral} />,
  ], { hold: "outside", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "bought", x: 540, y: 800, z: 1.03 }] }),

  // 5b. EOQ stock graph: jumps straight up to Q, then falls
  S("the whole lot", (r, d) => [
    <Head dur={d} text="STOCK OVER TIME" y={170} size={100} at={0.1} />,
    <PlotR key="eoq" dur={d} {...PB} pts={EOQ} at={r("arrives")} drawDur={4.2} color={C.coral} width={11} />,
    <Label dur={d} text="Q" x={95} y={gy(10) - 25} w={100} size={56} at={r("jumps") - 0.3} color={C.coral} />,
    <Label dur={d} text="ALL arrives at once" x={540} y={1200} w={960} size={54} at={r("arrives") + 0.2} color={C.coral} />,
  ], { hold: "customers", cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "jumps", x: 540, y: 880, z: 1.03 }] }),

  // 5c. EOQ costs + recap
  S("the costs are", (r, d) => [
    <Head dur={d} text="EOQ" y={170} size={200} at={0.1} />,
    <Box dur={d} x={290} y={560} w={440} h={120} label="ordering cost" size={48} at={r("ordering")} />,
    <Box dur={d} x={790} y={560} w={440} h={120} label="holding cost" size={48} at={r("holding")} />,
    <Box dur={d} x={270} y={830} w={440} h={130} label="BOUGHT" tone="hot" size={60} at={r("bought") - 0.1} />,
    <Box dur={d} x={810} y={830} w={440} h={130} label="ALL AT ONCE" tone="hot" size={56} at={r("all") - 0.2} />,
    <Ico dur={d} ctx={ctx} name="truck" x={540} y={1060} size={160} at={r("arrives")} />,
  ], { hold: "so eoq", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "bought", x: 540, y: 820, z: 1.03 }] }),

  // 6a. EPQ: made in-house
  S("second epq", (r, d) => [
    <Head dur={d} text="EPQ" y={170} size={230} at={0.1} />,
    <Label dur={d} text="Economic Production Quantity" x={540} y={470} w={960} size={56} at={r("economic")} />,
    <Box dur={d} x={240} y={830} w={330} h={130} label="YOUR SHOP" at={r("made")} />,
    <Ico dur={d} ctx={ctx} name="cog" x={840} y={830} size={190} at={r("made") + 0.1} />,
    <Arrow dur={d} x1={720} y1={830} x2={425} y2={830} at={r("made") + 0.4} width={9} label="made" />,
    <Label dur={d} text="IN-HOUSE" x={540} y={990} w={900} size={60} at={r("house")} color={C.coral} />,
  ], { hold: "house", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "made", x: 540, y: 800, z: 1.03 }] }),

  // 6b. EPQ stock graph: builds slowly, peak below Q
  S("making and selling", (r, d) => [
    <Head dur={d} text="STOCK OVER TIME" y={170} size={100} at={0.1} />,
    <PlotR key="epq" dur={d} {...PB} pts={EPQ} at={r("builds") - 0.3} drawDur={4.0} color={C.coral} width={11} />,
    <Arrow dur={d} x1={PB.x} y1={gy(10)} x2={PB.x + PB.w} y2={gy(10)} at={r("below") - 0.5} width={4} head={false} color={C.navy} />,
    <Label dur={d} text="Q" x={95} y={gy(10) - 25} w={100} size={56} at={r("below") - 0.4} color={C.coral} />,
    <Ring dur={d} x={gx(2)} y={gy(6)} r={52} at={r("peak")} />,
    <Label dur={d} text="peak stays BELOW Q" x={540} y={1200} w={960} size={54} at={r("peak") + 0.4} color={C.coral} />,
  ], { hold: "below", cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "builds", x: 540, y: 880, z: 1.03 }] }),

  // 6c. EPQ costs + recap
  S("the costs are", (r, d) => [
    <Head dur={d} text="EPQ" y={170} size={200} at={0.1} />,
    <Box dur={d} x={290} y={560} w={440} h={120} label="setup cost" size={48} at={r("setup")} />,
    <Box dur={d} x={790} y={560} w={440} h={120} label="holding cost" size={48} at={r("holding")} />,
    <Box dur={d} x={270} y={830} w={440} h={130} label="MADE" tone="hot" size={60} at={r("made") - 0.1} />,
    <Box dur={d} x={810} y={830} w={440} h={130} label="GRADUALLY" tone="hot" size={56} at={r("gradually") - 0.3} />,
    <Ico dur={d} ctx={ctx} name="cog" x={540} y={1060} size={160} at={r("arrives")} />,
  ], { n: 2, hold: "so epq", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "made", x: 540, y: 820, z: 1.03 }] }),

  // 6d. the extra term (1 - d/p) because the stock never reaches the full batch
  S("because stock never", (r, d) => [
    <Box dur={d} x={540} y={400} w={880} h={120} label="stock never reaches Q" size={56} at={0.1} />,
    <Label dur={d} text="EPQ formula multiplies H by" x={540} y={520} w={960} size={50} at={r("multiplies")} color={C.coral} />,
    <Box dur={d} x={540} y={680} w={860} h={150} label="H  ×  (1 - d/p)" tone="hot" size={80} at={r("multiplies") + 0.4} />,
    <Box dur={d} x={540} y={900} w={800} h={110} label="d = demand rate" size={52} at={r("demand")} />,
    <Box dur={d} x={540} y={1050} w={800} h={110} label="p = production rate" size={52} at={r("production")} />,
  ], { hold: "production rate", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "multiplies", x: 540, y: 800, z: 1.03 }, { t: "production", x: 540, y: 900, z: 1.03 }] }),

  // 7. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 42, title: "WRITE THIS · 5 MARKS", points: [
      "EOQ: for purchased items. EPQ: for manufactured items.",
      "EOQ: the whole order arrives at once. EPQ: stock builds up gradually.",
      "EOQ uses ordering cost. EPQ uses setup cost.",
      "EOQ = root of (2DS / H).",
      "EPQ = root of (2DS / (H x (1 - d/p)))." ],
      times: [r("eoq is for"), r("in eoq"), r("eoq uses"), r("eoq is root"), r("epq is root")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  // 8. memory trick + payoff
  S("to remember", (r, d) => [
    <Box dur={d} x={265} y={500} w={400} h={130} label="O · ORDER" size={54} at={r("order")} />,
    <Label dur={d} text="at once" x={265} y={610} w={400} size={54} at={r("once")} color={C.coral} />,
    <Box dur={d} x={790} y={500} w={460} h={130} label="P · PRODUCTION" size={46} at={r("production")} />,
    <Label dur={d} text="piece by piece" x={790} y={610} w={460} size={54} at={r("piece")} color={C.coral} />,
    <Head dur={d} text="5 MARKS" y={800} size={220} at={r("five")} />,
    <Check dur={d} x={540} y={1260} size={240} at={r("secured")} color={C.coral} />,
    <Mascot dur={d} size={190} tag="5" at={r("five")} pts={[{ t: r("five"), x: 880, y: 1260, mood: "idle", look: [-1, -0.5] }, { t: r("secured"), x: 880, y: 1260, mood: "happy", look: [-1, -0.5] }]} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "five", x: 540, y: 940, z: 1.03 }], cut: "punch" }),
  ];
};
