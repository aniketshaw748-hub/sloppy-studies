// os-q01 · Five short answers (v3). Machine world, question bar switches per question (spec.json cues).
import { Box, Mover, Ico, Label, Ring, Layer, XMark, Check, Head, bb } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
const W=1080,H=1920;
const CAM=(z=1,y=960)=>[{t:0,x:540,y:960,z:1},{t:999,x:540,y,z}];

export const SCENES = ({ S, ctx, C, TOP, cue, D }) => {
  // ---------- raw drawing helpers ----------
  const R=(x,y,w,h,o={})=>{ const p={x,y,width:w,height:h,radius:o.r||0,fill:o.fill||"#00000000"}; if(o.stroke){p.strokeColor=o.stroke;p.strokeWidth=o.sw||4;} if(o.op!=null)p.opacity=o.op; return <rect {...p}/>; };
  const PL=(d,col,w=6,dash)=>{ const p={d,x:0,y:0,width:W,height:H,stroke:{width:w,color:col,cap:"round"}}; if(dash)p.dash=dash; return <path {...p}/>; };
  const PF=(d,col)=><path d={d} x={0} y={0} width={W} height={H} fill={col}/>;
  const T=(s,x,y,w,fs,col,o={})=><text x={x} y={y} width={w} align={o.align||"center"} fontFamily={o.font||C.fMono} fontWeight={700} fontSize={fs} color={col}>{s}</text>;
  const head=(x1,y1,x2,y2,col,L=24)=>{ const a=Math.atan2(y2-y1,x2-x1); return PF(`M ${x2} ${y2} L ${x2-L*Math.cos(a-0.45)} ${y2-L*Math.sin(a-0.45)} L ${x2-L*Math.cos(a+0.45)} ${y2-L*Math.sin(a+0.45)} Z`,col); };
  const arrowK=(x1,y1,x2,y2,col,w=7,dash)=>[PL(`M ${x1} ${y1} L ${x2} ${y2}`,col,w,dash), head(x1,y1,x2,y2,col)];
  const AR=(k,d,at,x1,y1,x2,y2,col,o={})=><Layer key={k} at={at} dur={d} out={o.out} sfx="swish" anim={[{property:"opacity",from:0,to:1,at:0,duration:0.25}]}>{arrowK(x1,y1,x2,y2,col,o.w||7,o.dash)}</Layer>;
  // a two-line row panel (title + detail), registered as one box
  const Row=(k,d,at,y,title,detail,o={})=>{ const x=60,w=960,h=o.h||112; bb({k:"box",n:title,x,y,w:w+4,h:h+4,t0:at,t1:o.out??d});
    return <Layer key={k} at={at} dur={d} out={o.out} sfx="pop" anim={[{property:"opacity",from:0,to:1,at:0,duration:0.15},{property:"offsetX",from:-30,to:0,at:0,duration:0.35,easing:[0.22,1,0.36,1]}]}>
      {R(x,y,w,h,{r:14,fill:C.chip,stroke:o.col||C.coral,sw:4})}
      {R(x+22,y+h/2-30,60,60,{r:30,fill:o.col||C.coral})}{T(o.n||"",x+22,y+h/2-20,60,34,C.ink)}
      {T(title,x+104,y+12,w-120,40,o.col||C.coral,{align:"left",font:C.fBody})}
      {T(detail,x+104,y+58,w-120,34,C.navy,{align:"left",font:C.fBody})}</Layer>; };
  // a chip that lives inside a Mover box (0,0)-(w,h)
  const chip=(w,h,label,fill,fs=36,tc)=>[R(0,0,w,h,{r:12,fill,stroke:C.navy,sw:3}),T(label,0,h/2-fs*0.62,w,fs,tc||C.ink)];
  // ring / cross with an exit time
  const RG=(k,d,x,y,rr,at,out,col)=><Layer key={k} at={at} dur={d} out={out} sfx="ping" anim={[{property:"opacity",keyframes:[{at:0,value:0},{at:0.15,value:1},{at:0.9,value:1}]}]}>{R(x-rr,y-rr,rr*2,rr*2,{r:rr,stroke:col||C.coral,sw:10})}</Layer>;
  const XM=(k,d,x,y,sz,at,out,col)=>{ const h=sz/2; return <Layer key={k} at={at} dur={d} out={out} sfx="wrong" anim={[{property:"opacity",from:0,to:1,at:0,duration:0.1}]}>{PL(`M ${x-h} ${y-h} L ${x+h} ${y+h} M ${x+h} ${y-h} L ${x-h} ${y+h}`,col||C.coral,18)}</Layer>; };

  const ans=ANSWERS["os-q01"], tEx=cue("In your exam"), dd=(D-tEx)/ans.length;

  return [
  // ===== 0 · intro: five numbered cards =====
  S(null,(r,d)=>{ const items=["Deadlock","Race condition","Virtual memory","External fragmentation","Mutex"];
    return items.map((t,i)=>{ const y=300+i*170, at=0.05+i*0.32; bb({k:"box",n:t,x:140,y:y-65,w:800,h:130,t0:at,t1:d});
      return <Layer key={"c"+i} at={at} dur={d} sfx="pop" anim={[{property:"opacity",from:0,to:1,at:0,duration:0.12},{property:"offsetY",from:-60,to:0,at:0,duration:0.35,easing:[0.22,1,0.36,1]}]}>
        {R(140,y-65,800,130,{r:16,fill:C.chip,stroke:C.navy,sw:4})}{R(172,y-36,72,72,{r:36,fill:C.coral})}
        {T(String(i+1),172,y-24,72,40,C.ink)}{T(t,276,y-30,640,48,C.navy,{align:"left",font:C.fBody})}</Layer>; });
  },{cam:CAM(1.02)}),

  // ===== 1 · Q1 four conditions of deadlock =====
  S("Question one the four",(r,d)=>{
    const cy=530, P=[[540,200],[870,530],[540,860],[210,530]], Rs=[[830,240],[830,820],[250,820],[250,240]], RY0=1050, RS=114;
    const tPr=r("processes"), tRun=r("that is running"), tStuck=r("stuck"), tEach=r("each waiting"), tAno=r("another one holds"), tNeeds=r("It needs");
    const tME=r("exclusion"), tPrn=r("like a printer"), tHW=r("Hold and wait"), tNP=r("No preemption"), tForce=r("force"), tCW=r("Circular wait"), tCirc=r("forms a circle"), tRem=r("Remove"), tCant=r("can't happen");
    const bnd=(cx,cy_,hw,hh,dx,dy)=>{ const t=Math.min(hw/Math.max(1e-6,Math.abs(dx)),hh/Math.max(1e-6,Math.abs(dy))); return [cx+dx*t,cy_+dy*t]; };
    const E=(a,ah,b,bh)=>{ const dx=b[0]-a[0], dy=b[1]-a[1]; const s=bnd(a[0],a[1],ah[0]+8,ah[1]+8,dx,dy), e=bnd(b[0],b[1],bh[0]+10,bh[1]+10,-dx,-dy); return [...s,...e]; };
    const PH=[80,48], RH=[60,40];
    const out=[];
    P.forEach((p,i)=>out.push(<Box key={"p"+i} x={p[0]} y={p[1]} w={160} h={96} label={"P"+(i+1)} size={44} at={0.1+i*0.15} dur={d}/>));
    out.push(<Label key="d1" text="process = a running program" x={540} y={990} w={960} size={38} at={tRun} out={tStuck} dur={d}/>);
    out.push(<Label key="d2" text="deadlock: all STUCK, each waiting" x={540} y={990} w={960} size={38} at={tStuck} out={tNeeds} dur={d}/>);
    out.push(<Label key="d3" text="needs ALL FOUR at once" x={540} y={990} w={960} size={40} at={tNeeds} dur={d} color={C.coral}/>);
    Rs.forEach((q,i)=>out.push(<Box key={"r"+i} x={q[0]} y={q[1]} w={120} h={80} label={"R"+(i+1)} size={38} tone="b" at={tEach+i*0.12} dur={d}/>));
    Rs.forEach((q,i)=>{ const [x1,y1,x2,y2]=E(q,RH,P[(i+1)%4],PH); out.push(AR("h"+i,d,tEach+0.3+i*0.12,x1,y1,x2,y2,C.cobalt)); });
    Rs.forEach((q,i)=>{ const [x1,y1,x2,y2]=E(P[i],PH,q,RH); out.push(AR("w"+i,d,tAno+i*0.15,x1,y1,x2,y2,C.coral,{dash:[14,10],out:i===3?tRem+0.3:undefined})); });
    out.push(<Label key="lg1" text="→ holds" x={290} y={935} w={300} size={34} font={C.fMono} color={C.cobalt} at={tEach+0.3} dur={d}/>);
    out.push(<Label key="lg2" text="⇢ waits for" x={790} y={935} w={340} size={34} font={C.fMono} color={C.coral} at={tAno} dur={d}/>);
    const rows=[["Mutual exclusion","one process at a time per resource",tME],["Hold and wait","holds one, waits for another",tHW],["No preemption","nothing taken away by force",tNP],["Circular wait","the waiting forms a circle",tCW]];
    rows.forEach(([a,b,t],i)=>out.push(Row("row"+i,d,t,RY0+i*RS,a,b,{n:String(i+1),h:104})));
    out.push(<Ico key="prn" ctx={ctx} name="printer" x={540} y={cy-20} size={130} color={C.navy} at={tPrn} out={tHW} dur={d}/>);
    out.push(RG("rgR1",d,830,240,85,tME,tHW));
    out.push(<Layer key="rgP1" at={tHW} out={tNP} dur={d} sfx="ping">{R(436,140,208,124,{r:20,stroke:C.coral,sw:8})}</Layer>);
    out.push(RG("rgR4",d,250,240,85,tHW+0.4,tNP,C.cobalt));
    out.push(<Ico key="hand" ctx={ctx} name="hand" x={540} y={cy-10} size={120} color={C.navy} at={tNP} out={tCW} dur={d}/>);
    out.push(AR("grab",d,tNP+0.4,770,290,620,440,C.coral,{dash:[14,10],out:tCW}));
    out.push(XM("xh",d,540,cy-10,150,tForce,tCW));
    out.push(<Ico key="cyc" ctx={ctx} name="refresh-cw" x={540} y={cy} size={150} color={C.coral} at={tCW} out={tRem} dur={d}/>);
    out.push(XM("xb",d,(210+250)/2+4,(530+240)/2+6,70,tRem+0.3));
    out.push(<Layer key="dim" at={tRem+0.4} dur={d} anim={[{property:"opacity",from:0,to:0.62,at:0,duration:0.3}]}>{R(56,RY0+3*RS-4,970,114,{r:14,fill:C.paper})}</Layer>);
    out.push(XM("x4",d,975,RY0+3*RS+52,64,tRem+0.5));
    out.push(<Check key="ok" x={540} y={cy} size={130} at={tCant-0.2} dur={d}/>);
    out.push(<Label key="fin" text="remove any one → no deadlock" x={540} y={1515} w={980} size={40} at={tRem} dur={d} color={C.cobalt}/>);
    return out;
  },{cam:CAM(1.0),hold:"Remove",holdY:960}),

  // ===== 2 · Q2 race condition =====
  S("Question two",(r,d)=>{
    const X=[250,830], RY=[640,780,920];
    const tTwo=r("two processes"), tCh=r("change"), tDep=r("the result depends"), tRead=r("read"), tAdd=r("add one"), tWr=r("write six"), tSh=r("should"), tRace=r("that's a race");
    const tLand=tWr+0.8;
    const out=[];
    out.push(<Box key="c5" x={540} y={250} w={420} h={120} label="counter = 5" size={46} at={0.1} out={tLand} dur={d}/>);
    out.push(<Box key="c6" x={540} y={250} w={420} h={120} label="counter = 6" size={46} tone="hot" at={tLand} dur={d}/>);
    out.push(<Label key="sd" text="shared data" x={540} y={150} w={400} size={34} font={C.fMono} color={C.cobalt} at={0.3} dur={d}/>);
    out.push(<Box key="p1" x={X[0]} y={470} w={240} h={100} label="P1" size={44} tone="hot" at={tTwo} dur={d}/>);
    out.push(<Box key="p2" x={X[1]} y={470} w={240} h={100} label="P2" size={44} tone="b" at={tTwo+0.2} dur={d}/>);
    out.push(AR("ca",d,tCh,330,425,400,320,C.coral,{out:tRead}));
    out.push(AR("cb",d,tCh+0.1,750,425,680,320,C.cobalt,{out:tRead}));
    out.push(<Label key="l1" text="same data, same time" x={540} y={1040} w={960} size={38} at={tCh} out={tDep} dur={d}/>);
    out.push(<Label key="l2" text="result depends on who goes first" x={540} y={1040} w={960} size={38} at={tDep} dur={d}/>);
    out.push(AR("ra",d,tRead,400,320,330,425,C.coral,{dash:[14,10]}));
    out.push(AR("rb",d,tRead+0.25,680,320,750,425,C.cobalt,{dash:[14,10]}));
    [0,1].forEach(k=>{ const t0=k?0.25:0;
      out.push(<Box key={"rd"+k} x={X[k]} y={RY[0]} w={280} h={100} label="read 5" size={40} at={tRead+t0} dur={d}/>);
      out.push(<Box key={"ad"+k} x={X[k]} y={RY[1]} w={280} h={100} label="5 + 1 = 6" size={40} at={tAdd+t0} dur={d}/>);
      out.push(<Box key={"wr"+k} x={X[k]} y={RY[2]} w={280} h={100} label="write 6" size={40} at={tWr+t0} dur={d}/>); });
    [0,1].forEach(k=>{ const sx=k?1014:66, t0=tWr+0.25+k*0.15;
      out.push(<Mover key={"f"+k} at={t0} out={tLand+0.05} dur={d} cw={70} ch={80} pts={[{t:t0,x:X[k]+(k?60:-60),y:RY[2]},{t:t0+0.2,x:sx,y:RY[2]},{t:t0+0.45,x:sx,y:250},{t:tLand,x:k?800:280,y:250}]}>{chip(70,80,"6",k?C.cobalt:C.coral,40)}</Mover>); });
    out.push(<Box key="g6" x={290} y={1190} w={300} h={110} label="got 6" size={44} tone="hot" at={tSh} dur={d}/>);
    out.push(<XMark key="x6" x={505} y={1190} size={70} at={tSh+0.2} dur={d}/>);
    out.push(<Box key="s7" x={780} y={1190} w={360} h={110} label="should be 7" size={42} tone="b" at={r("seven")} dur={d}/>);
    out.push(<Label key="eq" text="5 + 1 + 1 = 7" x={780} y={1270} w={420} size={36} font={C.fMono} at={r("seven")+0.3} dur={d} color={C.cobalt}/>);
    out.push(<Label key="rc" text="RACE CONDITION" x={540} y={1380} w={980} size={78} font={C.fHead} at={tRace} dur={d} color={C.coral}/>);
    return out;
  },{cam:CAM(1.0),hold:"that's a race",holdY:960}),

  // ===== 3 · Q3 virtual memory =====
  S("Question three",(r,d)=>{
    const PY=i=>250+i*110, SY=[300,420,540,660], DY=[875,980,1085,1190,1295];
    const tRAM=r("RAM"), tLim=r("limited"), tVM=r("Virtual memory lets"), tPart=r("part"), tRest=r("The rest"), tLoad=r("loaded"), tNeed=r("needed"), tSo=r("So a program"), tBig=r("bigger");
    const out=[];
    out.push(<Label key="pg" text="program" x={230} y={150} w={300} size={38} color={C.coral} at={0.05} dur={d}/>);
    for(let i=0;i<8;i++) out.push(<Box key={"g"+i} x={230} y={PY(i)} w={240} h={96} label={"page "+i} size={34} tone="ghost" at={0.1+i*0.07} dur={d}/>);
    bb({k:"srect",n:"RAM",x:690,y:235,w:300,h:490,t0:0.7,t1:d,id:"ram"});
    out.push(<Layer key="ram" at={0.7} dur={d} sfx="pop">{R(690,235,300,490,{r:16,stroke:C.cobalt,sw:6})}{SY.map(y=>R(715,y-50,250,100,{r:10,stroke:C.navy,sw:2,op:0.45}))}</Layer>);
    out.push(<Label key="rl" text="RAM" x={840} y={160} w={300} size={40} font={C.fMono} color={C.cobalt} at={tRAM} out={tLim} dur={d}/>);
    out.push(<Label key="rl2" text="RAM · limited" x={840} y={160} w={380} size={40} font={C.fMono} color={C.cobalt} at={tLim} dur={d}/>);
    bb({k:"srect",n:"disk",x:690,y:815,w:300,h:540,t0:tRest,t1:d,id:"disk"});
    out.push(<Layer key="dk" at={tRest} dur={d} sfx="pop">{R(690,815,300,540,{r:34,stroke:C.navy,sw:5})}</Layer>);
    out.push(<Label key="dl" text="disk" x={840} y={748} w={300} size={40} font={C.fMono} at={tRest} dur={d}/>);
    const pc=i=>chip(220,84,"page "+i,C.cobalt,34);
    [0,1,2].forEach(i=>{ const t0=tPart+i*0.25; out.push(<Mover key={"m"+i} at={t0} dur={d} cw={220} ch={84} pts={[{t:t0,x:230,y:PY(i)},{t:t0+0.7,x:840,y:SY[i]}]}>{pc(i)}</Mover>); });
    [3,4,5,6,7].forEach((i,k)=>{ const t0=tRest+0.2+k*0.18; const pts=[{t:t0,x:230,y:PY(i)},{t:t0+0.7,x:840,y:DY[k]}];
      if(i===5) pts.push({t:tNeed+0.1,x:840,y:DY[k]},{t:tNeed+0.9,x:840,y:SY[3]});
      out.push(<Mover key={"m"+i} at={t0} dur={d} cw={220} ch={84} pts={pts}>{pc(i)}</Mover>); });
    out.push(<Layer key="need" at={tLoad} out={tNeed+1.4} dur={d} sfx="ping">{R(98,PY(5)-60,264,120,{r:16,stroke:C.coral,sw:8})}</Layer>);
    out.push(<Label key="nd" text="needed → load" x={525} y={PY(5)-24} w={300} size={34} font={C.fMono} color={C.coral} at={tLoad} out={tSo} dur={d}/>);
    out.push(<Label key="b1" text="only PART of it in RAM" x={540} y={1390} w={980} size={40} at={tPart} out={tRest} dur={d}/>);
    out.push(<Label key="b2" text="rest on disk, loaded when needed" x={540} y={1390} w={980} size={40} at={tRest} out={tSo} dur={d}/>);
    out.push(<Label key="b3" text="8 pages > 4 RAM slots" x={540} y={1390} w={980} size={40} font={C.fMono} at={tSo} dur={d}/>);
    out.push(<Label key="b4" text="program can be BIGGER than RAM" x={540} y={1475} w={980} size={44} color={C.coral} at={tBig} dur={d}/>);
    return out;
  },{cam:CAM(1.0),hold:"So a program",holdY:960}),

  // ===== 4 · Q4 external fragmentation → compaction =====
  S("Question four",(r,d)=>{
    const X0=60, BY=340, BH=150;
    const segs=[["OS",0,130,0,130],["P1",130,310,130,310],["P2",390,560,310,480],["P3",640,820,480,660],["P4",900,960,660,720]];
    const gaps=[[310,390],[560,640],[820,900]];
    const tFree=r("free memory"), tGaps=r("small gaps"), tBig=r("big program"), tFit=r("fit"), tEn=r("enough"), tAns=r("The answer"), tCmp=r("compaction"), tMove=r("Move"), tJoin=r("join"), tBlock=r("big block");
    const out=[];
    out.push(<Label key="mem" text="memory" x={X0} y={180} w={400} size={38} align="left" font={C.fMono} color={C.cobalt} at={0.05} dur={d}/>);
    out.push(<Layer key="bar" at={0.05} dur={d}>{R(X0-6,BY-BH/2-6,972,BH+12,{r:10,stroke:C.navy,sw:4})}</Layer>);
    segs.forEach(([n,a,b,a2,b2],i)=>{ const w=b-a-6, t1=tMove+i*0.15; const pts=[{t:0.1+i*0.08,x:X0+(a+b)/2,y:BY}];
      if(a2!==a) pts.push({t:t1,x:X0+(a+b)/2,y:BY},{t:t1+0.9,x:X0+(a2+b2)/2,y:BY});
      out.push(<Mover key={"s"+i} at={0.1+i*0.08} dur={d} cw={w} ch={BH} pts={pts}>{R(0,0,w,BH,{r:8,fill:i?C.chip:C.cobalt,stroke:C.navy,sw:3})}{T(n,0,BH/2-24,w,38,i?C.navy:C.ink)}</Mover>); });
    gaps.forEach(([a,b],i)=>out.push(<Layer key={"gp"+i} at={tFree} out={tMove} dur={d} sfx={i?undefined:"ping"}>{R(X0+a+4,BY-BH/2+4,b-a-8,BH-8,{r:8,fill:C.coral,op:0.28})}{R(X0+a+4,BY-BH/2+4,b-a-8,BH-8,{r:8,stroke:C.coral,sw:4})}</Layer>));
    gaps.forEach(([a,b],i)=>out.push(<Label key={"gl"+i} text="gap" x={X0+(a+b)/2} y={BY+BH/2+16} w={120} size={34} font={C.fMono} color={C.coral} at={tGaps+i*0.15} out={tMove} dur={d}/>));
    out.push(<Mover key="np" at={tBig} dur={d} cw={220} ch={130} pts={[{t:tBig,x:540,y:650},{t:tFit,x:540,y:650},{t:tFit+0.35,x:X0+600,y:570},{t:tFit+0.7,x:X0+600,y:570},{t:tEn,x:540,y:650},{t:tBlock,x:540,y:650},{t:tBlock+0.9,x:X0+840,y:BY}]}>
      {chip(220,130,"program",C.coral,36)}</Mover>);
    out.push(XM("xf",d,X0+760,570,90,tFit+0.4,tEn));
    out.push(<Label key="cf" text="can't fit any gap" x={540} y={750} w={600} size={36} color={C.coral} at={tFit+0.3} out={tEn} dur={d}/>);
    gaps.forEach(([a,b],i)=>{ const t0=tEn+i*0.12; out.push(<Mover key={"gc"+i} at={t0} dur={d} cw={74} ch={90} pts={[{t:t0,x:X0+(a+b)/2,y:BY},{t:t0+0.7,x:460+i*80,y:780}]}>
      {R(0,0,74,90,{r:6,fill:C.coral,op:0.3})}{R(0,0,74,90,{r:6,stroke:C.coral,sw:4})}</Mover>); });
    out.push(<Label key="en" text="enough free in total" x={540} y={845} w={700} size={36} at={tEn+0.6} dur={d}/>);
    out.push(<Head key="cp" text="COMPACTION" y={950} size={120} at={tCmp} dur={d}/>);
    out.push(<Label key="mv" text="move programs together" x={540} y={1150} w={960} size={40} at={tMove} dur={d}/>);
    out.push(<Label key="jn" text="→ gaps join into one free block" x={540} y={1230} w={960} size={40} color={C.cobalt} at={tJoin} dur={d}/>);
    out.push(<Layer key="fb" at={tJoin} dur={d} sfx="ping">{R(X0+726,BY-BH/2+4,228,BH-8,{r:8,stroke:C.cobalt,sw:6})}</Layer>);
    out.push(<Label key="fbl" text="one free block" x={X0+840} y={BY+BH/2+16} w={300} size={34} font={C.fMono} color={C.cobalt} at={tJoin} dur={d}/>);
    out.push(<Check key="ok" x={X0+840} y={530} size={80} at={tBlock+1.0} dur={d}/>);
    return out;
  },{cam:CAM(1.0),hold:"so the gaps",holdY:960}),

  // ===== 5 · Q5 mutex =====
  S("Question five",(r,d)=>{
    const A0=[180,330], B0=[900,330], IN=[540,760], BW=[880,710];
    const tMx=r("A mutex is"), tLock=r("locks the"), tDone=r("when it's done"), tUn=r("unlocks it"), tWhile=r("While it's locked"), tOnly=r("Only the process"), tLk2=r("locked it");
    const tBin=tUn+0.6, tBw=tLock+0.8;
    const out=[];
    bb({k:"srect",n:"shared data",x:340,y:560,w:400,h:310,t0:0.1,t1:d,id:"sd"});
    out.push(<Layer key="sd" at={0.1} dur={d} sfx="pop">{R(340,560,400,310,{r:18,fill:C.chip,stroke:C.cobalt,sw:6})}</Layer>);
    out.push(<Label key="sdl" text="shared data" x={540} y={576} w={380} size={36} font={C.fMono} color={C.cobalt} at={0.1} dur={d}/>);
    out.push(<Mover key="A" at={0.2} dur={d} cw={200} ch={100} pts={[{t:0.2,x:A0[0],y:A0[1]},{t:tLock,x:A0[0],y:A0[1]},{t:tLock+0.7,x:IN[0],y:IN[1]},{t:tUn,x:IN[0],y:IN[1]},{t:tUn+0.6,x:A0[0],y:A0[1]}]}>{chip(200,100,"proc A",C.coral,38)}</Mover>);
    out.push(<Mover key="B" at={0.35} dur={d} cw={200} ch={100} pts={[{t:0.35,x:B0[0],y:B0[1]},{t:tBw,x:B0[0],y:B0[1]},{t:tBw+0.6,x:BW[0],y:BW[1]},{t:tBin,x:BW[0],y:BW[1]},{t:tBin+0.6,x:IN[0],y:IN[1]}]}>{chip(200,100,"proc B",C.cobalt,38)}</Mover>);
    out.push(<Label key="bw" text="waits" x={BW[0]} y={780} w={200} size={36} font={C.fMono} color={C.coral} at={tBw+0.6} out={tBin} dur={d}/>);
    const lk=[["lock-open",C.cobalt,tMx,tLock],["lock",C.coral,tLock+0.5,tUn],["lock-open",C.cobalt,tUn,tBin+0.5],["lock",C.coral,tBin+0.5,d]];
    lk.forEach(([n,c,a,o],i)=>out.push(<Ico key={"lk"+i} ctx={ctx} name={n} x={540} y={470} size={100} color={c} at={a} out={o<d?o:undefined} dur={d}/>));
    const st=[["mutex = a LOCK",tMx,tLock+0.5,C.navy],["locked by A",tLock+0.5,tUn,C.coral],["unlocked",tUn,tBin+0.5,C.cobalt],["locked by B",tBin+0.5,undefined,C.coral]];
    st.forEach(([s,a,o,c],i)=>out.push(<Label key={"st"+i} text={s} x={790} y={445} w={330} size={36} font={C.fMono} color={c} at={a} out={o} dur={d}/>));
    [["lock()",tLock],["use data",tDone-0.4],["unlock()",tUn]].forEach(([s,t],i)=>out.push(<Box key={"sp"+i} x={200+i*340} y={1010} w={280} h={100} label={s} size={40} tone={i===1?"a":"hot"} at={t} dur={d}/>));
    out.push(AR("s1",d,tDone-0.4,346,1010,394,1010,C.navy,{w:5}));
    out.push(AR("s2",d,tUn,686,1010,734,1010,C.navy,{w:5}));
    out.push(<Label key="w1" text="while locked, others wait" x={540} y={1150} w={960} size={40} at={tWhile} dur={d}/>);
    out.push(<Label key="w2" text="only the owner can unlock" x={540} y={1240} w={960} size={40} color={C.coral} at={tOnly} dur={d}/>);
    out.push(AR("au",d,tLk2,285,375,478,455,C.coral,{dash:[14,10],w:5}));
    out.push(<XMark key="ax" x={382} y={415} size={70} at={tLk2+0.4} dur={d}/>);
    return out;
  },{cam:CAM(1.0),hold:"Only the process",holdY:960}),

  // ===== 6-7 · answer cards, splitting the time from "In your exam" to the end evenly =====
  ...ans.map((pg,k)=>{ const at=tEx+k*dd;
    const s=S("In your exam",(r,d)=>{ globalThis.__T0=at; return AnswerCard({ page: pg, title: "WRITE THIS · 2 MARKS · "+(k+1)+"/"+ans.length, at: 0, dur: d, y: TOP + 24 }); },{cam:[{t:0,x:540,y:960,z:1.0},{t:1,x:540,y:960,z:1.0}]});
    return {...s, at}; }),
  ];
};
