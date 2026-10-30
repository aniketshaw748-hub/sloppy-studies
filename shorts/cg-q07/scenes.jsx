// cg-q07 v3 · Parametric vs geometric continuity. Two pieces of y = (x − 1)² + 1 joined at J(1, 1).
//   P1(t) = (t, (t−1)²+1), P2(t) = (1+t, t²+1): P1′(1) = P2′(0) = (1, 0), P1″ = P2″ = (0, 2)  -> C1, C2
//   re-timed piece 2 (twice as fast, P2(2t)): its velocity at J = (2, 0) = 2·P1′(1)  -> G1 only (same shape)
import { Box, Arrow, Label, Ring, Check, XMark, Ico, Layer, bb, ev } from "./prims.jsx";
import { Sketch } from "./sketch.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
import { C } from "./theme.jsx";
const W=1080,H=1920;
let KK=0; const K=()=>"k"+(KK++);
const poly=pts=>pts.map((p,i)=>(i?"L ":"M ")+p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" ");
const rng=(a,b,n)=>Array.from({length:n+1},(_,i)=>a+(b-a)*i/n);
const STATIC=[{t:0,x:540,y:960,z:1},{t:0.5,x:540,y:960,z:1}];
const f=x=>(x-1)*(x-1)+1;
const P1=t=>[t,f(t)], P2=t=>[1+t,f(1+t)], Q2=t=>{const x=1+2*t-t*t; return [x,f(x)];};

const Stroke=({d,at=0,end,w=7,col,dash,fill,op=1})=> <frame key={K()} at={at} duration={Math.max(0.2,end-at)} width={W} height={H} layout="none" animate={[{property:"opacity",from:0,to:op,at:0,duration:0.2}]}>
  <path d={d} x={0} y={0} width={W} height={H} stroke={w?{width:w,color:col,cap:"round"}:undefined} dash={dash} fill={fill}/></frame>;
const Draw=({pts,at,len,end,w=9,col,skip=false,sfx="draw"})=>{ ev(at,sfx); const n=pts.length-1, out=[];
  for(let i=0;i<n;i++){ if(skip&&i%2) continue; const a=at+len*i/n; const p=pts[i], q=pts[i+1];
    out.push(<frame key={K()} at={a} duration={Math.max(0.05,end-a)} width={W} height={H} layout="none"><path d={`M ${p[0].toFixed(1)} ${p[1].toFixed(1)} L ${q[0].toFixed(1)} ${q[1].toFixed(1)}`} x={0} y={0} width={W} height={H} stroke={{width:w,color:col,cap:"round"}}/></frame>); }
  return out; };
const vec=(x1,y1,x2,y2,col,w=8)=>{ const a=Math.atan2(y2-y1,x2-x1), L=w*3.6, sx=x2-L*0.6*Math.cos(a), sy=y2-L*0.6*Math.sin(a);
  return [<path key={K()} d={`M ${x1} ${y1} L ${sx} ${sy}`} x={0} y={0} width={W} height={H} stroke={{width:w,color:col,cap:"round"}}/>,
          <path key={K()} d={`M ${x2} ${y2} L ${x2-L*Math.cos(a-0.42)} ${y2-L*Math.sin(a-0.42)} L ${x2-L*Math.cos(a+0.42)} ${y2-L*Math.sin(a+0.42)} Z`} x={0} y={0} width={W} height={H} fill={col}/>]; };
