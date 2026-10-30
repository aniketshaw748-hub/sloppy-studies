// os-q03 · Semaphores (v3). Machine world. Recalls the semaphore picture, empty/full and mutex from os-q02.
import { Box, Mover, Ico, Label, Layer, XMark, Check, Head, bb } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
const W=1080,H=1920;
const CAM=(z=1,y=960)=>[{t:0,x:540,y:960,z:1},{t:999,x:540,y,z}];

export const SCENES = ({ S, ctx, C, TOP, cue, D }) => {
  const R=(x,y,w,h,o={})=>{ const p={x,y,width:w,height:h,radius:o.r||0,fill:o.fill||"#00000000"}; if(o.stroke){p.strokeColor=o.stroke;p.strokeWidth=o.sw||4;} if(o.op!=null)p.opacity=o.op; return <rect {...p}/>; };
  const PL=(d,col,w=6,dash)=>{ const p={d,x:0,y:0,width:W,height:H,stroke:{width:w,color:col,cap:"round"}}; if(dash)p.dash=dash; return <path {...p}/>; };
  const PF=(d,col)=><path d={d} x={0} y={0} width={W} height={H} fill={col}/>;
  const T=(s,x,y,w,fs,col,o={})=><text x={x} y={y} width={w} align={o.align||"center"} fontFamily={o.font||C.fMono} fontWeight={700} fontSize={fs} color={col}>{s}</text>;
  const head=(x1,y1,x2,y2,col,L=24)=>{ const a=Math.atan2(y2-y1,x2-x1); return PF(`M ${x2} ${y2} L ${x2-L*Math.cos(a-0.45)} ${y2-L*Math.sin(a-0.45)} L ${x2-L*Math.cos(a+0.45)} ${y2-L*Math.sin(a+0.45)} Z`,col); };
  const arrowK=(x1,y1,x2,y2,col,w=7,dash,L)=>[PL(`M ${x1} ${y1} L ${x2} ${y2}`,col,w,dash), head(x1,y1,x2,y2,col,L)];
  const AR=(k,d,at,x1,y1,x2,y2,col,o={})=><Layer key={k} at={at} dur={d} out={o.out} sfx="swish" anim={[{property:"opacity",from:0,to:1,at:0,duration:0.25}]}>{arrowK(x1,y1,x2,y2,col,o.w||7,o.dash,o.L)}</Layer>;
  const XM=(k,d,x,y,sz,at,out,col)=>{ const h=sz/2; return <Layer key={k} at={at} dur={d} out={out} sfx="wrong" anim={[{property:"opacity",from:0,to:1,at:0,duration:0.1}]}>{PL(`M ${x-h} ${y-h} L ${x+h} ${y+h} M ${x+h} ${y-h} L ${x-h} ${y+h}`,col||C.coral,16)}</Layer>; };
  const chip=(w,h,label,fill,fs=36,tc)=>[R(0,0,w,h,{r:12,fill,stroke:C.navy,sw:3}),T(label,0,h/2-fs*0.62,w,fs,tc||C.ink)];
  const FADE=[{property:"opacity",from:0,to:1,at:0,duration:0.15},{property:"offsetY",from:30,to:0,at:0,duration:0.35,easing:[0.22,1,0.36,1]}];
  // a "from Q2" tag pill (registered)
  const Tag=(k,d,at,x,y,out)=>{ bb({k:"box",n:"tag "+k,x,y,w:190,h:46,t0:at,t1:out??d}); return <Layer key={k} at={at} dur={d} out={out} sfx="ping" anim={FADE}>{R(x,y,190,46,{r:23,fill:C.cobalt})}{T("from Q2",x,y+5,190,30,C.ink)}</Layer>; };
  // a panel container (registered as srect so its contents may sit inside it)
  const Pan=(k,d,at,x,y,w,h,col,out)=>{ bb({k:"srect",n:"panel "+k,x,y,w,h,t0:at,t1:out??d,id:k}); return <Layer key={k} at={at} dur={d} out={out} sfx="pop" anim={FADE}>{R(x,y,w,h,{r:16,fill:C.chip,stroke:col||C.coral,sw:4})}</Layer>; };
  const Val=(k,d,x,y,w,h,name,segs,o={})=>segs.map(([v,a,b],i)=><Box key={k+i} x={x} y={y} w={w} h={h} label={name+" = "+v} size={o.size||40} tone={i===0?(o.tone||"a"):"hot"} at={a} out={b} dur={d}/>);

  const ans=ANSWERS["os-q03"], tEx=cue("In your exam"), dd=(D-tEx)/ans.length;

  return [
  // ===== 0 · question + recall: the semaphore picture from the producer–consumer video =====
  S(null,(r,d)=>{
    const tMet=r("already met"), tCnt=r("counter"), tPro=r("protects"), tWS=r("weight and signal"), tQ=r("This question"), tEx1=r("exact"), tTy=r("two types"), tHow=r("how they");
    const out=[];
    out.push(<Box key="s" x={540} y={330} w={260} h={160} label="S = 1" size={60} at={0.1} dur={d}/>);
    out.push(<Ico key="sh" ctx={ctx} name="shield" x={790} y={330} size={110} color={C.cobalt} at={0.2} dur={d}/>);
    out.push(<Box key="w" x={290} y={560} w={300} h={100} label="wait()" size={44} tone="hot" at={0.3} dur={d}/>);
    out.push(<Box key="g" x={790} y={560} w={300} h={100} label="signal()" size={44} tone="b" at={0.4} dur={d}/>);
    out.push(AR("wa",d,0.5,340,505,420,425,C.coral));
    out.push(AR("sa",d,0.6,740,505,660,425,C.cobalt));
    out.push(Tag("tg",d,tMet,60,200));
    out.push(<Label key="l1" text="semaphore: a counter the OS protects" x={540} y={650} w={980} size={38} at={tCnt} dur={d}/>);
    out.push(<Layer key="hw" at={tWS} out={tQ} dur={d} sfx="ping">{R(130,500,320,120,{r:18,stroke:C.coral,sw:6})}{R(630,500,320,120,{r:18,stroke:C.cobalt,sw:6})}</Layer>);
    out.push(<Label key="q" text="this question wants more:" x={540} y={790} w={960} size={40} color={C.cobalt} at={tQ} dur={d}/>);
    out.push(<Box key="c1" x={540} y={920} w={880} h={100} label="1 · the exact rules" size={44} at={tEx1} dur={d}/>);
    out.push(<Box key="c2" x={540} y={1040} w={880} h={100} label="2 · the two types" size={44} at={tTy} dur={d}/>);
    out.push(<Box key="c3" x={540} y={1160} w={880} h={100} label="3 · how they keep processes in step" size={40} at={tHow} dur={d}/>);
    return out;
  },{cam:CAM(1.0)}),

  // ===== 1 · synchronization =====
  S("Synchronization means",(r,d)=>{
    const tCo=r("controlling"), tWh=r("which process"), tWn=r("when"), tRs=r("results");
    const out=[];
    out.push(<Head key="h" text="SYNCHRONIZATION" y={220} size={84} at={0.05} dur={d}/>);
    out.push(<Box key="p1" x={220} y={500} w={220} h={100} label="P1" size={44} tone="hot" at={0.15} dur={d}/>);
    out.push(<Box key="p2" x={860} y={500} w={220} h={100} label="P2" size={44} tone="b" at={0.25} dur={d}/>);
    bb({k:"srect",n:"shared",x:340,y:660,w:400,h:260,t0:0.2,t1:d,id:"sh"});
    out.push(<Layer key="sh" at={0.2} dur={d} sfx="pop" anim={FADE}>{R(340,660,400,260,{r:18,fill:C.chip,stroke:C.cobalt,sw:6})}</Layer>);
    out.push(<Label key="shl" text="shared thing" x={540} y={676} w={380} size={36} font={C.fMono} color={C.cobalt} at={0.2} dur={d}/>);
    out.push(AR("a1",d,0.5,300,555,400,790,C.coral,{out:tWh}));
    out.push(AR("a2",d,0.55,780,555,680,790,C.cobalt,{out:tWh}));
    out.push(XM("x",d,540,810,90,0.9,tWh));
    out.push(<Label key="wr" text="both at once → wrong result" x={540} y={960} w={980} size={38} color={C.coral} at={0.9} out={tWh} dur={d}/>);
    out.push(<Label key="o1" text="1st" x={220} y={568} w={200} size={36} font={C.fMono} color={C.coral} at={tWh} dur={d}/>);
    out.push(AR("b1",d,tWh,300,555,400,790,C.coral));
    out.push(<Label key="o2" text="2nd" x={860} y={568} w={200} size={36} font={C.fMono} color={C.cobalt} at={tWn} dur={d}/>);
    out.push(<Ico key="ck" ctx={ctx} name="clock" x={860} y={720} size={90} color={C.cobalt} at={tWn} dur={d}/>);
    out.push(<Label key="wc" text="which process, and WHEN" x={540} y={960} w={980} size={40} at={tWh} dur={d}/>);
    out.push(<Check key="ok" x={540} y={810} size={100} at={tRs} dur={d}/>);
    out.push(<Label key="rs" text="so results don't go wrong" x={540} y={1040} w={980} size={38} color={C.cobalt} at={tRs} dur={d}/>);
    return out;
  },{cam:CAM(1.0)}),

  // ===== 2 · the exact rules: P and V, one unbroken step =====
  S("Weight is also",(r,d)=>{
    const tP=r("called P"), tTk=r("takes one"), tZ=r("zero"), tSl=r("sleeps"), tS=r("Signal is"), tV=r("called V"), tAd=r("adds"), tWk=r("wakes"), tEa=r("Each one happens"), tSi=r("single step"), tIn=r("interrupted"), tSo=r("so two processes");
    const out=[];
    out.push(<Box key="wp" x={290} y={270} w={420} h={110} label="wait() = P" size={46} tone="hot" at={0.05} dur={d}/>);
    out.push(<Box key="sv" x={790} y={270} w={420} h={110} label="signal() = V" size={46} tone="b" at={tS} dur={d}/>);
    out.push(<Label key="w1" text="S − 1" x={290} y={355} w={460} size={38} font={C.fMono} at={tTk} dur={d}/>);
    out.push(<Label key="w2" text="if S was 0: sleeps" x={290} y={405} w={460} size={34} color={C.coral} at={tZ} dur={d}/>);
    out.push(<Label key="v1" text="S + 1" x={790} y={355} w={460} size={38} font={C.fMono} at={tAd} dur={d}/>);
    out.push(<Label key="v2" text="wakes a sleeper" x={790} y={405} w={460} size={34} color={C.cobalt} at={tWk} dur={d}/>);
    out.push(...Val("v",d,540,760,240,140,"S",[[1,0.1,tTk+0.3],[0,tTk+0.3,tAd+0.3],[1,tAd+0.3,undefined]],{size:56}));
    out.push(<Box key="pp" x={200} y={600} w={200} h={90} label="process" size={34} at={tZ} dur={d}/>);
    out.push(<Ico key="zz" ctx={ctx} name="moon" x={200} y={700} size={70} color={C.coral} at={tSl} out={tWk} dur={d}/>);
    out.push(<Ico key="wk" ctx={ctx} name="sun" x={200} y={700} size={70} color={C.cobalt} at={tWk} dur={d}/>);
    out.push(AR("wv",d,tWk,790,455,312,592,C.cobalt,{dash:[12,10],w:5}));
    // one unbroken step
    bb({k:"srect",n:"atomic",x:120,y:900,w:840,h:150,t0:tEa,t1:d,id:"at"});
    out.push(<Layer key="at0" at={tEa} out={tSi} dur={d} sfx="pop" anim={FADE}>{[0,1,2].map(i=>R(120+i*290,920,260,110,{r:14,stroke:C.navy,sw:4}))}</Layer>);
    ["read","change","write"].forEach((t,i)=>out.push(<Label key={"at0l"+i} text={t} x={250+i*290} y={952} w={240} size={40} font={C.fMono} at={tEa+i*0.15} out={tSi} dur={d}/>));
    out.push(<Layer key="at1" at={tSi} dur={d} sfx="hit" anim={FADE}>{R(120,900,840,150,{r:20,fill:C.chip,stroke:C.coral,sw:6})}</Layer>);
    out.push(<Label key="at1l" text="ONE single step" x={540} y={948} w={800} size={48} font={C.fHead} color={C.coral} at={tSi} dur={d}/>);
    out.push(<Box key="p2" x={540} y={1210} w={200} h={90} label="P2" size={40} tone="b" at={tIn-0.3} dur={d}/>);
    out.push(AR("cut",d,tIn,540,1160,540,1065,C.cobalt,{dash:[12,10],w:5}));
    out.push(XM("cx",d,540,1112,60,tIn+0.3));
    out.push(<Label key="ni" text="can't be interrupted" x={540} y={1280} w={900} size={38} color={C.coral} at={tIn} dur={d}/>);
    out.push(<Label key="nv" text="never two changes to the count at once" x={540} y={1350} w={980} size={36} at={tSo} dur={d}/>);
    return out;
  },{cam:CAM(1.0),hold:"so two processes",holdY:960}),

  // ===== 3 · two types: counting and binary =====
  S("There are two types",(r,d)=>{
    const tC=r("Accounting"), tAn=r("any number"), tSt=r("You started"), tId=r("identical"), t3=r("three printers"), tEF=r("Empty and full"), tB=r("A binary"), tZo=r("only zero"), tLk=r("like a lock"), tMx=r("The mutex was");
    const out=[];
    out.push(Pan("pc",d,tC,60,190,960,580,C.coral));
    out.push(<Label key="ct" text="COUNTING semaphore" x={90} y={210} w={900} size={44} align="left" font={C.fHead} color={C.coral} at={tC} dur={d}/>);
    out.push(<Label key="ca" text="any number: 0, 1, 2, 3, …" x={90} y={275} w={900} size={36} align="left" at={tAn} dur={d}/>);
    out.push(<Box key="c3" x={220} y={440} w={240} h={130} label="S = 3" size={52} tone="hot" at={tSt} dur={d}/>);
    [0,1,2].forEach(i=>out.push(<Ico key={"pr"+i} ctx={ctx} name="printer" x={530+i*160} y={440} size={120} color={C.navy} at={t3+i*0.15} dur={d}/>));
    out.push(<Label key="ci" text="start = number of identical resources" x={540} y={540} w={940} size={34} at={tId} dur={d}/>);
    out.push(Tag("t1",d,tEF,90,630));
    out.push(<Box key="re" x={405} y={680} w={230} h={84} label="empty = 5" size={36} at={tEF} dur={d}/>);
    out.push(<Box key="rf" x={665} y={680} w={230} h={84} label="full = 0" size={36} at={tEF+0.2} dur={d}/>);
    out.push(<Label key="rl" text="counting" x={897} y={660} w={180} size={34} font={C.fMono} color={C.coral} at={tEF+0.5} dur={d}/>);
    out.push(Pan("pb",d,tB,60,800,960,560,C.cobalt));
    out.push(<Label key="bt" text="BINARY semaphore" x={90} y={820} w={900} size={44} align="left" font={C.fHead} color={C.cobalt} at={tB} dur={d}/>);
    out.push(<Label key="ba" text="only 0 or 1" x={90} y={885} w={900} size={36} align="left" at={tZo} dur={d}/>);
    out.push(...Val("b",d,220,1050,240,130,"S",[[1,tZo,tZo+1.0],[0,tZo+1.0,tZo+1.8],[1,tZo+1.8,undefined]],{size:52,tone:"b"}));
    out.push(<Ico key="lk" ctx={ctx} name="lock" x={530} y={1050} size={120} color={C.cobalt} at={tLk} dur={d}/>);
    out.push(<Label key="bl" text="works like a lock" x={800} y={1025} w={360} size={36} at={tLk} dur={d}/>);
    out.push(Tag("t2",d,tMx,90,1220));
    out.push(<Box key="rm" x={430} y={1270} w={270} h={84} label="mutex = 1" size={36} tone="b" at={tMx} dur={d}/>);
    out.push(<Label key="rml" text="binary" x={700} y={1250} w={180} size={34} font={C.fMono} color={C.cobalt} at={tMx+0.3} dur={d}/>);
    return out;
  },{cam:CAM(1.0)}),

  // ===== 4 · three ways semaphores give synchronization =====
  S("How does it give",(r,d)=>{
    const t3w=r("Three ways"), tMe=r("Mutual exclusion"), tS1=r("Start at one"), tEp=r("Each process waits"), tWb=r("waits before"), tSa=r("signals after"), tOn=r("only one is inside");
    const tOr=r("Ordering"), tS0=r("Start at zero"), tIf=r("If task B"), tBw=r("B waits"), tAs=r("and A signals")+0.42, tDn=r("done");
    const tCn=r("Counting"), tSN=r("Start at N"), tAm=r("at most"), tPo=r("pool");
    const out=[];
    out.push(<Label key="h" text="three ways to keep processes in step" x={540} y={190} w={980} size={40} color={C.cobalt} at={0.05} dur={d}/>);
    // 1 · mutual exclusion: start 1
    out.push(Pan("q1",d,tMe,60,260,960,400,C.coral));
    out.push(<Label key="q1t" text="1 · Mutual exclusion" x={90} y={278} w={600} size={42} align="left" color={C.coral} at={tMe} dur={d}/>);
    out.push(<Box key="q1s" x={880} y={310} w={220} h={80} label="S = 1" size={40} tone="hot" at={tS1} dur={d}/>);
    out.push(<Label key="q1c1" text="wait(S)" x={90} y={400} w={260} size={36} align="left" font={C.fMono} at={tWb} dur={d}/>);
    out.push(<Label key="q1c2" text="use data" x={90} y={460} w={260} size={36} align="left" font={C.fMono} at={tWb+0.4} dur={d}/>);
    out.push(<Label key="q1c3" text="signal(S)" x={90} y={520} w={260} size={36} align="left" font={C.fMono} at={tSa} dur={d}/>);
    bb({k:"srect",n:"shared q1",x:380,y:400,w:340,h:190,t0:tEp,t1:d,id:"q1d"});
    out.push(<Layer key="q1d" at={tEp} dur={d} sfx="pop" anim={FADE}>{R(380,400,340,190,{r:14,stroke:C.cobalt,sw:4})}</Layer>);
    out.push(<Label key="q1dl" text="shared data" x={550} y={410} w={320} size={34} font={C.fMono} color={C.cobalt} at={tEp} dur={d}/>);
    out.push(<Box key="q1a" x={550} y={520} w={170} h={80} label="P1" size={38} tone="hot" at={tWb+0.4} dur={d}/>);
    out.push(<Box key="q1b" x={880} y={520} w={170} h={80} label="P2" size={38} tone="b" at={tWb+0.6} dur={d}/>);
    out.push(<Label key="q1w" text="waits" x={880} y={575} w={200} size={34} font={C.fMono} color={C.coral} at={tOn} dur={d}/>);
    out.push(<Label key="q1o" text="only one inside" x={550} y={600} w={340} size={34} color={C.coral} at={tOn} dur={d}/>);
    // 2 · ordering: start 0
    out.push(Pan("q2",d,tOr,60,680,960,400,C.cobalt));
    out.push(<Label key="q2t" text="2 · Ordering" x={90} y={698} w={600} size={42} align="left" color={C.cobalt} at={tOr} dur={d}/>);
    out.push(<Box key="q2s" x={880} y={730} w={220} h={80} label="S = 0" size={40} tone="b" at={tS0} dur={d}/>);
    out.push(<Box key="q2a" x={230} y={880} w={260} h={100} label="task A" size={40} tone="hot" at={tIf} dur={d}/>);
    out.push(<Box key="q2b" x={850} y={880} w={260} h={100} label="task B" size={40} tone="b" at={tIf+0.2} dur={d}/>);
    out.push(<Label key="q2bw" text="wait(S)" x={850} y={950} w={260} size={34} font={C.fMono} at={tBw} dur={d}/>);
    out.push(<Ico key="q2z" ctx={ctx} name="moon" x={660} y={880} size={70} color={C.coral} at={tBw+0.2} out={tAs+0.6} dur={d}/>);
    out.push(<Label key="q2as" text="signal(S)" x={230} y={950} w={260} size={34} font={C.fMono} at={tAs} dur={d}/>);
    out.push(AR("q2ar",d,tAs+0.3,370,880,710,880,C.coral,{w:6}));
    out.push(<Check key="q2ok" x={230} y={790} size={60} at={tDn} dur={d}/>);
    out.push(<Label key="q2r" text="B runs after A" x={540} y={1015} w={600} size={36} color={C.cobalt} at={tDn} dur={d}/>);
    // 3 · counting: start N
    out.push(Pan("q3",d,tCn,60,1100,960,400,C.coral));
    out.push(<Label key="q3t" text="3 · Counting" x={90} y={1118} w={600} size={42} align="left" color={C.coral} at={tCn} dur={d}/>);
    out.push(<Box key="q3s" x={880} y={1150} w={220} h={80} label="S = N" size={40} tone="hot" at={tSN} dur={d}/>);
    bb({k:"srect",n:"pool",x:90,y:1240,w:640,h:150,t0:tSN,t1:d,id:"pool"});
    out.push(<Layer key="pool" at={tSN} dur={d} sfx="pop" anim={FADE}>{R(90,1240,640,150,{r:14,stroke:C.navy,sw:4})}</Layer>);
    ["1","2","…","N"].forEach((s,i)=>out.push(<Box key={"ps"+i} x={170+i*160} y={1315} w={130} h={90} label={i===2?"…":"P"+s} size={36} tone={i===2?"ghost":"hot"} at={tAm+i*0.15} dur={d}/>));
    out.push(<Box key="q3x" x={880} y={1315} w={170} h={90} label="P(N+1)" size={36} tone="b" at={tPo-0.3} dur={d}/>);
    out.push(<Label key="q3w" text="waits" x={880} y={1370} w={200} size={34} font={C.fMono} color={C.coral} at={tPo} dur={d}/>);
    out.push(<Label key="q3o" text="at most N use the pool" x={410} y={1420} w={640} size={36} color={C.coral} at={tAm} dur={d}/>);
    return out;
  },{cam:CAM(1.0),hold:"Counting",holdY:960}),

  // ===== 5-6 · answer cards =====
  ...ans.map((pg,k)=>{ const at=tEx+k*dd;
    const s=S("In your exam",(r,d)=>{ globalThis.__T0=at; return AnswerCard({ page: pg, title: "WRITE THIS · 5 MARKS · "+(k+1)+"/"+ans.length, at: 0, dur: d, y: TOP + 24 }); },{cam:[{t:0,x:540,y:960,z:1.0},{t:1,x:540,y:960,z:1.0}]});
    return {...s, at}; }),
  ];
};
