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
  // one cost graph: setup = 36/Q falls, holding = Q rises, total = sum (U); minimum at Q=6 where setup = holding = 6
  const PL = { x: 180, y: 940, w: 800, h: 500, xmax: 11, ymax: 18, xlabel: "batch size Q", ylabel: "cost" };
  const PB = { x: 170, y: 500, w: 810, h: 760, xmax: 11, ymax: 18, xlabel: "batch size Q", ylabel: "cost" };
  const Qs = Array.from({ length: 17 }, (_, i) => 2.5 + i * 0.5);
  const setup = Qs.map(q => [q, 36 / q]), hold = Qs.map(q => [q, q]), total = Qs.map(q => [q, 36 / q + q]);
  const curve = (key, P, d, pts, at, dd, color, width) => <PlotR key={key} dur={d} {...P} pts={pts} at={at} drawDur={dd} color={color} width={width} />;
  const gx = q => PB.x + PB.w * q / PB.xmax, gy = v => PB.y + PB.h - PB.h * v / PB.ymax;
  // two-by-two chips under a headline: [text, cueWord] for tl, tr, bl, br
  const chips = (d, list, y0) => list.map(([t, w], i) => <Box key={t} dur={d} x={i % 2 ? 790 : 290} y={y0 + Math.floor(i / 2) * 150} w={440} h={110} label={t} size={44} at={w} />);
  return [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "What are the two most important costs in EPQ?", n: 10, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "costs", x: 540, y: 780, z: 1.06 }] }),

  // 2. from zero: EPQ = how many units to make in ONE production run
  S("let's start", (r, d) => [
    <Head dur={d} text="EPQ" y={170} size={260} at={0.1} />,
    <Label dur={d} text="Economic Production Quantity" x={540} y={480} w={960} size={56} at={r("economic")} />,
    <Ico dur={d} ctx={ctx} name="cog" x={260} y={850} size={240} at={r("how")} />,
    <Arrow dur={d} x1={410} y1={850} x2={570} y2={850} at={r("make")} width={9} />,
    <Box dur={d} x={800} y={850} w={400} h={190} label="batch of Q" tone="hot" at={r("units")} />,
    <Label dur={d} text="made in ONE run" x={800} y={990} w={420} size={46} at={r("one")} color={C.coral} />,
  ], { hold: "run", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "economic", x: 540, y: 780, z: 1.04 }, { t: "make", x: 540, y: 860, z: 1.05 }] }),

  // 3a. baking cookies: the setup effort is the same for 10 or 100
  S("think of baking", (r, d) => [
    <Ico dur={d} ctx={ctx} name="cookie" x={540} y={340} size={200} at={0.15} />,
    <Box dur={d} x={540} y={640} w={900} h={130} label="heat the oven + wash the trays" tone="hot" size={50} at={r("before")} />,
    <Label dur={d} text="SAME effort..." x={540} y={735} w={700} size={46} at={r("same")} color={C.coral} />,
    <Box dur={d} x={270} y={900} w={380} h={120} label="10 cookies" at={r("10") - 0.1} />,
    <Box dur={d} x={810} y={900} w={380} h={120} label="100 cookies" at={r("100") - 0.25} />,
    <Ico dur={d} ctx={ctx} name="coins" x={270} y={1080} size={130} color={C.coral} at={r("10") + 0.2} />,
    <Ico dur={d} ctx={ctx} name="coins" x={810} y={1080} size={130} color={C.coral} at={r("100") + 0.05} />,
    <Label dur={d} text="=" x={540} y={1040} w={140} size={110} at={r("100") + 0.2} color={C.coral} />,
  ], { hold: "100", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "before", x: 540, y: 800, z: 1.04 }, { t: "10", x: 540, y: 900, z: 1.04 }] }),

  // 3b. and the finished cookies sit on a shelf
  S("and the finished", (r, d) => [
    <Ico dur={d} ctx={ctx} name="warehouse" x={540} y={420} size={260} at={0.1} />,
    <Box dur={d} x={300} y={800} w={400} h={130} label="takes space" at={r("space")} />,
    <Box dur={d} x={780} y={800} w={400} h={130} label="goes stale" at={r("going")} />,
    <Mascot dur={d} size={210} tag="cookies" at={r("sit")} pts={[{ t: r("sit"), x: 540, y: 1150, mood: "idle", look: [0, -1] }, { t: r("going"), x: 540, y: 1150, mood: "idle", look: [0, -1] }, { t: r("stale"), x: 540, y: 1150, mood: "sad", look: [0, -1] }]} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "space", x: 540, y: 800, z: 1.04 }] }),

  // 4. what the question wants
  S("so the question", (r, d) => [
    <Head dur={d} text="2 THINGS" y={200} size={200} sub="the question wants" at={0.1} />,
    <Box dur={d} x={540} y={700} w={860} h={130} label="1 · name the two costs" at={r("two")} />,
    <Box dur={d} x={540} y={900} w={860} h={130} label="2 · how each changes" size={52} at={r("how")} />,
    <Check dur={d} x={990} y={700} size={80} at={r("costs") + 0.8} />,
    <Check dur={d} x={990} y={900} size={80} at={r("bigger") + 0.6} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "how", x: 540, y: 800, z: 1.04 }] }),

  // 5a. setup cost: getting the machine ready
  S("first setup cost", (r, d) => [
    <Head dur={d} text="SETUP COST" y={170} size={150} at={0.1} />,
    <Ico dur={d} ctx={ctx} name="cog" x={540} y={520} size={220} at={r("machine")} />,
    <Label dur={d} text="getting the machine ready" x={540} y={650} w={900} size={48} at={r("ready")} color={C.coral} />,
    ...chips(d, [["change tools", r("changing")], ["adjust settings", r("adjusting")], ["labour", r("labour")], ["trial pieces", r("trial")]], 800),
    <Arrow dur={d} x1={290} y1={1000} x2={470} y2={1140} at={r("pieces") + 0.3} width={6} />,
    <Arrow dur={d} x1={790} y1={1000} x2={610} y2={1140} at={r("pieces") + 0.3} width={6} />,
    <Ico dur={d} ctx={ctx} name="coins" x={540} y={1240} size={160} color={C.coral} at={r("pieces") + 0.5} />,
  ], { hold: "pieces", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "changing", x: 540, y: 860, z: 1.03 }, { t: "labour", x: 540, y: 950, z: 1.03 }] }),

  // 5b. paid once per run -> fewer runs -> falls
  S("it is paid", (r, d) => [
    <Head dur={d} text="PAID PER RUN" y={170} size={130} at={0.05} />,
    ...Array.from({ length: 6 }, (_, i) => [
      <Ico key={"c" + i} dur={d} ctx={ctx} name="coins" x={175 + 146 * i} y={430} size={90} color={C.coral} at={r("paid") + 0.1 + i * 0.18} out={r("bigger")} />,
      <Box key={"b" + i} dur={d} x={175 + 146 * i} y={560} w={120} h={100} label="Q" at={r("paid") + 0.1 + i * 0.18} out={r("bigger")} />]).flat(),
    <Label dur={d} text="6 runs = 6 setups" x={540} y={650} w={800} size={48} at={r("paid") + 1.2} out={r("bigger")} color={C.coral} />,
    ...[300, 780].flatMap((x, i) => [
      <Ico key={"C" + i} dur={d} ctx={ctx} name="coins" x={x} y={430} size={120} color={C.coral} at={r("bigger") + 0.1 + i * 0.15} />,
      <Box key={"B" + i} dur={d} x={x} y={560} w={360} h={130} label="3Q" at={r("bigger") + 0.1 + i * 0.15} />]),
    <Label dur={d} text="2 runs = 2 setups" x={540} y={650} w={800} size={48} at={r("fewer")} color={C.coral} />,
    curve("setup", PL, d, setup, r("year"), 1.1, C.coral, 10),
    <Label dur={d} text="setup falls" x={600} y={1040} w={400} size={46} at={r("falls")} color={C.coral} />,
  ], { hold: "setup cost falls", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "bigger", x: 540, y: 820, z: 1.03 }, { t: "year", x: 540, y: 960, z: 1.04 }] }),

  // 6a. holding cost: keeping stock
  S("second holding cost", (r, d) => [
    <Head dur={d} text="HOLDING COST" y={170} size={110} at={0.1} />,
    <Ico dur={d} ctx={ctx} name="warehouse" x={540} y={520} size={220} at={r("stock")} />,
    <Label dur={d} text="keeping stock" x={540} y={650} w={900} size={48} at={r("keeping")} color={C.coral} />,
    ...chips(d, [["storage space", r("storage")], ["insurance", r("insurance")], ["money tied up", r("money")], ["damage", r("damage")]], 800),
    <Arrow dur={d} x1={290} y1={1000} x2={470} y2={1140} at={r("damage") + 0.3} width={6} />,
    <Arrow dur={d} x1={790} y1={1000} x2={610} y2={1140} at={r("damage") + 0.3} width={6} />,
    <Ico dur={d} ctx={ctx} name="coins" x={540} y={1240} size={160} color={C.coral} at={r("damage") + 0.5} />,
  ], { hold: "damage", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "storage", x: 540, y: 860, z: 1.03 }, { t: "money", x: 540, y: 950, z: 1.03 }] }),

  // 6b. bigger batch -> more stock sitting around -> holding rises
  S("a bigger batch means more", (r, d) => [
    ...[0, 1].map(i => <Box key={"l" + i} dur={d} x={290} y={770 - 72 * i} w={240} h={64} size={34} label="stock" at={r("stock") + i * 0.15} />),
    <Ico dur={d} ctx={ctx} name="coins" x={290} y={590} size={90} color={C.coral} at={r("stock") + 0.4} />,
    <Label dur={d} text="small batch" x={290} y={830} w={400} size={40} at={r("stock") + 0.5} />,
    ...[0, 1, 2, 3, 4].map(i => <Box key={"r" + i} dur={d} x={790} y={770 - 72 * i} w={240} h={64} size={34} label="stock" at={0.2 + i * 0.12} />),
    <Ico dur={d} ctx={ctx} name="coins" x={790} y={390} size={120} color={C.coral} at={0.9} />,
    <Label dur={d} text="big batch" x={790} y={830} w={400} size={40} at={0.5} />,
    curve("setup", PL, d, setup, 0.05, 0.05, C.coral, 10),
    curve("hold", PL, d, hold, r("holding"), 1.0, C.navy, 10),
    <Label dur={d} text="holding rises" x={800} y={1100} w={400} size={46} at={r("rises")} />,
  ], { hold: "so bigger batch", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "holding", x: 540, y: 960, z: 1.04 }] }),

  // 7. add them: total cost U, lowest where setup = holding = EPQ
  S("one falls", (r, d) => [
    curve("setup", PB, d, setup, 0.1, 0.9, C.navy, 8),
    curve("hold", PB, d, hold, r("rises") - 0.5, 0.8, C.cobalt, 8),
    <Label dur={d} text="setup" x={265} y={720} w={200} size={44} at={r("falls")} />,
    <Label dur={d} text="holding" x={850} y={1010} w={240} size={44} at={r("rises")} />,
    curve("total", PB, d, total, r("total"), 1.6, C.coral, 12),
    <Label dur={d} text="total" x={820} y={610} w={200} size={48} at={r("total") + 1.2} color={C.coral} />,
    <Ring dur={d} x={gx(6)} y={gy(12)} r={58} at={r("lowest")} />,
    <Arrow dur={d} x1={gx(6)} y1={PB.y + PB.h} x2={gx(6)} y2={gy(12) + 62} at={r("exactly")} width={5} head={false} color={C.navy} />,
    <Ring dur={d} x={gx(6)} y={gy(6)} r={58} at={r("equals")} />,
    <Box dur={d} x={gx(6)} y={1390} w={260} h={110} label="EPQ" tone="hot" size={64} at={r("epq")} />,
  ], { hold: "that batch", cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "total", x: 540, y: 850, z: 1.03 }, { t: "lowest", x: 560, y: 960, z: 1.04 }] }),

  // 8. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 42, title: "WRITE THIS · 5 MARKS", points: [
      "The two costs: setup cost and holding cost.",
      "Setup cost: paid once per run; falls as batch size rises.",
      "Holding cost: paid on stored stock; rises with batch size.",
      "Total cost is lowest where setup cost = holding cost (the EPQ)." ],
      times: [r("two"), r("setup cost is"), r("holding cost is"), r("total cost is")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  // 9. memory trick + payoff
  S("to remember", (r, d) => [
    <Ico dur={d} ctx={ctx} name="trending-down" x={270} y={420} size={200} color={C.coral} at={r("setup")} />,
    <Ico dur={d} ctx={ctx} name="trending-up" x={810} y={420} size={200} at={r("holding")} />,
    <Label dur={d} text="setup falls" x={270} y={560} w={420} size={50} at={r("falls")} color={C.coral} />,
    <Label dur={d} text="holding climbs" x={810} y={560} w={420} size={50} at={r("climbs")} />,
    <Arrow dur={d} x1={270} y1={650} x2={470} y2={780} at={r("meet")} width={7} />,
    <Arrow dur={d} x1={810} y1={650} x2={610} y2={780} at={r("meet")} width={7} />,
    <Box dur={d} x={540} y={870} w={720} h={130} label="THEY MEET" tone="hot" at={r("meet") + 0.2} />,
    <Head dur={d} text="5 MARKS" y={1040} size={220} at={r("five")} />,
    <Check dur={d} x={540} y={1420} size={220} at={r("secured")} color={C.coral} />,
    <Mascot dur={d} size={190} tag="Q" at={r("five")} pts={[{ t: r("five"), x: 880, y: 1400, mood: "idle", look: [-1, -0.5] }, { t: r("secured"), x: 880, y: 1400, mood: "happy", look: [-1, -0.5] }]} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "five", x: 540, y: 960, z: 1.03 }], cut: "punch" }),
  ];
};
