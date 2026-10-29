import { Box, Arrow, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => {
  // the project network: Start -> (A -> B | C -> D) -> End
  const P = base => ({ S: [120, base], E: [900, base], A: [340, base - 130], B: [620, base - 130], C: [340, base + 130], D: [620, base + 130] });
  const node = (id, p, d, at, tone, extra = {}) => { const [x, y] = p[id]; return <Box key={id + (extra.k || "")} x={x} y={y} w={140} h={120} label={id === "S" ? "Start" : id === "E" ? "End" : id} size={id === "S" || id === "E" ? 44 : 72} tone={tone || "a"} at={at} dur={d} {...extra} />; };
  const arrows = (p, d, at, gap = 0.1) => {
    const [ys, ye, yA, yC] = [p.S[1], p.E[1], p.A[1], p.C[1]];
    const L = [[190, ys - 20, 268, yA + 40], [190, ys + 20, 268, yC - 40], [410, yA, 548, yA], [410, yC, 548, yC], [690, yA + 40, 828, ye - 20], [690, yC - 40, 828, ye + 20]];
    return L.map(([a, b, c, e], i) => <Arrow key={"ar" + i} x1={a} y1={b} x2={c} y2={e} at={at + i * gap} dur={d} width={6} />); };
  const chip = (txt, id, p, d, at, extra = {}) => { const [x, y] = p[id]; const up = id === "A" || id === "B" || id === "C" || id === "D"; return <Label key={"ch" + id + txt} text={txt} x={x} y={y - 115} w={200} size={40} font={C.fMono} color={C.coral} at={at} dur={d} {...extra} />; };
  const all = (p, d, tones = {}) => ["S", "A", "B", "C", "D", "E"].map(id => node(id, p, d, 0.05, tones[id]));
  const BASE = 800;
  return [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Why is updating of the project network required?", n: 12, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "network", x: 540, y: 780, z: 1.06 }] }),

  // 2. from zero: a network = activities + order, drawn BEFORE work using estimates
  S("let's start", (r, d) => { const p = P(780); return [
    <Head dur={d} text="PROJECT NETWORK" y={170} size={95} at={0.1} />,
    node("S", p, d, r("diagram")), node("E", p, d, r("diagram") + 0.1),
    node("A", p, d, r("activities")), node("B", p, d, r("activities") + 0.15), node("C", p, d, r("activities") + 0.3), node("D", p, d, r("activities") + 0.45),
    ...arrows(p, d, r("order"), 0.12),
    <Label dur={d} text="drawn BEFORE the work starts" x={540} y={1090} w={980} size={52} at={r("drawn")} />,
    <Label dur={d} text="using ESTIMATES" x={540} y={1190} w={900} size={60} at={r("estimates")} color={C.coral} />,
  ]; }, { hold: "estimates", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "activities", x: 540, y: 820, z: 1.03 }, { t: "drawn", x: 540, y: 900, z: 1.03 }] }),

  // 3. a GPS plans, hits traffic, recalculates
  S("now think", (r, d) => [
    <Head dur={d} text="GPS" y={170} size={200} at={0.1} />,
    <Box dur={d} x={180} y={650} w={240} h={110} label="HOME" at={r("plans") - 0.3} />,
    <Arrow dur={d} x1={310} y1={650} x2={750} y2={650} at={r("route")} width={9} />,
    <Box dur={d} x={890} y={650} w={240} h={110} label="WORK" at={r("route") + 0.2} />,
    <Label dur={d} text="ETA 10:00" x={540} y={520} w={420} size={52} font={C.fMono} color={C.coral} at={r("arrive")} />,
    <Ico dur={d} ctx={ctx} name="traffic-cone" x={540} y={650} size={100} at={r("traffic")} />,
    <XMark dur={d} x={540} y={545} size={100} at={r("traffic") + 0.5} />,
    <Ico dur={d} ctx={ctx} name="refresh-cw" x={540} y={900} size={200} at={r("recalculates")} />,
    <Label dur={d} text="ETA 10:30" x={540} y={1040} w={420} size={60} font={C.fMono} color={C.coral} at={r("recalculates") + 0.5} />,
    <Box dur={d} x={540} y={1250} w={920} h={130} label="UPDATING = RECALCULATING" size={52} tone="hot" at={r("exactly")} />,
  ], { hold: "exactly", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "traffic", x: 540, y: 780, z: 1.03 }, { t: "recalculates", x: 540, y: 960, z: 1.03 }] }),

  // 4. what the question wants
  S("so the question", (r, d) => [
    <Head dur={d} text="WHY UPDATE?" y={190} size={138} at={0.1} />,
    <Box dur={d} x={540} y={640} w={700} h={120} label="reason 1" at={r("reasons")} />,
    <Box dur={d} x={540} y={800} w={700} h={120} label="reason 2" at={r("reasons") + 0.25} />,
    <Box dur={d} x={540} y={960} w={700} h={120} label="reason 3" at={r("reasons") + 0.5} />,
    <Box dur={d} x={540} y={640} w={700} h={120} label="reason 1" tone="hot" at={r("see")} on={true} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "see", x: 540, y: 780, z: 1.04 }] }),

  // 5. two paths: top 5+4=9 (critical), bottom 4+3=7 (float 2)
  S("here are two", (r, d) => { const p = P(BASE); return [
    <Head dur={d} text="2 PATHS" y={170} size={130} at={0.1} />,
    ...all(p, d),
    ...arrows(p, d, 0.1, 0.1),
    node("A", p, d, r("top"), "a", { k: "t", out: r("top") }),
    chip("5 days", "A", p, d, r("a takes")), chip("4 days", "B", p, d, r("b takes")),
    <Label dur={d} text="5 + 4 = 9 days" x={480} y={470} w={700} size={54} font={C.fMono} color={C.coral} at={r("total")} />,
    chip("4 days", "C", p, d, r("c takes")), chip("3 days", "D", p, d, r("d takes")),
    <Label dur={d} text="4 + 3 = 7 days" x={480} y={1030} w={700} size={54} font={C.fMono} color={C.coral} at={r("seven") - 0.3} />,
    <Label dur={d} text="CRITICAL PATH" x={480} y={395} w={700} size={46} at={r("critical")} />,
    node("A", p, d, r("critical"), "hot", { k: "h", on: true }), node("B", p, d, r("critical") + 0.15, "hot", { k: "h", on: true }),
    <Box dur={d} x={540} y={1270} w={720} h={120} label="PROJECT = 9 DAYS" tone="hot" at={r("project takes nine")} />,
    <Label dur={d} text="float = 2 days (spare time)" x={540} y={1130} w={900} size={52} at={r("two days")} color={C.coral} />,
  ]; }, { hold: "spare time", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "total", x: 540, y: 780, z: 1.02 }, { t: "critical", x: 540, y: 880, z: 1.02 }, { t: "float", x: 540, y: 960, z: 1.02 }] }),

  // 6. the work begins: C takes eight days -> bottom path becomes eleven
  S("so the plan", (r, d) => { const p = P(BASE); return [
    ...all(p, d, { A: "hot", B: "hot" }),
    ...arrows(p, d, 0.05, 0),
    <Label dur={d} text="PLAN = 9 DAYS" x={480} y={395} w={700} size={50} color={C.coral} at={0.2} />,
    <Label dur={d} text="5 + 4 = 9 days" x={480} y={470} w={700} size={54} font={C.fMono} at={0.2} />,
    chip("5 days", "A", p, d, 0.2), chip("4 days", "B", p, d, 0.2), chip("3 days", "D", p, d, 0.2),
    chip("4 days", "C", p, d, 0.2, { out: r("eight") }),
    <Label dur={d} text="4 + 3 = 7 days" x={480} y={1030} w={700} size={54} font={C.fMono} at={0.2} out={r("becomes")} />,
    <Ico dur={d} ctx={ctx} name="hammer" x={900} y={420} size={100} at={r("work")} />,
    node("C", p, d, r("eight") - 0.2, "hot", { k: "h", on: true }),
    <Label dur={d} text="8 days" x={340} y={805} w={200} size={50} font={C.fMono} color={C.coral} at={r("eight")} />,
    <Label dur={d} text="8 + 3 = 11 days" x={480} y={1030} w={760} size={58} font={C.fMono} color={C.coral} at={r("becomes")} />,
    <Box dur={d} x={540} y={1200} w={780} h={120} label="11 days  >  9 days" tone="hot" at={r("longer")} />,
  ]; }, { hold: "longer than", cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "eight", x: 540, y: 880, z: 1.02 }, { t: "becomes", x: 540, y: 960, z: 1.02 }] }),

  // 7. the critical path has shifted; the old network is wrong
  S("so the critical", (r, d) => { const p = P(BASE); return [
    ...all(p, d, { A: "hot", B: "hot" }),
    ...arrows(p, d, 0.05, 0),
    <Label dur={d} text="CRITICAL PATH" x={480} y={395} w={700} size={46} color={C.coral} at={0.2} out={r("shifted")} />,
    <Label dur={d} text="5 + 4 = 9" x={480} y={470} w={700} size={54} font={C.fMono} at={0.2} />,
    <Label dur={d} text="8 + 3 = 11" x={480} y={1030} w={700} size={54} font={C.fMono} color={C.coral} at={0.2} />,
    node("A", p, d, r("shifted"), "a", { k: "c", on: true }), node("B", p, d, r("shifted"), "a", { k: "c", on: true }),
    node("C", p, d, r("shifted") + 0.1, "hot", { k: "h", on: true }), node("D", p, d, r("shifted") + 0.25, "hot", { k: "h", on: true }),
    <Label dur={d} text="CRITICAL PATH" x={480} y={1105} w={700} size={46} at={r("shifted") + 0.4} />,
    <Box dur={d} x={270} y={1230} w={420} h={110} label="PLAN: 9 days" at={r("needs") - 0.4} />,
    <XMark dur={d} x={270} y={1230} size={120} at={r("not")} />,
    <Box dur={d} x={810} y={1230} w={420} h={110} label="NOW: 11 days" tone="hot" at={r("needs")} />,
    <Ico dur={d} ctx={ctx} name="octagon-alert" x={540} y={1390} size={110} at={r("wrong") - 0.5} />,
    <Label dur={d} text="old network = wrong" x={540} y={1470} w={900} size={46} color={C.coral} at={r("wrong")} />,
  ]; }, { hold: "old network", cam: [{ t: 0, x: 540, y: 980, z: 1.0 }, { t: "needs", x: 540, y: 990, z: 1.03 }] }),

  // 8. what updating means and what managers do
  S("updating means", (r, d) => [
    <Head dur={d} text="UPDATING" y={170} size={140} at={0.1} />,
    <Box dur={d} x={540} y={480} w={880} h={110} label="1 · enter ACTUAL progress" size={52} at={r("entering")} />,
    <Box dur={d} x={330} y={640} w={320} h={90} label="delays" size={44} at={r("delays")} />,
    <Box dur={d} x={750} y={640} w={320} h={90} label="changes" size={44} at={r("changes")} />,
    <Arrow dur={d} x1={540} y1={540} x2={540} y2={790} at={r("recalculating") - 0.2} width={7} />,
    <Box dur={d} x={540} y={850} w={880} h={110} label="2 · recalculate" size={52} tone="hot" at={r("recalculating")} />,
    <Box dur={d} x={190} y={1010} w={290} h={90} label="times" size={42} at={r("times")} />,
    <Box dur={d} x={540} y={1010} w={290} h={90} label="floats" size={42} at={r("floats")} />,
    <Box dur={d} x={890} y={1010} w={290} h={90} label="critical path" size={38} at={r("critical")} />,
    <Box dur={d} x={540} y={1180} w={880} h={110} label="3 · managers ACT" size={52} tone="hot" at={r("managers")} />,
    <Box dur={d} x={190} y={1330} w={290} h={90} label="add workers" size={38} at={r("workers")} />,
    <Box dur={d} x={540} y={1330} w={290} h={90} label="crash critical" size={38} at={r("crash")} />,
    <Box dur={d} x={890} y={1330} w={290} h={90} label="tell the client" size={38} at={r("tell")} />,
  ], { hold: "date", cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "recalculating", x: 540, y: 820, z: 1.0 }, { t: "managers", x: 540, y: 950, z: 1.0 }] }),

  // 9. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 44, title: "WRITE THIS · 5 MARKS", points: [
      "Estimates are only guesses, so actual durations differ.",
      "Delays and changes shift the critical path and the floats.",
      "Updating gives the revised completion time.",
      "It allows corrective action and control." ],
      times: [r("estimates"), r("delays"), r("updating gives"), r("it allows")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),

  // 10. memory trick + payoff
  S("to remember", (r, d) => [
    <Box dur={d} x={270} y={480} w={380} h={150} label="NETWORK" size={58} at={r("network")} />,
    <Label dur={d} text="=" x={540} y={420} w={140} size={120} at={r("is")} color={C.coral} />,
    <Box dur={d} x={810} y={480} w={380} h={150} label="GPS" tone="hot" size={70} at={r("gps")} />,
    <Ico dur={d} ctx={ctx} name="refresh-cw" x={540} y={800} size={190} at={r("recalculate")} />,
    <Label dur={d} text="RECALCULATE" x={540} y={930} w={800} size={64} at={r("recalculate") + 0.3} color={C.coral} />,
    <Head dur={d} text="5 MARKS" y={1060} size={200} at={r("five")} />,
    <Check dur={d} x={540} y={1400} size={220} at={r("secured")} color={C.coral} />,
    <Mascot dur={d} size={180} tag="5" at={r("five")} pts={[{ t: r("five"), x: 880, y: 1380, mood: "idle", look: [-1, -0.5] }, { t: r("secured"), x: 880, y: 1380, mood: "happy", look: [-1, -0.5] }]} />,
  ], { cam: [{ t: 0, x: 540, y: 700, z: 1.0 }, { t: "five", x: 540, y: 960, z: 1.03 }], cut: "punch" }),
  ];
};
