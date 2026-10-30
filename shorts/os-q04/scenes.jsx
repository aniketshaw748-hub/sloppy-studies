import { Box, Label, Layer, Arrow, Check, XMark, Mover } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
// os-q04 v3: basic concepts of memory management, five ideas, each drawn in subject terms.
// Example numbers for the address picture: a 1000-byte process at base 5000; logical 300 -> physical 5300.
const W=1080, H=1920;
const rectPath=(x,y,w,h)=>`M ${x} ${y} L ${x+w} ${y} L ${x+w} ${y+h} L ${x} ${y+h} Z`;

export const SCENES = ({ S, C, TOP, D, cue }) => {
  const STILL=[{t:0,x:540,y:960,z:1},{t:1,x:540,y:960,z:1}];
  const NONE="#00000000";
  const out_=(x,y,w,h,col,sw=5)=> <rect x={x} y={y} width={w} height={h} radius={10} fill={NONE} strokeColor={col||C.navy} strokeWidth={sw}/>;
  const fill=(x,y,w,h,col,op=0.3,r=6)=> <rect x={x} y={y} width={w} height={h} radius={r} fill={col||C.navy} opacity={op}/>;
  const dash=(x,y,w,h,col,sw=4)=> <path d={rectPath(x,y,w,h)} x={0} y={0} width={W} height={H} stroke={{width:sw,color:col||C.navy}} dash={[12,9]}/>;
  const line=(x1,y1,x2,y2,col,w=5,dsh)=> <path d={`M ${x1} ${y1} L ${x2} ${y2}`} x={0} y={0} width={W} height={H} stroke={{width:w,color:col||C.navy,cap:"round"}} dash={dsh}/>;
  const L=(key,at,d,kids,o={})=> <Layer key={key} at={at} out={o.out} dur={d} sfx={o.sfx}>{kids}</Layer>;
  const chip=(txt,w,h,col,fs=40,font)=>[<rect key="r" x={0} y={0} width={w} height={h} radius={10} fill={col} strokeColor={C.navy} strokeWidth={3}/>,
    <text key="t" x={0} y={h/2-fs*0.62} width={w} align="center" fontFamily={font||C.fMono} fontWeight={700} fontSize={fs} lineHeight={1} color={col===C.chip?C.chipText:C.ink}>{txt}</text>];
  const title=(t,d,size=60)=> <Label key="title" text={t} x={540} y={TOP+20} size={size} font={C.fHead} color={C.coral} w={1000} at={0} dur={d}/>;
  // compact callback to an earlier video
  const Recall=(key,x,y,w,h,at,d,inner,o={})=>[
    <Layer key={key+"p"} at={at} out={o.out} dur={d} sfx="pop"><path d={rectPath(x,y,w,h)} x={0} y={0} width={W} height={H} stroke={{width:3,color:C.cobalt}} dash={[12,10]}/>{inner}</Layer>,
    <Box key={key+"t"} x={x+100} y={y} w={170} h={54} label={o.tag||"from Q1"} size={34} tone="b" at={at} out={o.out} dur={d}/>];
  const t1=cue("in your exam"), pages=ANSWERS["os-q04"], dd=(D-t1)/pages.length;
  const card=(k,d)=>[...AnswerCard({ page: pages[k], title: "WRITE THIS · 5 MARKS · "+(k+1)+"/"+pages.length, at: 0, dur: d, y: TOP + 24 })];
  // the RAM column used in the opening scenes
  const RAM=(d,at=0)=>[ <Label key="ramL" text="RAM" x={240} y={TOP+150} size={44} font={C.fHead} color={C.cobalt} w={320} at={at} dur={d}/>,
    L("ramO",at,d,out_(80,330,320,1070)),
    <Box key="os" x={240} y={390} w={300} h={100} label="OS" size={44} tone="b" at={at+0.15} dur={d}/> ];

  return [
  // Question: RAM with the OS in it, processes waiting to be placed
  S(null,(r,d)=>[ ...RAM(d,0.1),
    ...["P1","P2","P3"].map((p,i)=> <Box key={"w"+i} x={780} y={560+i*170} w={260} h={120} label={p} size={46} tone="hot" at={r("memory management")+i*0.2} dur={d}/>),
    <Label key="wq" text="where does each go?" x={780} y={1040} size={38} w={520} at={r("management")+0.7} dur={d}/>,
  ],{cam:STILL}),

  // From zero: processes live in RAM (from Q1); the OS decides where, tracks free space, keeps them apart
  S("first what is this",(r,d)=>[ ...RAM(d),
    ...Recall("rc",480,300,550,250,r("remember"),d,[
      out_(510,360,490,120,C.navy,4), fill(530,385,180,70), fill(740,385,180,70)],{out:r("memory management")}),
    <Label key="rc1" text="P1" x={620} y={399} size={34} font={C.fMono} w={120} at={r("remember")+0.1} out={r("memory management")} dur={d}/>,
    <Label key="rc2" text="P2" x={830} y={399} size={34} font={C.fMono} w={120} at={r("remember")+0.1} out={r("memory management")} dur={d}/>,
    <Label key="rc3" text="programs run in RAM" x={755} y={494} size={34} w={520} at={r("remember")+0.3} out={r("memory management")} dur={d}/>,
    <Box key="p1" x={240} y={540} w={300} h={160} label="P1" size={46} at={r("processes")} dur={d}/>,
    <Box key="p2" x={240} y={900} w={300} h={200} label="P2" size={46} at={r("processes")+0.2} dur={d}/>,
    <Box key="p3" x={240} y={1110} w={300} h={180} label="P3" size={46} at={r("processes")+0.4} dur={d}/>,
    <Label key="mm" text="memory management:" x={480} y={300} size={40} font={C.fHead} color={C.coral} align="left" w={560} at={r("memory management")} dur={d}/>,
    <Label key="b1" text="where each process goes" x={480} y={385} size={38} align="left" w={560} at={r("deciding")} dur={d}/>,
    <Mover key="p4" at={r("deciding")} dur={d} cw={300} ch={140} pts={[{t:r("deciding"),x:760,y:710},{t:r("where"),x:760,y:710},{t:r("goes")+0.3,x:240,y:710}]}>{chip("P4",300,140,C.coral,46,C.fBody)}</Mover>,
    <Label key="b2" text="track free space" x={480} y={455} size={38} align="left" w={560} at={r("tracking")} dur={d}/>,
    L("fr",r("free space"),d,dash(92,1212,296,176,C.cobalt),{sfx:"ping"}),
    <Label key="frl" text="free" x={240} y={1278} size={40} color={C.cobalt} w={200} at={r("free space")+0.1} dur={d}/>,
    <Label key="b3" text="keep processes apart" x={480} y={525} size={38} align="left" w={560} at={r("stopping")} dur={d}/>,
    <Arrow key="tx" x1={340} y1={480} x2={340} y2={765} color={C.navy} at={r("touching")} dur={d}/>,
    <XMark key="tX" x={340} y={628} size={80} color={C.navy} at={r("touching")+0.3} dur={d}/>,
    <Label key="five" text="the basic ideas:" x={760} y={880} size={40} w={520} at={r("question wants")} dur={d}/>,
    ...[1,2,3,4,5].map(i=> <Box key={"n"+i} x={460+i*100} y={990} w={84} h={84} label={String(i)} size={44} tone="hot" at={r("five")+i*0.12} dur={d}/>),
  ],{cam:STILL, hold:"the question wants", holdY:960}),

  // 1. Addresses: logical (from 0) -> MMU adds the base -> physical
  S("1 addresses",(r,d)=>[ title("1 · ADDRESSES",d),
    <Label key="pl" text="program" x={230} y={250} size={40} color={C.cobalt} w={300} at={r("program")} dur={d}/>,
    L("pb",r("program"),d,[fill(80,310,300,600,C.navy,0.16,10), out_(80,310,300,600)],{sfx:"pop"}),
    <Label key="z0" text="0" x={98} y={318} size={36} font={C.fMono} align="left" w={80} color={C.coral} at={r("zero")} dur={d}/>,
    <Label key="z1" text="999" x={98} y={856} size={34} font={C.fMono} align="left" w={120} at={r("zero")+0.3} dur={d}/>,
    L("lt",r("logical"),d,line(84,490,180,490,C.coral,5)),
    <Mover key="lg" at={r("logical")} dur={d} cw={160} ch={70} pts={[{t:r("logical"),x:270,y:490},{t:r("converts"),x:270,y:490},{t:r("converts")+0.7,x:470,y:1012}]}>{chip("300",160,70,C.coral,40)}</Mover>,
    <Label key="ll" text="logical address" x={230} y={928} size={38} color={C.coral} w={420} at={r("logical")+0.2} dur={d}/>,
    <Label key="rl" text="RAM" x={750} y={250} size={40} color={C.cobalt} w={300} at={r("real")} dur={d}/>,
    L("rb",r("real"),d,[out_(620,310,260,1000), fill(624,810,252,100,C.coral,0.35,2)],{sfx:"pop"}),
    <Label key="t0" text="0" x={896} y={312} size={34} font={C.fMono} align="left" w={140} at={r("real")+0.2} dur={d}/>,
    <Label key="t5" text="5000" x={896} y={788} size={34} font={C.fMono} align="left" w={140} at={r("real")+0.3} dur={d}/>,
    <Label key="t6" text="6000" x={896} y={892} size={34} font={C.fMono} align="left" w={140} at={r("real")+0.4} dur={d}/>,
    L("cn",r("real")+0.5,d,[line(380,310,620,810,C.navy,3,[10,10]), line(380,910,620,910,C.navy,3,[10,10])]),
    <Label key="pa" text="physical address" x={750} y={1326} size={38} color={C.coral} w={440} at={r("physical")} dur={d}/>,
    <Box key="mmu" x={440} y={1110} w={330} h={120} label="MMU" size={52} tone="b" at={r("memory management unit")} dur={d}/>,
    <Label key="mml" text="memory management unit" x={440} y={1182} size={34} w={480} at={r("memory management unit")+0.3} dur={d}/>,
    <Label key="bl" text="base = 5000" x={750} y={740} size={34} font={C.fMono} color={C.coral} w={250} at={r("starts")} dur={d}/>,
    <Mover key="ph" at={r("starts")+0.2} dur={d} cw={160} ch={70} pts={[{t:r("starts")+0.2,x:440,y:1270},{t:r("starts")+0.5,x:440,y:1270},{t:r("starts")+1.2,x:750,y:860}]}>{chip("5300",160,70,C.coral,40)}</Mover>,
    <Label key="eq1" text="physical = base + logical" x={540} y={1400} size={40} w={960} at={r("base")} dur={d}/>,
    <Label key="eq2" text="5300 = 5000 + 300" x={540} y={1470} size={40} font={C.fMono} color={C.coral} w={960} at={r("base")+0.2} dur={d}/>,
  ],{cam:STILL, hold:"base", holdY:960}),

  // 2. Protection: the limit register; an address past the limit is stopped
  S("2 protection",(r,d)=>[ title("2 · PROTECTION",d),
    L("pb",0.1,d,[fill(100,330,320,700,C.navy,0.18,10), out_(100,330,320,700)]),
    <Label key="pn" text="process" x={260} y={345} size={38} w={300} at={0.2} dur={d}/>,
    <Label key="lr" text="limit register" x={780} y={262} size={36} color={C.cobalt} w={420} at={r("limit register")} dur={d}/>,
    <Box key="lb" x={780} y={370} w={400} h={110} label="1000" size={50} tone="b" at={r("limit register")+0.2} dur={d}/>,
    L("gate",r("size"),d,<rect x={80} y={1024} width={940} height={12} radius={6} fill={C.cobalt}/>,{sfx:"hit"}),
    <Label key="sz" text={"size of the\nprocess = 1000"} x={260} y={630} size={36} w={300} at={r("size")} dur={d}/>,
    <Label key="gl" text="limit" x={260} y={1052} size={38} color={C.cobalt} w={200} at={r("size")+0.2} dur={d}/>,
    <Mover key="ok" at={r("process")} dur={d} cw={160} ch={70} pts={[{t:r("process"),x:780,y:540},{t:r("process")+0.3,x:780,y:540},{t:r("process")+0.9,x:260,y:540}]}>{chip("300",160,70,C.coral,40)}</Mover>,
    <Label key="okl" text="300 < 1000" x={760} y={620} size={38} font={C.fMono} w={300} at={r("process")+0.9} dur={d}/>,
    <Check key="okc" x={960} y={640} size={60} at={r("process")+1.0} dur={d}/>,
    <Mover key="bad" at={r("any address")} dur={d} cw={160} ch={70} pts={[{t:r("any address"),x:880,y:1170},{t:r("beyond"),x:880,y:1170},{t:r("beyond")+0.5,x:600,y:1170}]}>{chip("1200",160,70,C.coral,40)}</Mover>,
    <XMark key="badx" x={440} y={1170} size={80} at={r("stopped")} dur={d}/>,
    <Label key="st" text="STOPPED" x={780} y={1250} size={56} font={C.fHead} color={C.coral} w={420} at={r("stopped")+0.1} dur={d}/>,
    <Label key="stl" text="1200 ≥ 1000" x={780} y={1340} size={38} font={C.fMono} w={360} at={r("stopped")+0.3} dur={d}/>,
  ],{cam:STILL, hold:"stopped", holdY:960}),

  // 3. Swapping: a process goes out to disk and comes back
  S("3 swapping",(r,d)=>[ title("3 · SWAPPING",d),
    <Label key="rl" text="RAM" x={250} y={262} size={44} font={C.fHead} color={C.cobalt} w={300} at={0.1} dur={d}/>,
    L("rb",0.1,d,out_(100,330,300,1000)),
    <Box key="p1" x={250} y={480} w={260} h={220} label="P1" size={46} at={0.2} dur={d}/>,
    <Box key="p3" x={250} y={1180} w={260} h={220} label="P3" size={46} at={0.3} dur={d}/>,
    <Label key="dl" text="disk" x={790} y={262} size={44} font={C.fHead} color={C.cobalt} w={300} at={0.15} dur={d}/>,
    L("db",0.15,d,out_(640,330,300,1000)),
    <Mover key="p2" at={0.25} dur={d} cw={260} ch={240} pts={[{t:0.25,x:250,y:830},{t:r("moved"),x:250,y:830},{t:r("disk")+0.3,x:790,y:830},{t:r("brought"),x:790,y:830},{t:r("later")+0.3,x:250,y:830}]}>{chip("P2",260,240,C.coral,46,C.fBody)}</Mover>,
    <Arrow key="ao" x1={410} y1={700} x2={630} y2={700} color={C.coral} at={r("moved")} dur={d}/>,
    <Label key="aol" text="out" x={520} y={630} size={38} color={C.coral} w={200} at={r("moved")} dur={d}/>,
    L("room",r("disk")+0.3,d,dash(122,712,256,236,C.cobalt),{out:r("later")}),
    <Label key="rm" text="room" x={250} y={806} size={40} color={C.cobalt} w={240} at={r("disk")+0.4} out={r("later")} dur={d}/>,
    <Arrow key="ai" x1={630} y1={960} x2={410} y2={960} color={C.cobalt} at={r("brought")} dur={d}/>,
    <Label key="ail" text="back" x={520} y={978} size={38} color={C.cobalt} w={200} at={r("brought")} dur={d}/>,
    <Label key="why" text="swap out to make room, bring back later" x={540} y={1400} size={40} w={980} at={r("make room")} dur={d}/>,
  ],{cam:STILL}),

  // 4. Allocation: one continuous block each -> gaps between (external, from Q1) and unused space inside (internal)
  S("4 allocation",(r,d)=>{ const G=[[280,100],[620,100],[920,100]];
    return [ title("4 · ALLOCATION",d),
    <Label key="ml" text="memory" x={60} y={262} size={38} color={C.cobalt} align="left" w={300} at={0.1} dur={d}/>,
    L("bar",0.1,d,out_(60,330,960,130)),
    <Box key="b1" x={170} y={395} w={210} h={110} label="P1" size={44} at={r("each process")} dur={d}/>,
    <Box key="b2" x={500} y={395} w={230} h={110} label="P2" size={44} at={r("continuous")} dur={d}/>,
    <Box key="b3" x={820} y={395} w={190} h={110} label="P3" size={44} at={r("continuous")+0.3} dur={d}/>,
    ...G.map(([x,w],i)=>L("g"+i,r("gaps appear")+i*0.15,d,dash(x+6,342,w-12,106,C.coral),{sfx:"pop"})),
    ...G.map(([x,w],i)=> <Label key={"gl"+i} text="gap" x={x+w/2} y={374} size={34} color={C.coral} w={100} at={r("gaps appear")+i*0.15+0.1} dur={d}/>),
    <Label key="ext" text="external fragmentation" x={540} y={486} size={44} font={C.fHead} color={C.coral} w={980} at={r("between blocks")} dur={d}/>,
    ...Recall("rq",140,600,800,190,r("you saw"),d,[
      ...[[180,55],[260,60],[345,65],[440,35]].map(([x,w],i)=>fill(x,650,w,56,C.navy,0.35,3)),
      ...[[235,25],[320,25],[410,30],[475,25]].map(([x,w],i)=>dash(x+2,652,w-4,52,C.coral,3)),
      line(515,678,585,678,C.cobalt,5), line(585,678,570,664,C.cobalt,5), line(585,678,570,692,C.cobalt,5),
      fill(600,650,215,56,C.navy,0.35,3), dash(817,652,101,52,C.coral,3)]),
    <Label key="rq1" text="scattered gaps" x={340} y={720} size={34} w={340} at={r("you saw")+0.1} dur={d}/>,
    <Label key="rq2" text="COMPACTION" x={760} y={720} size={34} font={C.fHead} color={C.coral} w={340} at={r("you saw")+0.2} dur={d}/>,
    <Label key="in0" text="one block, up close:" x={540} y={850} size={38} w={900} at={r("unused")} dur={d}/>,
    L("inb",r("unused")+0.1,d,[fill(160,920,540,140,C.navy,0.32,6), out_(160,920,760,140)],{sfx:"pop"}),
    <Label key="in1" text="used by the process" x={430} y={968} size={34} w={520} at={r("unused")+0.2} dur={d}/>,
    L("inu",r("inside"),d,dash(708,928,204,124,C.coral),{sfx:"ping"}),
    <Label key="in2" text="unused" x={810} y={968} size={34} color={C.coral} w={180} at={r("inside")+0.1} dur={d}/>,
    <Label key="int" text="internal fragmentation" x={540} y={1090} size={44} font={C.fHead} color={C.coral} w={980} at={r("internal")} dur={d}/>,
  ]; },{cam:STILL, hold:"internal", holdY:960}),

  // 5. Paging (equal pages into any frames; virtual memory from Q1) and segmentation (logical parts)
  S("5 paging",(r,d)=>{ const ROWS=[385,485,585,685], USED=[[890,385],[690,485],[890,585],[690,685]], FREE=[[690,385],[890,485],[690,585],[890,685]];
    const TGT=[[890,485],[690,385],[890,685],[690,585]];
    return [ title("5 · PAGING & SEGMENTATION",d,48),
    <Label key="pl" text="process" x={205} y={278} size={38} color={C.cobalt} w={300} at={r("paging cuts")} dur={d}/>,
    <Label key="fl" text="RAM frames" x={790} y={278} size={38} color={C.cobalt} w={400} at={r("paging cuts")+0.1} dur={d}/>,
    L("po",r("paging cuts"),d,[out_(105,330,200,410,C.navy,4), ...ROWS.map(y=>dash(117,y-43,176,86,C.navy,3))]),
    L("fu",r("paging cuts")+0.1,d,USED.map(([x,y])=>fill(x-88,y-43,176,86,C.navy,0.32,6))),
    L("ff",r("paging cuts")+0.1,d,FREE.map(([x,y])=>dash(x-88,y-43,176,86,C.navy,3))),
    ...ROWS.map((y,i)=> <Mover key={"pg"+i} at={r("equal")+i*0.15} dur={d} cw={176} ch={86}
      pts={[{t:r("equal")+i*0.15,x:205,y},{t:r("anywhere")+i*0.2,x:205,y},{t:r("anywhere")+i*0.2+0.6,x:TGT[i][0],y:TGT[i][1]}]}>{chip("page "+i,176,86,C.coral,34)}</Mover>),
    <Label key="eq" text="equal pieces" x={205} y={742} size={36} w={340} at={r("equal")+0.3} dur={d}/>,
    <Label key="any" text="any free frame will do: no gap problem" x={540} y={800} size={38} w={980} at={r("stop mattering")} dur={d}/>,
    ...Recall("vm",140,880,800,210,r("virtual"),d,[
      out_(170,940,340,96,C.navy,4), fill(190,958,140,60,C.coral,0.85,4), fill(350,958,140,60,C.coral,0.85,4),
      out_(570,940,340,96,C.navy,4), fill(590,958,140,60,C.coral,0.4,4), fill(750,958,140,60,C.coral,0.4,4)]),
    <Label key="vm1" text="virtual memory" x={700} y={892} size={34} color={C.cobalt} w={420} at={r("virtual")+0.1} dur={d}/>,
    <Label key="vm2" text="in RAM" x={340} y={1040} size={34} w={300} at={r("virtual")+0.2} dur={d}/>,
    <Label key="vm3" text="on disk" x={740} y={1040} size={34} w={300} at={r("virtual")+0.2} dur={d}/>,
    <Label key="sg" text="SEGMENTATION" x={540} y={1140} size={48} font={C.fHead} color={C.coral} w={980} at={r("segmentation cuts")} dur={d}/>,
    <Box key="s1" x={280} y={1290} w={380} h={120} label="code" size={46} tone="b" at={r("logical")} dur={d}/>,
    <Box key="s2" x={590} y={1290} w={200} h={120} label="data" size={44} tone="b" at={r("logical")+0.3} dur={d}/>,
    <Box key="s3" x={850} y={1290} w={280} h={120} label="stack" size={44} tone="b" at={r("logical")+0.6} dur={d}/>,
    <Label key="sgl" text="logical parts, different sizes" x={540} y={1390} size={38} w={980} at={r("code")} dur={d}/>,
  ]; },{cam:STILL, hold:"segmentation cuts", holdY:960}),

  // Answer cards: "In your exam" to the end, pages split evenly
  S("in your exam",(r,d)=>card(0,d),{cam:STILL}),
  ...pages.slice(1).map((_,i)=>{ const t=t1+dd*(i+1); return {at:t,cam:[{t:0,x:540,y:960,z:1},{t:1,x:540,y:960,z:1}],holdT:null,
      draw:d=>{ globalThis.__T0=t; globalThis.__SKEND=0; return card(i+1,d); }}; }),
  ];
};