const Vec=({x1,y1,x2,y2,col,w=8,at,end,sfx="swish"})=>{ ev(at,sfx); return <frame key={K()} at={at} duration={Math.max(0.2,end-at)} width={W} height={H} layout="none" animate={[{property:"opacity",from:0,to:1,at:0,duration:0.2}]}>{vec(x1,y1,x2,y2,col,w)}</frame>; };
// a point moving through keyframes (scene-relative t), linear between dense samples
function Dot({pts,at,end,size=34,col,children,name="point"}){
  bb({k:"mover",n:name,path:pts.map(p=>({t:p.t,x:p.x-size/2,y:p.y-size/2})),w:size,h:size,t0:at,t1:end}); ev(at,"move");
  return <frame key={K()} at={at} duration={Math.max(0.2,end-at)} width={W} height={H} layout="none" animate={[{property:"opacity",from:0,to:1,at:0,duration:0.12}]}>
    <group x={0} y={0} width={size} height={size}
      animate={[{property:"offsetX",keyframes:pts.map(p=>({at:Math.max(0,p.t-at),value:p.x-size/2})),easing:"linear"},
                {property:"offsetY",keyframes:pts.map(p=>({at:Math.max(0,p.t-at),value:p.y-size/2})),easing:"linear"}]}>
      {(children&&[].concat(children).length)?children:<rect x={0} y={0} width={size} height={size} radius={size/2} fill={col} strokeColor={C.navy} strokeWidth={4}/>}
    </group></frame>;
}
const dotAt=(x,y,r,col,at,end)=> <Layer key={K()} at={at} dur={end} sfx="pop"><rect x={x-r} y={y-r} width={2*r} height={2*r} radius={r} fill={col} strokeColor={C.navy} strokeWidth={4}/></Layer>;
// true axes with ticks + numbers through one mapping
function Axes({P,d,at=0,x0=-0.2,x1=2.6,y0=-0.2,y1=2.2,xt=[1,2],yt=[1,2],fs=30}){
  const n=[]; const [ox,oy]=P(0,0);
  n.push(...Sketch({items:[{line:[...P(x0,0),...P(x1,0)],arrow:true},{line:[...P(0,y0),...P(0,y1)],arrow:true}],at,dur:d,speed:4200,together:true}));
  const tk=[]; xt.forEach(v=>{const [x,y]=P(v,0); tk.push(`M ${x} ${y-8} L ${x} ${y+8}`);}); yt.forEach(v=>{const [x,y]=P(0,v); tk.push(`M ${x-8} ${y} L ${x+8} ${y}`);});
  n.push(<Layer key={K()} at={at+0.15} dur={d}><path d={tk.join(" ")} x={0} y={0} width={W} height={H} stroke={{width:4,color:C.navy,cap:"round"}}/></Layer>);
  xt.forEach(v=>n.push(<Label key={K()} text={String(v)} x={P(v,0)[0]} y={oy+14} w={60} size={fs} font={C.fMono} at={at+0.2} dur={d}/>));
  yt.forEach(v=>n.push(<Label key={K()} text={String(v)} x={ox-30} y={P(0,v)[1]-19} w={50} size={fs} font={C.fMono} at={at+0.2} dur={d}/>));
  n.push(<Label key={K()} text="x" x={P(x1,0)[0]+6} y={oy+12} w={50} size={34} font={C.fMono} at={at+0.25} dur={d}/>);
  n.push(<Label key={K()} text="y" x={ox+34} y={P(0,y1)[1]-14} w={50} size={34} font={C.fMono} at={at+0.25} dur={d}/>);
  return n;
}
// main figure mapping: 1 unit = 280 px, origin (150, 900)
const U=280, OX=150, OY=900; const P=(x,y)=>[OX+U*x, OY-U*y];
const [JX,JY]=P(1,1);
const cpts=(F,M=P,n=40)=>rng(0,1,n).map(t=>M(...F(t)));
const L=(text,y,at,d,o={})=> <Label key={K()} text={text} x={o.x??540} y={y} w={o.w??980} size={o.size??38} font={o.font??C.fBody} color={o.color} align={o.align} at={at} dur={d}/>;
const Fig=(d,at=0)=>[...Axes({P,d,at}), ...Draw({pts:cpts(P1),at:at+0.1,len:0.4,end:d,col:C.cobalt}), ...Draw({pts:cpts(P2),at:at+0.5,len:0.4,end:d,col:C.coral}), dotAt(JX,JY,13,C.navy,at+0.9,d)];
// the point running along piece 1 then piece 2 (uniform in t on each piece)
const run=(at,T,end,k=1)=>{ const pts=[...rng(0,1,30).map(t=>{const [x,y]=P(...P1(t)); return {t:at+T*t,x,y};}), ...rng(0,1,30).slice(1).map(t=>{const [x,y]=P(...P2(t)); return {t:at+T*(1+t/k),x,y};})];
  return <Dot pts={pts} at={at} end={end} size={34} col={C.navy}/>; };
