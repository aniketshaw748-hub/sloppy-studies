import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  const X3 = [190, 540, 890];
  const plants = (d, y, size, at, gap = 0.2) => X3.map((x, i) => <Ico key={"p" + i} dur={d} ctx={ctx} name="factory" x={x} y={y} size={size} at={at + i * gap} />);
  return [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Centralised vs Decentralised vs Hybrid purchasing.", n: 11, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "hybrid", x: 540, y: 780, z: 1.06 }] }),

  // 2. from zero: purchasing = buying; three plants all need screws; who buys?
  S("let's start", (r, d) => [
    <Head dur={d} text="PURCHASING" y={170} size={140} at={0.1} />,
    <Ico dur={d} ctx={ctx} name="shopping-cart" x={540} y={520} size={190} at={r("buying")} />,
    <Label dur={d} text="buying the materials a company needs" x={540} y={660} w={980} size={44} at={r("materials")} color={C.coral} />,
    ...plants(d, 860, 170, r("plants"), 0.25),
    ...X3.map((x, i) => <Box key={"s" + i} dur={d} x={x} y={1020} w={240} h={90} label="screws" size={44} at={r("screws") + i * 0.2} />),
    <Box dur={d} x={540} y={1240} w={720} h={130} label="WHO BUYS?" tone="hot" at={r("who")} />,
  ], { hold: "answers", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "plants", x: 540, y: 860, z: 1.04 }, { t: "who", x: 540, y: 950, z: 1.04 }] }),

  // 3. what the question wants: three systems, strength + weakness
  S("so the question", (r, d) => [
    <Head dur={d} text="3 SYSTEMS" y={190} size={170} at={0.1} />,
    <Box dur={d} x={540} y={600} w={760} h={120} label="centralised" at={r("systems")} />,
    <Box dur={d} x={540} y={760} w={760} h={120} label="decentralised" at={r("systems") + 0.2} />,
    <Box dur={d} x={540} y={920} w={760} h={120} label="hybrid" at={r("systems") + 0.4} />,
    <Ico dur={d} ctx={ctx} name="thumbs-up" x={330} y={1150} size={130} at={r("strength")} />,
    <Ico dur={d} ctx={ctx} name="thumbs-down" x={750} y={1150} size={130} color={C.coral} at={r("weakness")} />,
    <Label dur={d} text="strength" x={330} y={1250} w={300} size={46} at={r("strength") + 0.1} />,
    <Label dur={d} text="weakness" x={750} y={1250} w={300} size={46} at={r("weakness") + 0.1} color={C.coral} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "strength", x: 540, y: 860, z: 1.03 }] }),

  // 4a. centralised: one department buys for all, pooled orders, bulk, discounts, control
  S("first centralised", (r, d) => [
    <Head dur={d} text="CENTRALISED" y={170} size={120} at={0.1} />,
    <Box dur={d} x={540} y={640} w={520} h={140} label="HEAD OFFICE" tone="hot" at={r("central")} />,
    ...plants(d, 1010, 150, r("plants"), 0.2),
    <Arrow dur={d} x1={190} y1={935} x2={380} y2={720} at={r("pooled")} width={6} />,
    <Arrow dur={d} x1={540} y1={935} x2={540} y2={720} at={r("pooled") + 0.1} width={6} />,
    <Arrow dur={d} x1={890} y1={935} x2={700} y2={720} at={r("pooled") + 0.2} width={6} />,
    <Label dur={d} text="POOLED" x={650} y={830} w={200} size={40} font={C.fMono} color={C.coral} at={r("pooled") + 0.3} />,
    <Box dur={d} x={540} y={400} w={440} h={100} label="SUPPLIER" at={r("bulk") - 0.2} />,
    <Arrow dur={d} x1={540} y1={570} x2={540} y2={478} at={r("bulk")} width={8} />,
    <Label dur={d} text="ONE big order" x={800} y={510} w={360} size={40} font={C.fMono} color={C.coral} at={r("bulk") + 0.2} />,
    <Ico dur={d} ctx={ctx} name="percent" x={910} y={650} size={120} color={C.coral} at={r("discounts")} />,
    <Label dur={d} text="discount" x={910} y={725} w={200} size={36} at={r("discounts") + 0.2} />,
    <Ico dur={d} ctx={ctx} name="shield-check" x={170} y={650} size={120} at={r("control")} />,
    <Label dur={d} text="control" x={170} y={725} w={200} size={36} at={r("control") + 0.2} />,
  ], { hold: "control", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "plants", x: 540, y: 800, z: 1.03 }, { t: "bulk", x: 540, y: 700, z: 1.03 }] }),

  // 4b. the catch: urgent need has to wait. recap: big savings, but slow
  S("but a plant", (r, d) => [
    <Box dur={d} x={540} y={400} w={520} h={140} label="HEAD OFFICE" tone="hot" at={0.05} />,
    <Ico dur={d} ctx={ctx} name="factory" x={540} y={1000} size={170} at={0.15} />,
    <Box dur={d} x={220} y={1000} w={300} h={110} label="URGENT!" tone="hot" at={r("urgent")} />,
    <Ico dur={d} ctx={ctx} name="clock" x={820} y={720} size={150} at={r("wait")} />,
    <Label dur={d} text="waiting..." x={820} y={820} w={300} size={46} at={r("wait") + 0.2} color={C.coral} />,
    <Mascot dur={d} size={170} at={r("wait")} pts={[{ t: r("wait"), x: 540, y: 600, mood: "think", look: [1, 0.3] }, { t: r("savings") - 0.3, x: 540, y: 830, mood: "sad", look: [0, 1] }]} />,
    <Box dur={d} x={270} y={1260} w={420} h={120} label="BIG SAVINGS" at={r("big")} />,
    <Box dur={d} x={810} y={1260} w={420} h={120} label="BUT SLOW" tone="hot" at={r("slow") - 0.2} />,
  ], { hold: "so centralised", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "wait", x: 540, y: 850, z: 1.03 }, { t: "big", x: 540, y: 950, z: 1.03 }] }),

  // 5a. decentralised: each plant buys for itself
  S("second decentralised", (r, d) => [
    <Head dur={d} text="DECENTRALISED" y={170} size={108} at={0.1} />,
    ...plants(d, 470, 150, r("each"), 0.2),
    ...X3.map((x, i) => <Arrow key={"a" + i} dur={d} x1={x} y1={560} x2={x} y2={700} at={r("buys") + i * 0.2} width={7} />),
    ...X3.map((x, i) => <Box key={"b" + i} dur={d} x={x} y={770} w={250} h={100} label="own supplier" size={38} at={r("itself") - 0.4 + i * 0.2} />),
    <Ico dur={d} ctx={ctx} name="zap" x={190} y={1040} size={140} at={r("fast")} />,
    <Ico dur={d} ctx={ctx} name="map-pin" x={540} y={1040} size={140} at={r("fits")} />,
    <Ico dur={d} ctx={ctx} name="user-check" x={890} y={1040} size={140} at={r("manager")} />,
    <Label dur={d} text="fast" x={190} y={1140} w={300} size={46} at={r("fast") + 0.2} />,
    <Label dur={d} text={"local\nneeds"} x={540} y={1140} w={300} size={46} at={r("fits") + 0.2} />,
    <Label dur={d} text={"manager\nresponsible"} x={890} y={1140} w={300} size={46} at={r("manager") + 0.2} />,
  ], { hold: "responsible", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "buys", x: 540, y: 800, z: 1.03 }, { t: "fast", x: 540, y: 900, z: 1.03 }] }),

  // 5b. the catch: small quantities, no bulk discount, duplicated work, different prices; recap: fast + local but costly
  S("but every plant", (r, d) => [
    <Head dur={d} text="THE CATCH" y={170} size={150} at={0.1} />,
    ...X3.map((x, i) => <Box key={"o" + i} dur={d} x={x} y={440} w={260} h={110} label="small order" size={44} at={r("small") + i * 0.15} />),
    <Ico dur={d} ctx={ctx} name="percent" x={300} y={650} size={130} at={r("bulk")} />,
    <XMark dur={d} x={300} y={650} size={150} at={r("no")} />,
    <Label dur={d} text="no bulk discount" x={720} y={620} w={500} size={52} at={r("discount") - 0.2} color={C.coral} />,
    ...X3.map((x, i) => <Ico key={"f" + i} dur={d} ctx={ctx} name="file-text" x={x} y={830} size={110} at={r("duplicated") + i * 0.2} />),
    <Label dur={d} text="same work, three times" x={540} y={910} w={900} size={46} at={r("duplicated") + 0.7} />,
    ...[5, 6, 7].map((p, i) => <Box key={"p" + i} dur={d} x={X3[i]} y={1050} w={220} h={100} label={"Rs " + p} size={54} at={r("prices") + i * 0.15} />),
    <Label dur={d} text="prices differ" x={540} y={1130} w={600} size={46} at={r("differ")} color={C.coral} />,
    <Box dur={d} x={270} y={1330} w={440} h={120} label="FAST + LOCAL" at={r("fast") - 0.2} />,
    <Box dur={d} x={810} y={1330} w={440} h={120} label="BUT COSTLY" tone="hot" at={r("costly") - 0.3} />,
  ], { hold: "so decentralised", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "bulk", x: 540, y: 820, z: 1.02 }, { t: "prices", x: 540, y: 950, z: 1.02 }] }),

  // 6. hybrid: both
  S("third hybrid", (r, d) => [
    <Head dur={d} text="HYBRID" y={170} size={170} at={0.1} />,
    <Box dur={d} x={540} y={500} w={520} h={130} label="HEAD OFFICE" tone="hot" at={r("head")} />,
    <Arrow dur={d} x1={540} y1={570} x2={540} y2={640} at={r("common")} width={7} />,
    <Box dur={d} x={540} y={710} w={820} h={110} label="common · high value" size={52} at={r("common")} />,
    <Label dur={d} text="bought in BULK" x={540} y={795} w={700} size={44} at={r("bulk")} color={C.coral} />,
    ...plants(d, 980, 150, r("plants"), 0.15),
    ...X3.map((x, i) => <Arrow key={"a" + i} dur={d} x1={x} y1={1060} x2={x} y2={1105} at={r("small") + i * 0.1} width={6} />),
    <Box dur={d} x={540} y={1170} w={880} h={110} label="small · urgent · local" size={52} at={r("small")} />,
    <Box dur={d} x={270} y={1350} w={420} h={110} label="DISCOUNT" tone="hot" at={r("discount")} />,
    <Box dur={d} x={810} y={1350} w={420} h={110} label="SPEED" tone="hot" at={r("speed") - 0.2} />,
    <Check dur={d} x={270} y={1350} size={90} at={r("discount") + 0.5} color={C.ink} />,
    <Check dur={d} x={810} y={1350} size={90} at={r("speed") + 0.3} color={C.ink} />,
  ], { hold: "discount", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "plants", x: 540, y: 880, z: 1.03 }, { t: "discount", x: 540, y: 960, z: 1.03 }] }),

  // 7. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 44, title: "WRITE THIS · 5 MARKS", points: [
      "Centralised: one department buys for all plants; bulk discounts and control, but slow.",
      "Decentralised: each plant buys for itself; fast and flexible, but no bulk discount, duplicated work.",
      "Hybrid: head office buys common high-value items; plants buy small, urgent, local items." ],
      times: [r("centralised"), r("decentralised"), r("hybrid")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  // 8. memory trick + payoff
  S("to remember", (r, d) => [
    <Box dur={d} x={200} y={520} w={280} h={150} label="HUB" size={64} at={r("hub")} />,
    <Box dur={d} x={540} y={520} w={280} h={150} label="PLANTS" size={58} at={r("plants")} />,
    <Box dur={d} x={880} y={520} w={280} h={150} label="BOTH" tone="hot" size={64} at={r("both")} />,
    <Head dur={d} text="5 MARKS" y={790} size={230} at={r("five")} />,
    <Check dur={d} x={540} y={1250} size={260} at={r("secured")} color={C.coral} />,
    <Mascot dur={d} size={190} tag="5" pts={[{ t: 0.2, x: 880, y: 1230, mood: "idle", look: [-1, 0] }, { t: r("secured"), x: 880, y: 1230, mood: "happy", look: [-1, 0] }]} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "five", x: 540, y: 900, z: 1.03 }], cut: "punch" }),
  ];
};
