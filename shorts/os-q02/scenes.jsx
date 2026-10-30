// os-q02 · Producer–consumer (v3). Machine world. Recalls process, race condition, mutex and deadlock from os-q01.
import { Box, Mover, Ico, Label, Layer, XMark, Check, Head, bb } from "./prims.jsx";
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
  const arrowK=(x1,y1,x2,y2,col,w=7,dash,L)=>[PL(`M ${x1} ${y1} L ${x2} ${y2}`,col,w,dash), head(x1,y1,x2,y2,col,L)];
  const AR=(k,d,at,x1,y1,x2,y2,col,o={})=><Layer key={k} at={at} dur={d} out={o.out} sfx="swish" anim={[{property:"opacity",from:0,to:1,at:0,duration:0.25}]}>{arrowK(x1,y1,x2,y2,col,o.w||7,o.dash,o.L)}</Layer>;
  const XM=(k,d,x,y,sz,at,out,col)=>{ const h=sz/2; return <Layer key={k} at={at} dur={d} out={out} sfx="wrong" anim={[{property:"opacity",from:0,to:1,at:0,duration:0.1}]}>{PL(`M ${x-h} ${y-h} L ${x+h} ${y+h} M ${x+h} ${y-h} L ${x-h} ${y+h}`,col||C.coral,16)}</Layer>; };
  const chip=(w,h,label,fill,fs=36,tc)=>[R(0,0,w,h,{r:12,fill,stroke:C.navy,sw:3}),T(label,0,h/2-fs*0.62,w,fs,tc||C.ink)];
  const FADE=[{property:"opacity",from:0,to:1,at:0,duration:0.15},{property:"offsetY",from:30,to:0,at:0,duration:0.35,easing:[0.22,1,0.36,1]}];
  // buffer slots (raw) + one registered container; filled = number of items from the left
  const Buf=(k,d,at,cx,cy,sw,sh,gap,filled=0,o={})=>{ const n=5, tw=n*sw+(n-1)*gap, x0=cx-tw/2;
    bb({k:"srect",n:"buffer",x:x0-10,y:cy-sh/2-10,w:tw+20,h:sh+20,t0:at,t1:o.out??d,id:k});
    return <Layer key={k} at={at} dur={d} out={o.out} sfx="pop" anim={FADE}>{Array.from({length:n},(_,i)=>[
      R(x0+i*(sw+gap),cy-sh/2,sw,sh,{r:10,stroke:C.navy,sw:4}),
      i<filled?R(x0+i*(sw+gap)+8,cy-sh/2+8,sw-16,sh-16,{r:8,fill:C.coral}):null,
      o.nums?T(String(i+1),x0+i*(sw+gap),cy-17,sw,34,C.navy):null])}</Layer>; };
  // recall panel: a compact callback to os-q01, tagged
  const Recall=(k,d,at,out,x,y,w,h,tag,kids)=>{ bb({k:"box",n:"recall "+tag,x,y,w:w+4,h:h+4,t0:at,t1:out??d});
    return <Layer key={k} at={at} dur={d} out={out} sfx="ping" anim={FADE}>{R(x,y,w,h,{r:16,fill:C.chip,stroke:C.cobalt,sw:3})}
      {R(x+18,y+16,190,46,{r:23,fill:C.cobalt})}{T(tag,x+18,y+21,190,30,C.ink)}{kids}</Layer>; };
  // a value box that changes over time: segs=[[value,from,to]]
  const Val=(k,d,x,y,w,h,name,segs,o={})=>segs.map(([v,a,b],i)=><Box key={k+i} x={x} y={y} w={w} h={h} label={name+" = "+v} size={o.size||40} tone={i===0?(o.tone||"a"):"hot"} at={a} out={b} dur={d}/>);

  const ans=ANSWERS["os-q02"], tEx=cue("In your exam"), dd=(D-tEx)/ans.length;

  return [
  // ===== 0 · question + from zero: two processes, producer / consumer, the buffer =====
  S(null,(r,d)=>{
    const tRem=r("Remember"), tProc=r("process"), tMk=r("makes data"), tDl=r("downloading"), tPl=r("plays"), tPr=r("is the producer"), tCo=r("is the consumer"), tBuf=r("buffer"), tSm=r("small shared"), tFive=r("five");
    const out=[];
    const win=(k,x,title,col)=>{ bb({k:"srect",n:"window "+k,x,y:170,w:400,h:300,t0:0.1,t1:d,id:"w"+k});
      return <Layer key={"w"+k} at={0.1} dur={d} sfx="pop" anim={FADE}>{R(x,170,400,300,{r:14,fill:C.chip,stroke:col,sw:5})}{R(x,170,400,56,{r:14,fill:col,op:0.35})}
        {[0,1,2].map(j=>R(x+18+j*30,190,18,18,{r:9,fill:C.navy,op:0.6}))}</Layer>; };
    out.push(win("L",60,"",C.coral), win("R",620,"",C.cobalt));
    out.push(<Label key="t1" text="process" x={300} y={180} w={240} size={34} font={C.fMono} at={tProc} dur={d}/>);
    out.push(<Label key="t2" text="process" x={860} y={180} w={240} size={34} font={C.fMono} at={tProc+0.15} dur={d}/>);
    out.push(AR("dat",d,tMk,470,330,610,330,C.navy));
    out.push(<Label key="dl0" text="data" x={540} y={262} w={140} size={34} font={C.fMono} at={tMk} dur={d}/>);
    out.push(<Ico key="dl" ctx={ctx} name="download" x={260} y={330} size={110} color={C.coral} at={tDl} dur={d}/>);
    out.push(<Layer key="pb" at={tDl+0.2} dur={d} anim={[{property:"opacity",from:0,to:1,at:0,duration:0.2}]}>{R(110,410,300,18,{r:9,stroke:C.navy,sw:2})}</Layer>);
    out.push(<Layer key="pb2" at={tDl+0.2} dur={d} anim={[{property:"scaleX",from:0.05,to:1,at:0,duration:2.5}]}>{R(112,412,200,14,{r:7,fill:C.coral})}</Layer>);
    out.push(<Ico key="pl" ctx={ctx} name="play" x={820} y={335} size={110} color={C.cobalt} at={tPl} dur={d}/>);
    out.push(<Label key="pr" text="PRODUCER" x={260} y={490} w={400} size={44} font={C.fHead} color={C.coral} at={tPr} dur={d}/>);
    out.push(<Label key="co" text="CONSUMER" x={820} y={490} w={400} size={44} font={C.fHead} color={C.cobalt} at={tCo} dur={d}/>);
    out.push(<Label key="mk" text="makes data" x={260} y={555} w={400} size={34} at={tPr+0.3} dur={d}/>);
    out.push(<Label key="us" text="uses data" x={820} y={555} w={400} size={34} at={tCo+0.3} dur={d}/>);
    out.push(Buf("buf",d,tBuf,540,770,150,110,20,0,{}));
    out.push(Buf("bufn",d,tFive,540,770,150,110,20,0,{nums:true}));
    out.push(AR("in",d,tBuf+0.3,260,605,300,695,C.coral));
    out.push(AR("ou",d,tBuf+0.4,780,695,820,605,C.cobalt));
    out.push(<Label key="bl" text="buffer" x={540} y={845} w={400} size={44} font={C.fHead} color={C.coral} at={tBuf} dur={d}/>);
    out.push(<Label key="bl2" text="small shared memory, fixed slots" x={540} y={910} w={960} size={36} at={tSm} out={tFive} dur={d}/>);
    out.push(<Label key="bl3" text="fixed slots: say 5" x={540} y={910} w={960} size={36} font={C.fMono} at={tFive} dur={d}/>);
    // recall: process (os-q01)
    out.push(Recall("rc",d,tRem,tPr,140,1000,800,200,"from Q1",[
      R(180,1090,160,80,{r:12,fill:C.chip,stroke:C.navy,sw:4}),T("P1",180,1108,160,40,C.navy),
      T("process =",380,1082,520,36,C.navy,{align:"left",font:C.fBody}),T("a running program",380,1128,520,36,C.navy,{align:"left",font:C.fBody})]));
    return out;
  },{cam:CAM(1.0)}),

  // ===== 1 · what the question wants =====
  S("So the question",(r,d)=>{
    const out=[];
    out.push(<Box key="p" x={150} y={240} w={200} h={90} label="producer" size={36} tone="hot" at={0.05} dur={d}/>);
    out.push(Buf("b",d,0.1,540,240,70,70,14,0));
    out.push(<Box key="c" x={930} y={240} w={200} h={90} label="consumer" size={36} tone="b" at={0.15} dur={d}/>);
    out.push(<Label key="q" text="the question wants:" x={540} y={380} w={960} size={40} at={r("wants")} dur={d} color={C.cobalt}/>);
    out.push(<Box key="c1" x={540} y={520} w={860} h={120} label="1 · What can go wrong?" size={48} at={r("What can")} dur={d}/>);
    out.push(<Box key="c2" x={540} y={680} w={860} h={120} label="2 · How to fix it?" size={48} at={r("how to fix")} dur={d}/>);
    return out;
  },{cam:CAM(1.0)}),

  // ===== 2 · three problems =====
  S("Three things",(r,d)=>{
    const tF=r("A full"), tE=r("An empty"), tB=r("And if both"), tC=r("count gets"), tRc=r("The race condition");
    const out=[];
    const pan=(k,y,at,title)=>{ bb({k:"srect",n:title,x:60,y,w:960,h:230,t0:at,t1:d,id:k});
      return [<Layer key={k} at={at} dur={d} sfx="pop" anim={FADE}>{R(60,y,960,230,{r:16,fill:C.chip,stroke:C.coral,sw:4})}</Layer>,
        <Label key={k+"t"} text={title} x={90} y={y+14} w={900} size={40} align="left" color={C.coral} at={at} dur={d}/>]; };
    // 1 · full buffer: producer must wait
    out.push(...pan("p1",160,tF,"1 · FULL buffer"));
    out.push(<Box key="p1p" x={200} y={295} w={200} h={80} label="producer" size={34} tone="hot" at={tF+0.1} dur={d}/>);
    out.push(Buf("p1b",d,tF+0.1,650,295,86,80,14,5));
    out.push(XM("p1x",d,350,295,50,r("room")));
    out.push(<Label key="p1w" text="must wait" x={200} y={346} w={260} size={34} color={C.coral} at={r("producer must")} dur={d}/>);
    // 2 · empty buffer: consumer must wait
    out.push(...pan("p2",410,tE,"2 · EMPTY buffer"));
    out.push(<Box key="p2c" x={880} y={545} w={200} h={80} label="consumer" size={34} tone="b" at={tE+0.1} dur={d}/>);
    out.push(Buf("p2b",d,tE+0.1,430,545,86,80,14,0));
    out.push(XM("p2x",d,730,545,50,r("nothing")));
    out.push(<Label key="p2w" text="must wait" x={880} y={596} w={260} size={34} color={C.coral} at={r("consumer must")} dur={d}/>);
    // 3 · both at once
    out.push(...pan("p3",660,tB,"3 · BOTH AT ONCE"));
    out.push(<Box key="p3p" x={200} y={795} w={200} h={80} label="producer" size={34} tone="hot" at={tB+0.1} dur={d}/>);
    out.push(<Box key="p3c" x={880} y={795} w={200} h={80} label="consumer" size={34} tone="b" at={tB+0.1} dur={d}/>);
    out.push(Buf("p3b",d,tB+0.1,540,795,62,70,12,2));
    out.push(AR("p3a",d,r("change"),308,795,366,795,C.coral,{w:6}));
    out.push(AR("p3d",d,r("change"),772,795,714,795,C.cobalt,{w:6}));
    out.push(<Label key="p3q" text="count = ?" x={540} y={840} w={300} size={34} font={C.fMono} color={C.coral} at={tC} dur={d}/>);
    // recall: race condition (os-q01)
    out.push(Recall("rc",d,tRc,undefined,60,930,960,200,"from Q1",[
      T("race condition",290,951,560,34,C.coral,{align:"left",font:C.fBody}),
      R(90,1020,250,80,{r:12,fill:C.chip,stroke:C.navy,sw:4}),T("counter = 5",90,1041,250,34,C.navy),
      ...arrowK(348,1060,392,1060,C.navy,5,null,16),
      R(400,1020,290,80,{r:12,fill:C.chip,stroke:C.navy,sw:4}),T("both write 6",400,1041,290,34,C.navy),
      ...arrowK(698,1060,742,1060,C.navy,5,null,16),
      R(750,1020,230,80,{r:12,fill:C.coral,stroke:C.navy,sw:3}),T("6, not 7",750,1041,230,34,C.ink)]));
    return out;
  },{cam:CAM(1.0),hold:"The race condition",holdY:960}),

  // ===== 3 · semaphore: a protected counter with wait and signal =====
  S("The fix uses",(r,d)=>{
    const tSem=r("semaphores"), tCnt=r("counters"), tPro=r("protects"), tW=r("Wait takes"), tAw=r("away"), tSl=r("sleeps"), tS=r("Signal"), tBk=r("back"), tWk=r("wakes");
    const out=[];
    out.push(<Head key="h" text="SEMAPHORE" y={150} size={100} at={tSem} dur={d}/>);
    out.push(<Label key="cl" text="a counter the OS protects" x={540} y={275} w={960} size={38} at={tCnt} dur={d}/>);
    out.push(...Val("v",d,540,440,260,190,"S",[[1,tCnt,tAw],[0,tAw,tBk],[1,tBk,undefined]],{size:64}));
    out.push(<Ico key="sh" ctx={ctx} name="shield" x={790} y={440} size={110} color={C.cobalt} at={tPro} dur={d}/>);
    out.push(<Box key="wb" x={290} y={700} w={320} h={110} label="wait()" size={46} tone="hot" at={tW} dur={d}/>);
    out.push(<Box key="sb" x={790} y={700} w={320} h={110} label="signal()" size={46} tone="b" at={tS} dur={d}/>);
    out.push(AR("wa",d,tW+0.2,340,640,420,560,C.coral));
    out.push(AR("sa",d,tS+0.2,740,640,660,560,C.cobalt));
    out.push(<Label key="w1" text="takes one away (−1)" x={290} y={785} w={460} size={34} at={tAw} dur={d}/>);
    out.push(<Label key="w2" text="sleeps if it's 0" x={290} y={835} w={460} size={34} color={C.coral} at={tSl} dur={d}/>);
    out.push(<Label key="s1" text="adds one back (+1)" x={790} y={785} w={460} size={34} at={tBk} dur={d}/>);
    out.push(<Label key="s2" text="wakes a sleeper" x={790} y={835} w={460} size={34} color={C.cobalt} at={tWk} dur={d}/>);
    // a process that waits at 0 and sleeps, then is woken
    out.push(<Box key="pp" x={290} y={1010} w={220} h={90} label="process" size={36} at={tSl} dur={d}/>);
    out.push(<Ico key="zz" ctx={ctx} name="moon" x={460} y={1010} size={80} color={C.coral} at={tSl+0.3} out={tWk} dur={d}/>);
    out.push(<Label key="zl" text="waits at 0: asleep" x={290} y={1070} w={440} size={34} font={C.fMono} color={C.coral} at={tSl+0.3} out={tWk} dur={d}/>);
    out.push(<Ico key="wk" ctx={ctx} name="sun" x={460} y={1010} size={80} color={C.cobalt} at={tWk} dur={d}/>);
    out.push(<Label key="wl" text="woken" x={290} y={1070} w={260} size={34} font={C.fMono} color={C.cobalt} at={tWk} dur={d}/>);
    out.push(AR("sw",d,tWk,620,700,400,970,C.cobalt,{dash:[12,10],w:5}));
    return out;
  },{cam:CAM(1.0)}),

  // ===== 4 · three semaphores above the buffer =====
  S("We use three",(r,d)=>{
    const tE=r("Empty counts"), tFs=r("free slots"), t5=r("five"), tF=r("Full counts"), tFl=r("filled"), t0=r("zero"), tM=r("And mutex"), tLk=r("lock you"), tOne=r("One process"), t1=r("at one");
    const out=[];
    out.push(<Label key="h" text="three semaphores" x={540} y={150} w={960} size={44} color={C.cobalt} at={0.05} dur={d}/>);
    out.push(<Box key="e0" x={200} y={290} w={290} h={110} label="empty" size={44} at={tE} out={t5} dur={d}/>);
    out.push(<Box key="e1" x={200} y={290} w={290} h={110} label="empty = 5" size={44} tone="hot" at={t5} dur={d}/>);
    out.push(<Box key="f0" x={540} y={290} w={290} h={110} label="full" size={44} at={tF} out={t0} dur={d}/>);
    out.push(<Box key="f1" x={540} y={290} w={290} h={110} label="full = 0" size={44} tone="hot" at={t0} dur={d}/>);
    out.push(<Box key="m0" x={880} y={290} w={290} h={110} label="mutex" size={44} at={tM} out={t1} dur={d}/>);
    out.push(<Box key="m1" x={880} y={290} w={290} h={110} label="mutex = 1" size={44} tone="hot" at={t1} dur={d}/>);
    out.push(<Label key="el" text="free slots" x={200} y={370} w={320} size={34} at={tFs} dur={d}/>);
    out.push(<Label key="fl" text="filled slots" x={540} y={370} w={320} size={34} at={tFl} dur={d}/>);
    out.push(<Label key="ml" text="one at a time" x={880} y={370} w={320} size={34} at={tOne} dur={d}/>);
    out.push(Buf("b",d,0.1,540,560,150,110,20,0,{nums:true}));
    out.push(<Label key="bl" text="buffer: 5 free, 0 filled" x={540} y={635} w={960} size={36} font={C.fMono} at={tFl} dur={d}/>);
    out.push(<Layer key="hl" at={tFs} out={tF} dur={d} sfx="ping">{R(60,490,960,140,{r:14,stroke:C.cobalt,sw:6})}</Layer>);
    // recall: mutex (os-q01)
    out.push(Recall("rc",d,tLk,undefined,190,760,700,330,"from Q1",[
      T("mutex = a lock",420,771,440,34,C.coral,{align:"left",font:C.fBody}),
      ctx.icon("lock",{x:250,y:850,size:90,color:C.coral,strokeWidth:2.2}),
      R(380,850,300,200,{r:14,fill:C.chip,stroke:C.cobalt,sw:4}),T("shared data",380,860,300,30+4,C.cobalt),
      R(430,930,200,90,{r:12,fill:C.coral,stroke:C.navy,sw:3}),T("proc A",430,954,200,36,C.ink),
      T("locked by A",700,930,180,34,C.coral,{align:"left"})]));
    return out;
  },{cam:CAM(1.0),hold:"One process",holdY:960}),

  // ===== 5 · producer steps, then the consumer's mirror steps =====
  S("The producer waits",(r,d)=>{
    const tP=0.1, tWE=r("empty"), tWM=r("waits on mutex"), tMx=r("mutex to"), tPut=r("puts"), tIt=r("item"), tSM=r("signals mutex"), tMf=r("mutex and full"), tFu=r("full");
    const tC=r("The consumer"), tMir=r("mirror"), tWF=r("Wait on full"), tFa=r("full and"), tAm=r("and mutex"), tTk=r("take the"), tSg=r("signal mutex and empty"), tMe=r("mutex and empty"), tAe=r("and empty");
    const mx1=tMx+0.0, out=[];
    out.push(...Val("e",d,200,230,290,100,"empty",[[5,0.05,tWE+0.2],[4,tWE+0.2,tAe+0.25],[5,tAe+0.25,undefined]]));
    out.push(...Val("f",d,540,230,290,100,"full",[[0,0.1,tFu+0.1],[1,tFu+0.1,tFa+0.1],[0,tFa+0.1,undefined]]));
    out.push(...Val("m",d,880,230,290,100,"mutex",[[1,0.15,mx1+0.2],[0,mx1+0.2,tMf+0.2],[1,tMf+0.2,tAm+0.25],[0,tAm+0.25,tMe+0.25],[1,tMe+0.25,undefined]]));
    out.push(Buf("b",d,0.2,540,420,150,100,20,0));
    out.push(<Box key="it" x={540-2*170} y={420} w={120} h={74} label="item" size={34} tone="hot" at={tIt} out={tTk+0.45} dur={d}/>);
    out.push(<Label key="ph" text="producer" x={290} y={520} w={440} size={44} font={C.fHead} color={C.coral} at={tP} dur={d}/>);
    out.push(<Label key="ch" text="consumer" x={790} y={520} w={440} size={44} font={C.fHead} color={C.cobalt} at={tC} dur={d}/>);
    const P=[["wait(empty)",tWE-0.6],["wait(mutex)",tWM],["put item",tPut],["signal(mutex)",tSM],["signal(full)",tFu]];
    const Cn=[["wait(full)",tWF],["wait(mutex)",tAm],["take item",tTk],["signal(mutex)",tSg],["signal(empty)",tAe]];
    const RY=i=>640+i*96;
    P.forEach(([s,t],i)=>{ out.push(<Box key={"pg"+i} x={290} y={RY(i)} w={440} h={80} label={s} size={36} tone="ghost" at={tP+0.2+i*0.1} dur={d}/>);
      out.push(<Box key={"ph"+i} x={290} y={RY(i)} w={440} h={80} label={s} size={36} tone="hot" at={t} dur={d}/>); });
    Cn.forEach(([s,t],i)=>{ out.push(<Box key={"cg"+i} x={790} y={RY(i)} w={440} h={80} label={s} size={36} tone="ghost" at={tC+0.2+i*0.1} dur={d}/>);
      out.push(<Box key={"chh"+i} x={790} y={RY(i)} w={440} h={80} label={s} size={36} tone="b" at={t} dur={d}/>); });
    out.push(<Label key="mi" text="mirror image" x={790} y={1130} w={440} size={36} color={C.cobalt} at={tMir} dur={d}/>);
    out.push(<Label key="pa" text="reserve a slot, then lock" x={290} y={1130} w={480} size={34} at={tFu+0.3} dur={d}/>);
    return out;
  },{cam:CAM(1.0),hold:"The consumer does",holdY:960}),

  // ===== 6 · the trap: waits swapped, producer asleep holding mutex =====
  S("One trap",(r,d)=>{
    const tIf=r("If the"), tLk=r("locks mutex"), tCh=r("checking"), tSl=r("sleep"), tHo=r("holding"), tNb=r("nobody"), tDl=r("That's a deadlock");
    const out=[];
    out.push(<Box key="e" x={300} y={200} w={340} h={100} label="empty = 0" size={40} tone="hot" at={0.05} dur={d}/>);
    out.push(...Val("m",d,780,200,340,100,"mutex",[[1,0.1,tLk+0.4],[0,tLk+0.4,undefined]]));
    out.push(Buf("b",d,0.15,540,370,120,90,16,5));
    out.push(<Label key="bf" text="buffer full" x={540} y={425} w={400} size={34} font={C.fMono} color={C.coral} at={0.3} dur={d}/>);
    out.push(<Box key="P" x={300} y={600} w={240} h={100} label="producer" size={38} tone="hot" at={0.2} dur={d}/>);
    out.push(<Box key="C" x={800} y={600} w={240} h={100} label="consumer" size={38} tone="b" at={0.25} dur={d}/>);
    // the two waits swap places
    const sw=(k,s,y0,y1)=><Mover key={k} at={0.3} dur={d} cw={380} ch={80} pts={[{t:0.3,x:300,y:y0},{t:tIf,x:300,y:y0},{t:tIf+0.6,x:300,y:y1}]}>{chip(380,80,s,C.chip,36,C.navy)}</Mover>;
    out.push(sw("a","wait(empty)",740,835), sw("b2","wait(mutex)",835,740));
    out.push(<Label key="wr" text="swapped: lock first" x={300} y={895} w={480} size={34} color={C.coral} at={tIf+0.6} dur={d}/>);
    out.push(<Ico key="lk" ctx={ctx} name="lock" x={105} y={570} size={60} color={C.coral} at={tLk+0.3} dur={d}/>);
    out.push(<Ico key="zz" ctx={ctx} name="moon" x={105} y={645} size={60} color={C.coral} at={tSl} dur={d}/>);
    out.push(<Label key="as" text="asleep, holding mutex" x={300} y={945} w={500} size={34} color={C.coral} at={tHo} dur={d}/>);
    out.push(<Box key="cw" x={800} y={740} w={340} h={80} label="wait(mutex)" size={36} tone="b" at={tNb-0.3} dur={d}/>);
    out.push(XM("cx",d,1004,740,46,tNb));
    out.push(<Label key="nb" text="nobody gets in" x={800} y={800} w={400} size={34} color={C.coral} at={tNb} dur={d}/>);
    // each waits for the other
    out.push(AR("c1",d,tDl,428,575,672,575,C.coral,{w:6}));
    out.push(AR("c2",d,tDl+0.15,672,628,428,628,C.cobalt,{w:6}));
    out.push(<Label key="c1l" text="slot?" x={550} y={512} w={140} size={34} font={C.fMono} color={C.coral} at={tDl} dur={d}/>);
    out.push(<Label key="c2l" text="mutex?" x={550} y={642} w={160} size={34} font={C.fMono} color={C.cobalt} at={tDl+0.15} dur={d}/>);
    out.push(<Head key="dh" text="DEADLOCK" y={1010} size={110} at={tDl+0.2} dur={d}/>);
    // recall: deadlock circle (os-q01)
    const cx=540, cy=1330, Pp=[[cx,cy-110],[cx+150,cy],[cx,cy+110],[cx-150,cy]];
    out.push(Recall("rc",d,tDl+0.4,undefined,250,1165,580,390,"from Q1",[
      ...Pp.map((p,i)=>[R(p[0]-45,p[1]-28,90,56,{r:10,fill:C.chip,stroke:C.navy,sw:3}),T("P"+(i+1),p[0]-45,p[1]-20,90,34,C.navy)]),
      ...Pp.map((p,i)=>{ const q=Pp[(i+1)%4], ax=p[0]+(q[0]-p[0])*0.38, ay=p[1]+(q[1]-p[1])*0.38+(i%2?0:0), bx=p[0]+(q[0]-p[0])*0.66, by=p[1]+(q[1]-p[1])*0.66;
        return arrowK(ax,ay,bx,by,C.coral,5,null,16); })]));
    return out;
  },{cam:CAM(1.0),cut:"punch"}),

  // ===== 7-9 · answer cards =====
  ...ans.map((pg,k)=>{ const at=tEx+k*dd;
    const s=S("In your exam",(r,d)=>{ globalThis.__T0=at; return AnswerCard({ page: pg, title: "WRITE THIS · 5 MARKS · "+(k+1)+"/"+ans.length, at: 0, dur: d, y: TOP + 24 }); },{cam:[{t:0,x:540,y:960,z:1.0},{t:1,x:540,y:960,z:1.0}]});
    return {...s, at}; }),
  ];
};