const AR=200; // velocity arrows: 1 unit of speed = 200 px

export const SCENES = ({ S, cue, D, ctx, C, TOP }) => {
  const At=(t,draw,o={})=>({...S(null,draw,o), at:t, draw:d=>{ globalThis.__T0=t; globalThis.__SKEND=0; return draw(x=>x||0,d); }});
  const tExam=cue("In your exam"), half=(D-tExam)/2;
  return [
  // ---- Question + from zero: two pieces joined at J, a point moving with t ----
  S(null, (r, d) => {
    const n=[...Fig(d,0.1)];
    const tBu=r("built"), tPc=r("pieces"), tPar=r("parameter"), tJL=r("just like"), tLB=r("Liang"), tInc=r("As T"), tMv=r("point moves"), tCo=r("Continuity describes");
    n.push(<Label key={K()} text="piece 1" x={P(0.42,0)[0]} y={740} w={200} size={36} color={C.cobalt} at={tPc} dur={d}/>);
    n.push(<Label key={K()} text="piece 2" x={P(1.58,0)[0]} y={740} w={200} size={36} color={C.coral} at={tPc+0.2} dur={d}/>);
    n.push(<Ring key={K()} x={JX} y={JY} r={40} at={tPc+0.4} dur={d}/>);
    n.push(<Label key={K()} text="joint J" x={JX} y={672} w={200} size={34} at={tPc+0.5} dur={d}/>);
    n.push(L("a curve = pieces joined end to end",960,tBu,d,{size:40}));
    n.push(L("each piece is drawn with a parameter t",1025,tPar,d));
    // recall: Liang–Barsky's u moving a point along a line
    bb({k:"srect",n:"recall Q6",x:200,y:1090,w:680,h:210,t0:tJL,t1:d});
    n.push(<Layer key={K()} at={tJL} dur={d} sfx="pop"><rect x={200} y={1090} width={680} height={210} radius={14} fill={C.paper} strokeColor={C.cobalt} strokeWidth={4} dash={[14,10]}/></Layer>);
    n.push(<Label key={K()} text="from Q6 · Liang–Barsky" x={224} y={1104} w={640} size={34} align="left" color={C.cobalt} at={tJL+0.1} dur={d}/>);
    n.push(<Stroke d="M 300 1210 L 780 1210" at={tLB} end={d} w={6} col={C.navy}/>);
    n.push(dotAt(300,1210,8,C.navy,tLB,d), dotAt(780,1210,8,C.navy,tLB,d));
    n.push(<Label key={K()} text="u = 0" x={300} y={1236} w={160} size={34} font={C.fMono} at={tLB+0.1} dur={d}/>);
    n.push(<Label key={K()} text="u = 1" x={780} y={1236} w={160} size={34} font={C.fMono} at={tLB+0.2} dur={d}/>);
    n.push(<Dot pts={[{t:tLB+0.3,x:300,y:1210},{t:tLB+1.6,x:780,y:1210}]} at={tLB+0.3} end={d} size={30} col={C.coral} name="u point"/>);
    // t moves the point along the curve
    n.push(run(tInc+0.1,1.4,d));
    n.push(L("as t goes 0 → 1, the point moves",1330,tMv,d,{size:38}));
    n.push(<Ring key={K()} x={JX} y={JY} r={46} at={tCo} dur={d}/>);
    n.push(L("continuity = how smoothly\ntwo pieces join",1410,tCo+0.3,d,{size:42,color:C.coral}));
    return n;
  }, { cam: STATIC }),

  // ---- C: parametric continuity ----
  S("Parametric continuity", (r, d) => {
    const n=[...Fig(d,0)];
    const tCm=r("compares"), tC0=r("C0"), tC1=r("C1"), tDir=r("direction"), tSp=r("speed"), tEx=r("exactly"), tC2=r("C2"), tAcc=r("acceleration");
    n.push(L("C = parametric continuity",960,0.3,d,{size:46,color:C.coral}));
    n.push(L("compares the formulas",1028,tCm,d));
    n.push(L("P₁(t) = (t, (t − 1)² + 1)",1085,tCm+0.5,d,{font:C.fMono,size:34,color:C.cobalt}));
    n.push(L("P₂(t) = (1 + t, t² + 1)",1135,tCm+0.8,d,{font:C.fMono,size:34,color:C.coral}));
    n.push(<Ring key={K()} x={JX} y={JY} r={40} at={tC0} dur={d}/>);
    n.push(L("C⁰ · meet: P₁(1) = P₂(0) = (1, 1)",1205,tC0+0.3,d,{font:C.fMono,size:34}));
    n.push(run(tC1+0.1,1.2,d));
    n.push(<Vec x1={JX-AR} y1={JY} x2={JX} y2={JY} col={C.cobalt} at={tDir} end={d}/>);
    n.push(<Vec x1={JX} y1={JY} x2={JX+AR} y2={JY} col={C.coral} at={tDir+0.2} end={d}/>);
    n.push(<Label key={K()} text="speed 1" x={JX-AR/2} y={672} w={180} size={32} font={C.fMono} color={C.cobalt} at={tSp} dur={d}/>);
    n.push(<Label key={K()} text="speed 1" x={JX+AR/2+10} y={672} w={180} size={32} font={C.fMono} color={C.coral} at={tSp+0.2} dur={d}/>);
    n.push(L("C¹ · same direction AND speed at J",1275,tEx,d));
    n.push(L("P₁′(1) = P₂′(0) = (1, 0)",1332,tEx+0.4,d,{font:C.fMono,size:34}));
    n.push(<Vec x1={JX-12} y1={JY} x2={JX-12} y2={JY-120} col={C.cobalt} w={7} at={tAcc} end={d}/>);
    n.push(<Vec x1={JX+12} y1={JY} x2={JX+12} y2={JY-120} col={C.coral} w={7} at={tAcc+0.15} end={d}/>);
    n.push(L("C² · acceleration matches too",1405,tAcc+0.3,d));
    n.push(L("P₁″(1) = P₂″(0) = (0, 2)",1462,tAcc+0.7,d,{font:C.fMono,size:34}));
    return n;
  }, { cam: STATIC }),

  // ---- G: geometric continuity ----
  S("Geometric continuity", (r, d) => {
    const n=[...Fig(d,0)];
    const tSh=r("shape"), tG0=r("G0"), tG1=r("G1"), tDir=r("direction"), tSp=r("speed"), tDif=r("differ"), tBend=r("bend"), tCur=r("curvature");
    n.push(L("G = geometric continuity",960,0.3,d,{size:46,color:C.coral}));
    n.push(L("compares only the shape",1028,tSh,d));
    n.push(<Ring key={K()} x={JX} y={JY} r={40} at={tG0} dur={d}/>);
    n.push(L("G⁰ · they meet at J",1098,tG0+0.4,d));
    n.push(run(tG1+0.1,1.4,d,2));
    n.push(<Vec x1={JX-AR} y1={JY} x2={JX} y2={JY} col={C.cobalt} at={tDir} end={d}/>);
    n.push(<Vec x1={JX} y1={JY} x2={JX+2*AR} y2={JY} col={C.coral} at={tDir+0.2} end={d}/>);
    n.push(<Label key={K()} text="speed 1" x={JX-AR/2} y={672} w={180} size={32} font={C.fMono} color={C.cobalt} at={tSp} dur={d}/>);
    n.push(<Label key={K()} text="speed 2" x={JX+AR} y={672} w={180} size={32} font={C.fMono} color={C.coral} at={tSp+0.2} dur={d}/>);
    n.push(L("G¹ · same direction, speed can differ",1168,tDif,d));
    n.push(L("piece 2 twice as fast: P₂′(0) = 2 · P₁′(1)",1225,tDif+0.4,d,{font:C.fMono,size:32}));
    // bend circle at J: centre (1, 1.5), radius 1/2 -> curvature 2 on both pieces
    const [cx,cy]=P(1,1.5), R=U/2;
    n.push(...Draw({pts:rng(0,2*Math.PI,48).map(a=>[cx+R*Math.cos(a+Math.PI/2),cy+R*Math.sin(a+Math.PI/2)]),at:tBend,len:0.7,end:d,w:5,col:C.navy,skip:true}));
    n.push(dotAt(cx,cy,7,C.navy,tBend+0.7,d));
    n.push(...Draw({pts:rng(0.55,1,12).map(t=>P(...P1(t))),at:tCur,len:0.3,end:d,w:16,col:C.cobalt}));
    n.push(...Draw({pts:rng(0,0.45,12).map(t=>P(...P2(t))),at:tCur+0.3,len:0.3,end:d,w:16,col:C.coral}));
    n.push(L("G² · same bend (curvature) at J",1305,tCur,d));
    n.push(L("κ = 2 on both sides",1362,tCur+0.4,d,{font:C.fMono,size:34}));
    return n;
  }, { cam: STATIC, n: 2 }),

  // ---- C is stricter ----
  S("So C is stricter", (r, d) => {
    const n=[]; const tAny=r("Anything"), tAls=r("also G1"), tNot=r("not the other");
    n.push(L("C is stricter",TOP+30,0.05,d,{size:56,color:C.coral}));
    bb({k:"soval",n:"G1 set",x:100,y:420,w:880,h:480,t0:0.2,t1:d});
    n.push(<Layer key={K()} at={0.2} dur={d} sfx="pop"><rect x={100} y={420} width={880} height={480} radius={240} fill={C.coral+"18"} strokeColor={C.coral} strokeWidth={5}/></Layer>);
    n.push(<Label key={K()} text="all G¹ joints" x={540} y={452} w={500} size={38} color={C.coral} at={0.3} dur={d}/>);
    bb({k:"soval",n:"C1 set",x:290,y:560,w:500,h:290,t0:0.5,t1:d});
    n.push(<Layer key={K()} at={0.5} dur={d} sfx="pop"><rect x={290} y={560} width={500} height={290} radius={145} fill={C.cobalt+"22"} strokeColor={C.cobalt} strokeWidth={5}/></Layer>);
    n.push(<Label key={K()} text="C¹ joints" x={540} y={592} w={300} size={38} color={C.cobalt} at={0.6} dur={d}/>);
    // inside C1: equal arrows
    n.push(<Vec x1={420} y1={720} x2={540} y2={720} col={C.cobalt} w={7} at={0.8} end={d}/>);
    n.push(<Vec x1={540} y1={720} x2={660} y2={720} col={C.coral} w={7} at={0.9} end={d}/>);
    n.push(dotAt(540,720,9,C.navy,0.9,d));
    // rows
    n.push(<Label key={K()} text="C¹ ⇒ G¹" x={250} y={990} w={340} size={52} font={C.fMono} at={tAny} dur={d}/>);
    n.push(<Vec x1={600} y1={1022} x2={720} y2={1022} col={C.cobalt} w={7} at={tAny+0.3} end={d}/>);
    n.push(<Vec x1={720} y1={1022} x2={840} y2={1022} col={C.coral} w={7} at={tAny+0.4} end={d}/>);
    n.push(<Check key={K()} x={960} y={1020} size={80} at={tAls} dur={d}/>);
    n.push(L("equal arrows: C¹, so also G¹",1080,tAls+0.2,d,{size:36,color:C.cobalt}));
    n.push(<Label key={K()} text="G¹ ⇒ C¹" x={250} y={1200} w={340} size={52} font={C.fMono} at={tNot} dur={d}/>);
    n.push(<Vec x1={560} y1={1232} x2={660} y2={1232} col={C.cobalt} w={7} at={tNot+0.2} end={d}/>);
    n.push(<Vec x1={660} y1={1232} x2={860} y2={1232} col={C.coral} w={7} at={tNot+0.3} end={d}/>);
    n.push(<XMark key={K()} x={960} y={1230} size={70} at={tNot+0.5} dur={d}/>);
    n.push(L("lengths differ: G¹ but not C¹",1290,tNot+0.6,d,{size:36,color:C.coral}));
    return n;
  }, { cam: STATIC }),

  // ---- when G ----
  S("An engineer chooses", (r, d) => {
    const n=[]; const tSM=r("shape matters"), tCar=r("Car"), tPr=r("product"), tFo=r("font"), tJo=r("joining"), tDL=r("different lengths"), tSm=r("smooth to"), tFr=r("freedom");
    n.push(L("Choose G",TOP+24,0.05,d,{size:56,color:C.coral}));
    n.push(L("when only the shape matters",TOP+100,r("when"),d,{size:42}));
    // car body (smooth panels joined)
    const ch=(pts,it=3)=>{let p=pts; for(let k=0;k<it;k++){const q=[]; for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length]; q.push([.75*a[0]+.25*b[0],.75*a[1]+.25*b[1]],[.25*a[0]+.75*b[0],.25*a[1]+.75*b[1]]);} p=q;} return p;};
    const tf=([x,y])=>[540+(x-540)*0.78, 470+(y-580)*0.78];
    const body=ch([[100,880],[95,770],[140,722],[270,700],[405,598],[520,582],[625,596],[765,718],[905,748],[975,778],[990,830],[985,880]]).map(tf);
    const win=ch([[292,705],[415,618],[610,615],[705,705]],2).map(tf);
    bb({k:"box",n:"car body",x:190,y:466,w:700,h:290,t0:tCar,t1:d});
    n.push(<Layer key={K()} at={tCar} dur={d} sfx="pop">
      <path d={poly(body)+" Z"} x={0} y={0} width={W} height={H} fill={C.chip} stroke={{width:6,color:C.navy}}/>
      <path d={poly(win)+" Z"} x={0} y={0} width={W} height={H} fill={C.paper} stroke={{width:5,color:C.navy}}/>
      {[280,800].map(x=>{const [cx,cy]=tf([x,880]); return <group key={x} x={0} y={0} width={W} height={H}><rect x={cx-48} y={cy-48} width={96} height={96} radius={48} fill={C.navy}/><rect x={cx-19} y={cy-19} width={38} height={38} radius={19} fill={C.chip}/></group>;})}
    </Layer>);
    { const [x1,y1]=tf([430,712]), [x2,y2]=tf([430,874]); n.push(<Stroke d={`M ${x1} ${y1} L ${x2} ${y2}`} at={tCar+0.5} end={d} w={5} col={C.coral} dash={[14,10]}/>); }
    n.push(<Label key={K()} text="car bodies" x={330} y={780} w={360} size={38} at={tCar+0.3} dur={d}/>);
    n.push(<Label key={K()} text="product surfaces" x={760} y={780} w={420} size={38} at={tPr} dur={d}/>);
    // font outline: an S made of two arcs joined at its middle
    const sx=270, sy=930, sr=78;
    const up=rng(-30,-270,30).map(a=>[sx+sr*Math.cos(a*Math.PI/180), sy+sr*Math.sin(a*Math.PI/180)]);
    const lo=rng(-90,150,30).map(a=>[sx+sr*Math.cos(a*Math.PI/180), sy+2*sr+sr*Math.sin(a*Math.PI/180)]);
    bb({k:"box",n:"S outline",x:sx-sr-8,y:sy-sr-8,w:2*sr+16,h:4*sr+16,t0:tFo,t1:d});
    n.push(...Draw({pts:up,at:tFo,len:0.5,end:d,w:12,col:C.cobalt}));
    n.push(...Draw({pts:lo,at:tFo+0.5,len:0.5,end:d,w:12,col:C.coral}));
    n.push(dotAt(sx,sy+sr,10,C.navy,tFo+0.5,d));
    n.push(<Label key={K()} text="font outlines" x={sx} y={1190} w={340} size={38} at={tFo+0.6} dur={d}/>);
    // pieces of different lengths
    const g=x=>1040-80*Math.sin(Math.PI*(x-590)/420);
    n.push(...Draw({pts:rng(590,680,8).map(x=>[x,g(x)]),at:tJo,len:0.3,end:d,w:10,col:C.cobalt}));
    n.push(...Draw({pts:rng(680,1010,30).map(x=>[x,g(x)]),at:tJo+0.3,len:0.8,end:d,w:10,col:C.coral}));
    n.push(dotAt(680,g(680),10,C.navy,tJo+0.3,d));
    n.push(<Label key={K()} text="short + long piece" x={800} y={1100} w={420} size={34} color={C.navy} at={tDL} dur={d}/>);
    n.push(<Label key={K()} text="different lengths" x={800} y={1190} w={420} size={38} at={tDL+0.2} dur={d}/>);
    n.push(<Check key={K()} x={250} y={1330} size={70} at={tSm} dur={d}/>);
    n.push(<Label key={K()} text="smooth to the eye" x={330} y={1305} w={660} size={42} align="left" at={tSm+0.1} dur={d}/>);
    n.push(<Label key={K()} text="more FREEDOM to shape it" x={330} y={1385} w={680} size={42} align="left" color={C.coral} at={tFr} dur={d}/>);
    return n;
  }, { cam: STATIC }),

  // ---- when C ----
  S("They choose C", (r, d) => {
    const n=[]; const tTi=r("time"), tCam=r("camera"), tRob=r("robot"), tSud=r("sudden"), tJo=r("jolt");
    n.push(L("Choose C",TOP+24,0.05,d,{size:56,color:C.cobalt}));
    n.push(L("when the parameter t is TIME",TOP+100,tTi,d,{size:42}));
    // path (same two pieces, smaller) with a camera riding it
    const M=(x,y)=>[150+170*x, 840-170*y];
    n.push(...Draw({pts:cpts(P1,M),at:0.2,len:0.4,end:d,w:8,col:C.cobalt}));
    n.push(...Draw({pts:cpts(P2,M),at:0.6,len:0.4,end:d,w:8,col:C.coral}));
    n.push(dotAt(...M(1,1),10,C.navy,1.0,d));
    n.push(<Label key={K()} text="camera path" x={320} y={860} w={360} size={36} at={tCam+0.3} dur={d}/>);
    const T=1.3; const cp=[...rng(0,1,24).map(t=>{const [x,y]=M(...P1(t)); return {t:tCam+T*t,x,y:y-44};}), ...rng(0,1,24).slice(1).map(t=>{const [x,y]=M(...P2(t)); return {t:tCam+T*(1+t),x,y:y-44};})];
    n.push(<Dot pts={cp} at={tCam} end={d} size={70} name="camera">{ctx.icon("video",{x:0,y:0,size:70,color:C.navy,strokeWidth:2.4})}</Dot>);
    // robot arm: base, two links, gripper
    const bx=830, by=800, j1=[760,640], j2=[930,560];
    bb({k:"box",n:"robot arm",x:720,y:520,w:260,h:320,t0:tRob,t1:d});
    n.push(<Layer key={K()} at={tRob} dur={d} sfx="pop">
      <rect x={bx-80} y={by} width={160} height={40} radius={8} fill={C.navy}/>
      <path d={`M ${bx} ${by} L ${j1[0]} ${j1[1]} L ${j2[0]} ${j2[1]}`} x={0} y={0} width={W} height={H} stroke={{width:22,color:C.cobalt,cap:"round"}}/>
      <path d={`M ${j2[0]} ${j2[1]} L ${j2[0]+30} ${j2[1]-28} M ${j2[0]} ${j2[1]} L ${j2[0]+38} ${j2[1]+14}`} x={0} y={0} width={W} height={H} stroke={{width:10,color:C.navy,cap:"round"}}/>
      {[[bx,by],j1,j2].map((p,i)=><rect key={i} x={p[0]-17} y={p[1]-17} width={34} height={34} radius={17} fill={C.paper} strokeColor={C.navy} strokeWidth={5}/>)}
    </Layer>);
    n.push(<Label key={K()} text="robot arm" x={850} y={860} w={300} size={36} at={tRob+0.2} dur={d}/>);
    // speed against time: C1 smooth, G1 jumps at J
    const X0=200, Y0=1330, UT=320, US=75; const Sp=(t,s)=>[X0+UT*t, Y0-US*s];
    const sC=t=>Math.sqrt(1+4*(t-1)*(t-1));
    const sG=t=>{ if(t<=1) return sC(t); const s=2*(t-1); return 2*Math.sqrt(1+4*s*s); };
    n.push(<Layer key={K()} at={tCam} dur={d} sfx="pop">
      <path d={`M ${X0} ${Y0} L ${X0+UT*2.15} ${Y0} M ${X0} ${Y0} L ${X0} ${Y0-370}`} x={0} y={0} width={W} height={H} stroke={{width:5,color:C.navy,cap:"round"}}/>
      <path d={`M ${X0+UT*2.15+6} ${Y0} L ${X0+UT*2.15-18} ${Y0-11} L ${X0+UT*2.15-18} ${Y0+11} Z M ${X0} ${Y0-376} L ${X0-11} ${Y0-352} L ${X0+11} ${Y0-352} Z`} x={0} y={0} width={W} height={H} fill={C.navy}/>
      <path d={`M ${X0-8} ${Y0-US} L ${X0+8} ${Y0-US} M ${X0-8} ${Y0-2*US} L ${X0+8} ${Y0-2*US} M ${X0-8} ${Y0-3*US} L ${X0+8} ${Y0-3*US} M ${X0-8} ${Y0-4*US} L ${X0+8} ${Y0-4*US} M ${X0+UT} ${Y0+8} L ${X0+UT} ${Y0-8} M ${X0+2*UT} ${Y0+8} L ${X0+2*UT} ${Y0-8}`} x={0} y={0} width={W} height={H} stroke={{width:4,color:C.navy}}/>
      <path d={`M ${X0+UT} ${Y0} L ${X0+UT} ${Y0-340}`} x={0} y={0} width={W} height={H} stroke={{width:3,color:C.navy}} dash={[10,10]}/>
    </Layer>);
    n.push(<Label key={K()} text="speed" x={X0+20} y={Y0-400} w={200} size={34} align="left" font={C.fMono} at={tCam+0.1} dur={d}/>);
    n.push(<Label key={K()} text="1" x={X0-30} y={Y0-US-19} w={40} size={30} font={C.fMono} at={tCam+0.1} dur={d}/>);
    n.push(<Label key={K()} text="2" x={X0-30} y={Y0-2*US-19} w={40} size={30} font={C.fMono} at={tCam+0.1} dur={d}/>);
    n.push(<Label key={K()} text="4" x={X0-30} y={Y0-4*US-19} w={40} size={30} font={C.fMono} at={tCam+0.1} dur={d}/>);
    n.push(<Label key={K()} text="3" x={X0-30} y={Y0-3*US-19} w={40} size={30} font={C.fMono} at={tCam+0.1} dur={d}/>);
    n.push(<Label key={K()} text="J" x={X0+UT} y={Y0+12} w={40} size={32} font={C.fMono} at={tCam+0.1} dur={d}/>);
    n.push(<Label key={K()} text="t" x={X0+UT*2.15+30} y={Y0-22} w={40} size={34} font={C.fMono} at={tCam+0.1} dur={d}/>);
    n.push(...Draw({pts:rng(0,2,40).map(t=>Sp(t,sC(t))),at:tCam,len:2*T,end:d,w:7,col:C.cobalt,sfx:"move"}));
    const gp=[...rng(0,1,20).map(t=>Sp(t,sG(t))), Sp(1,2), ...rng(1,1.5,16).slice(1).map(t=>Sp(t,sG(t)))];
    n.push(...Draw({pts:gp,at:tSud,len:1.2,end:d,w:7,col:C.coral,sfx:"move"}));
    n.push(<Ring key={K()} x={X0+UT} y={Y0-US*1.5} r={56} at={tJo-0.2} dur={d}/>);
    n.push(<Label key={K()} text="C¹: smooth" x={540} y={1400} w={320} size={38} align="left" color={C.cobalt} at={tCam+0.6} dur={d}/>);
    n.push(<Label key={K()} text="G¹: speed jumps 1 → 2 = jolt" x={540} y={1460} w={500} size={38} align="left" color={C.coral} at={tJo-0.2} dur={d}/>);
    return n;
  }, { cam: STATIC }),

  // ---- answer cards: two pages split evenly from "In your exam" to the end ----
  ...[0,1].map(k=> At(tExam+k*half, (r, d) => [
    ...AnswerCard({ page: ANSWERS["cg-q07"][k], title: "WRITE THIS · 5 MARKS · " + (k+1) + "/2", at: 0, dur: d, y: TOP + 24 }),
  ], { cam: STATIC })),
  ];
};
