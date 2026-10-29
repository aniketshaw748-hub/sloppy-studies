import { Box, Arrow, Mover, Ico, Head, Label, XMark, Check, Ring, Layer } from "./prims.jsx";
import { Mascot } from "./mascot.jsx";
import { Sketch } from "./sketch.jsx";
import { QuestionCard, AnswerSheet } from "./cards.jsx";
export const SCENES = ({ S, ctx, C }) => [
  // 1. the question
  S(null, (r, d) => [
    ...QuestionCard({ dur: d, text: "Define PPC (Production Planning and Control).", n: 8, marks: 5, y: 560 }),
  ], { cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "control", x: 540, y: 780, z: 1.06 }] }),
  // 2. from zero: production = making things
  S("let's start", (r, d) => [
    <Ico dur={d} ctx={ctx} name="factory" x={540} y={700} size={220} at={0.15} />,
    <Label dur={d} text={"PRODUCTION =\nMAKING THINGS"} x={540} y={900} w={900} size={72} color={C.coral} at={r("production")} />,
  ], { hold: "making things", holdY: 800, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "production", x: 540, y: 800, z: 1.03 }] }),
  // 3a. analogy: wedding kitchen, the head cook PLANS
  S("think of a wedding kitchen", (r, d) => [
    <Ico dur={d} ctx={ctx} name="cooking-pot" x={170} y={860} size={150} at={0.15} />,
    <Label dur={d} text="500 guests" x={170} y={960} w={300} size={44} at={r("500")} />,
    <Ico dur={d} ctx={ctx} name="chef-hat" x={170} y={680} size={130} color={C.coral} at={r("head")} />,
    <Label dur={d} text="THE HEAD COOK DECIDES:" x={650} y={390} w={700} size={50} color={C.coral} at={r("head")} />,
    <Box dur={d} x={650} y={520} w={620} h={100} label="WHICH DISHES" size={44} at={r("dishes")} />,
    <Box dur={d} x={650} y={650} w={620} h={100} label="HOW MUCH OF EACH" size={44} at={r("how much")} />,
    <Box dur={d} x={650} y={780} w={620} h={100} label="WHICH STOVE" size={44} at={r("stove")} />,
    <Box dur={d} x={650} y={910} w={620} h={100} label="WHICH COOK" size={44} at={r("by which")} />,
    <Box dur={d} x={650} y={1040} w={620} h={100} label="WHAT TIME" size={44} at={r("at what")} />,
    <Label dur={d} text="= PLANNING" x={650} y={1190} w={700} size={90} color={C.coral} at={r("planning")} />,
  ], { hold: "planning", holdY: 860, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "stove", x: 540, y: 860, z: 1.03 }] }),
  // 3b. while it runs: someone CHECKS and fixes = control
  S("and while the cooking", (r, d) => [
    <Ico dur={d} ctx={ctx} name="clipboard-check" x={170} y={650} size={130} at={0.15} />,
    <Box dur={d} x={630} y={650} w={580} h={110} label="CHECK: ON TIME?" size={48} at={r("checks")} />,
    <Check dur={d} x={985} y={650} size={70} at={r("on time") + 0.4} />,
    <Ico dur={d} ctx={ctx} name="wrench" x={170} y={860} size={130} color={C.coral} at={r("fixes")} />,
    <Box dur={d} x={630} y={860} w={580} h={110} label="FIX ANY PROBLEM" size={48} tone="hot" at={r("fixes")} />,
    <Label dur={d} text="= CONTROL" x={650} y={1060} w={700} size={90} color={C.coral} at={r("control")} />,
  ], { hold: "control", holdY: 850, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "fixes", x: 540, y: 850, z: 1.03 }] }),
  // 4. what the question wants
  S("so the question", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "the question wants:", x: 540, y: 520, size: 80, w: 960 },
      { text: "1.  a definition", x: 190, y: 720, size: 60, w: 860, align: "left", at: r("definition") },
      { text: "2.  the parts of it", x: 190, y: 880, size: 60, w: 860, align: "left", at: r("parts") } ] }),
    <Check dur={d} x={125} y={755} size={80} at={r("definition") + 0.7} />,
    <Check dur={d} x={125} y={915} size={80} at={r("parts") + 0.7} />,
  ]),
  // 5a. the definition: a function of management that plans, directs, controls the flow of materials, machines, men
  S("production planning and control is", (r, d) => [
    <Head dur={d} text="PPC" y={170} size={140} sub="production planning and control" />,
    <Box dur={d} x={540} y={560} w={900} h={120} label="FUNCTION OF MANAGEMENT" size={58} tone="hot" at={r("function")} />,
    <Box dur={d} x={190} y={760} w={270} h={110} label="PLANS" size={54} at={r("plans")} />,
    <Box dur={d} x={540} y={760} w={270} h={110} label="DIRECTS" size={54} at={r("directs")} />,
    <Box dur={d} x={890} y={760} w={270} h={110} label="CONTROLS" size={54} at={r("controls")} />,
    <Arrow dur={d} x1={540} y1={830} x2={540} y2={930} at={r("flow")} color={C.coral} />,
    <Label dur={d} text="the flow of" x={720} y={860} w={300} size={42} color={C.coral} at={r("flow")} />,
    <Ico dur={d} ctx={ctx} name="package" x={190} y={1040} size={120} at={r("materials")} />,
    <Label dur={d} text="materials" x={190} y={1115} w={300} size={44} at={r("materials")} />,
    <Ico dur={d} ctx={ctx} name="cog" x={540} y={1040} size={120} at={r("machines")} />,
    <Label dur={d} text="machines" x={540} y={1115} w={300} size={44} at={r("machines")} />,
    <Ico dur={d} ctx={ctx} name="users" x={890} y={1040} size={120} at={r("men")} />,
    <Label dur={d} text="men" x={890} y={1115} w={300} size={44} at={r("men")} />,
  ], { hold: "and men", holdY: 860, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "flow", x: 540, y: 880, z: 1.03 }] }),
  // 5b. so that: right product, quantity, time, lowest cost
  S("right product", (r, d) => [
    <Box dur={d} x={540} y={620} w={700} h={130} label="RIGHT PRODUCT" size={62} at={0.15} />,
    <Check dur={d} x={960} y={620} size={80} at={0.5} />,
    <Box dur={d} x={540} y={800} w={700} h={130} label="RIGHT QUANTITY" size={62} at={r("quantity")} />,
    <Check dur={d} x={960} y={800} size={80} at={r("quantity") + 0.3} />,
    <Box dur={d} x={540} y={980} w={700} h={130} label="RIGHT TIME" size={62} at={r("time")} />,
    <Check dur={d} x={960} y={980} size={80} at={r("time") + 0.3} />,
    <Box dur={d} x={540} y={1160} w={700} h={130} label="LOWEST COST" size={62} tone="hot" at={r("lowest")} />,
    <Check dur={d} x={960} y={1160} size={80} at={r("lowest") + 0.3} />,
  ], { hold: "lowest cost", holdY: 900, cam: [{ t: 0, x: 540, y: 860, z: 1.0 }, { t: "time", x: 540, y: 900, z: 1.02 }] }),
  // 6. recap: plan the work, then work the plan
  S("so plan the work", (r, d) => [
    <Box dur={d} x={540} y={640} w={760} h={140} label="PLAN THE WORK" size={66} at={0.15} />,
    <Arrow dur={d} x1={540} y1={720} x2={540} y2={850} at={r("then")} color={C.coral} />,
    <Box dur={d} x={540} y={940} w={760} h={140} label="WORK THE PLAN" size={66} tone="hot" at={r("work the plan")} />,
  ], { hold: "work the plan", holdY: 800, cam: [{ t: 0, x: 540, y: 780, z: 1.0 }, { t: "then", x: 540, y: 800, z: 1.02 }] }),
  // 7a. planning: ROUTING = the path, which machines, in which order
  S("planning comes first", (r, d) => [
    <Head dur={d} text="ROUTING" y={170} size={130} sub="the path the work takes" />,
    <Box dur={d} x={200} y={800} w={240} h={120} label="CUT" size={56} at={r("path")} />,
    <Box dur={d} x={540} y={800} w={240} h={120} label="DRILL" size={56} at={r("path") + 0.2} />,
    <Box dur={d} x={880} y={800} w={240} h={120} label="PAINT" size={56} at={r("path") + 0.4} />,
    <Arrow dur={d} x1={325} y1={800} x2={415} y2={800} at={r("which")} color={C.coral} />,
    <Arrow dur={d} x1={665} y1={800} x2={755} y2={800} at={r("which") + 0.2} color={C.coral} />,
    <Label dur={d} text="1" x={200} y={620} w={120} size={70} color={C.coral} at={r("order")} />,
    <Label dur={d} text="2" x={540} y={620} w={120} size={70} color={C.coral} at={r("order") + 0.2} />,
    <Label dur={d} text="3" x={880} y={620} w={120} size={70} color={C.coral} at={r("order") + 0.4} />,
  ], { hold: "which order", holdY: 820, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "which", x: 540, y: 820, z: 1.03 }] }),
  // 7b. planning: SCHEDULING = the time, when each job starts and ends
  S("scheduling means", (r, d) => [
    <Head dur={d} text="SCHEDULING" y={170} size={120} sub="the time of each job" />,
    <Box dur={d} x={540} y={800} w={500} h={110} label="JOB" size={56} at={r("when")} />,
    <Arrow dur={d} x1={290} y1={700} x2={290} y2={1000} head={false} color={C.coral} width={8} at={r("starts")} />,
    <Label dur={d} text="START 9:00" x={290} y={620} w={320} size={42} at={r("starts")} />,
    <Arrow dur={d} x1={790} y1={700} x2={790} y2={1000} head={false} color={C.coral} width={8} at={r("ends")} />,
    <Label dur={d} text="END 12:00" x={790} y={620} w={320} size={42} at={r("ends")} />,
  ], { hold: "when it ends", holdY: 820, cam: [{ t: 0, x: 540, y: 800, z: 1.0 }, { t: "starts", x: 540, y: 820, z: 1.03 }] }),
  // 8a. control: DISPATCHING = the go-ahead, orders released to the shop floor
  S("then comes control", (r, d) => [
    <Head dur={d} text="DISPATCHING" y={170} size={120} sub="give the go-ahead" />,
    <Box dur={d} x={190} y={820} w={270} h={130} label="OFFICE" size={54} at={0.2} />,
    <Box dur={d} x={850} y={820} w={330} h={130} label="SHOP FLOOR" size={54} at={0.35} />,
    <Arrow dur={d} x1={340} y1={820} x2={670} y2={820} at={r("giving")} color={C.coral} label="GO AHEAD" />,
    <Mascot dur={d} on size={100} tag="ORDER" at={r("releasing") - 0.1} pts={[{ t: r("releasing") - 0.1, x: 260, y: 690, look: [1, 0] }, { t: r("floor"), x: 770, y: 690, look: [1, 0], mood: "happy" }]} />,
  ], { hold: "shop floor", holdY: 840, cam: [{ t: 0, x: 540, y: 810, z: 1.0 }, { t: "giving", x: 540, y: 840, z: 1.03 }] }),
  // 8b. control: FOLLOW-UP = actual vs plan, corrective action
  S("follow up means", (r, d) => [
    <Head dur={d} text="FOLLOW-UP" y={170} size={120} sub="actual against plan" />,
    <Box dur={d} x={540} y={720} w={800} h={110} label="PLAN" size={52} tone="ghost" at={0.2} />,
    <Box dur={d} x={400} y={860} w={520} h={110} label="ACTUAL" size={52} at={r("actual")} />,
    ...Sketch({ dur: d, at: r("against"), speed: 3000, items: [{ line: [670, 815, 940, 815], dashed: true }, { line: [940, 815, 940, 905], dashed: true }, { line: [940, 905, 670, 905], dashed: true }] }),
    <Label dur={d} text="LATE" x={800} y={835} w={220} size={44} color={C.coral} at={r("against") + 0.8} />,
    <Label dur={d} text="CORRECTIVE ACTION" x={540} y={1060} w={1000} size={70} color={C.coral} at={r("corrective")} />,
  ], { hold: "running late", holdY: 850, cam: [{ t: 0, x: 540, y: 820, z: 1.0 }, { t: "corrective", x: 540, y: 860, z: 1.03 }] }),
  // 9. the exam answer
  S("so in your exam", (r, d) => [
    ...AnswerSheet({ dur: d, y: 160, fs: 42, title: "WRITE THIS · 5 MARKS", points: [
      "PPC is the function of management that plans and controls production, so that the right product is made in the right quantity, at the right time, at minimum cost.",
      "Planning has routing and scheduling.",
      "Control has dispatching and follow-up." ],
      times: [r("ppc"), r("planning has"), r("control has")] }),
  ], { cam: [{ t: 0, x: 540, y: 900, z: 1.0 }, { t: 1, x: 540, y: 900, z: 1.0 }] }),
  // 10. memory trick + payoff
  S("and to remember", (r, d) => [
    ...Sketch({ dur: d, at: 0.1, items: [
      { text: "to remember:", x: 540, y: 360, size: 58, w: 900 },
      { text: "route it", x: 540, y: 470, size: 68, w: 900, at: r("route") },
      { text: "schedule it", x: 540, y: 580, size: 68, w: 900, color: C.coral, at: r("schedule") },
      { text: "dispatch it", x: 540, y: 690, size: 68, w: 900, at: r("dispatch") },
      { text: "follow it up", x: 540, y: 800, size: 68, w: 900, color: C.coral, at: r("follow") },
      { text: "5 marks", x: 540, y: 980, size: 140, w: 900, at: r("five") } ] }),
    <Check dur={d} x={540} y={1360} size={170} at={r("secured")} />,
  ], { cam: [{ t: 0, x: 540, y: 760, z: 1.02 }, { t: "five", x: 540, y: 1000, z: 1.05 }] }),
];
