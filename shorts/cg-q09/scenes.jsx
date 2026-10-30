// cg-q09 v3 · Two reflections: triangle A(0,0) B(1,1) C(5,3), first about the x-axis, then about y = −x.
//   x-axis: (x, y) → (x, −y) gives A(0,0) B(1,−1) C(5,−3); y = −x: (x, y) → (−y, −x) gives A′(0,0) B′(1,−1) C′(3,−5).
//   Net (x, y) → (y, −x): rotation of 90° clockwise about O (twice the 45° between the mirrors).
import { Label, Layer, Ring, bb, ev } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
import { C } from "./theme.jsx";
const W=1080,H=1920;
// one mapping for every figure: 1 unit = 100 px, origin (210, 690)
const U=100, OX=210, OY=690; const P=(x,y)=>[OX+x*U, OY-y*U];
const STATIC=[{t:0,x:540,y:960,z:1},{t:0.5,x:540,y:960,z:1}];
const ease=u=>u*u*(3-2*u), FR=1/30;
const S0=[[0,0],[1,1],[5,3]], S1=[[0,0],[1,-1],[5,-3]], S2=[[0,0],[1,-1],[3,-5]];
const lerp=(A,B,u)=>A.map((a,i)=>[a[0]+(B[i][0]-a[0])*u, a[1]+(B[i][1]-a[1])*u]);
const rot=(V,ph)=>V.map(([x,y])=>[x*Math.cos(ph)-y*Math.sin(ph), x*Math.sin(ph)+y*Math.cos(ph)]);
const VCOL=()=>[C.navy,C.cobalt,C.coral], NAMES=["A","B","C"];

const fr=(k,t,len,kids,anim)=> <frame key={k} at={t} duration={Math.max(FR,len)} width={W} height={H} layout="none" animate={anim}>{kids}</frame>;
const pth=(d,stroke,extra={})=> <path d={d} x={0} y={0} width={W} height={H} stroke={stroke} {...extra}/>;
const fadeIn=[{property:"opacity",from:0,to:1,at:0,duration:0.25}];
// chevrons on each edge pointing A -> B -> C -> A (the winding)
function chevD(p){ return [0,1,2].map(i=>{ const a=p[i], b=p[(i+1)%3]; const L=Math.hypot(b[0]-a[0],b[1]-a[1]); if(L<70) return "";
  const ux=(b[0]-a[0])/L, uy=(b[1]-a[1])/L, nx=-uy, ny=ux, s=17; const mx=(a[0]+b[0])/2+ux*8, my=(a[1]+b[1])/2+uy*8;
  return `M ${mx-s*ux+s*0.8*nx} ${my-s*uy+s*0.8*ny} L ${mx} ${my} L ${mx-s*ux-s*0.8*nx} ${my-s*uy-s*0.8*ny}`; }).join(" "); }
const triD=p=>`M ${p[0][0]} ${p[0][1]} L ${p[1][0]} ${p[1][1]} L ${p[2][0]} ${p[2][1]} Z`;
function triKids(V,{dots=true,ghost=false,col}={}){
  const p=V.map(v=>P(...v)); const ink=col||C.navy; const k=[];
  k.push(pth(triD(p),{width:ghost?4:6,color:ink,cap:"round"},{fill:ghost?"#00000000":C.cobalt+"2E",dash:ghost?[14,10]:undefined}));
  if(dots) p.forEach((q,i)=>{ k.push(<rect x={q[0]-22} y={q[1]-22} width={44} height={44} radius={22} fill={VCOL()[i]} strokeColor={C.navy} strokeWidth={3}/>);
    k.push(<text x={q[0]-22} y={q[1]-19} width={44} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={30} color={C.paper}>{NAMES[i]}</text>); });
  if(ghost) p.forEach((q,i)=>k.push(<rect x={q[0]-9} y={q[1]-9} width={18} height={18} radius={9} fill={C.paper} strokeColor={ink} strokeWidth={3}/>));
  return k;
}
const dotBB=(V,t0,t1)=>V.forEach((v,i)=>{ const [x,y]=P(...v); bb({k:"box",n:"dot "+NAMES[i],x:x-22,y:y-22,w:44,h:44,t0,t1}); });
function motion(key,f,t0,T,opts){ const n=Math.round(T/FR), out=[]; for(let i=0;i<n;i++) out.push(fr(key+i,t0+i*FR,FR+0.001,triKids(f(ease((i+1)/n)),opts))); ev(t0,"move"); return out; }
const Pulse=({x,y,r=44,at,dur,col})=> <Layer at={at} dur={dur} out={at+1.3} sfx="ping" anim={[{property:"opacity",keyframes:[{at:0,value:0},{at:0.12,value:1},{at:0.9,value:1},{at:1.25,value:0}]},{property:"scale",keyframes:[{at:0,value:0.5},{at:0.3,value:1.08},{at:0.6,value:1}]}]}>
  <rect x={x-r} y={y-r} width={r*2} height={r*2} radius={r} fill="#00000000" strokeColor={col||C.coral} strokeWidth={8}/></Layer>;
const Band=({k,a,b,at,dur,col,wipe=0.7})=>{ ev(at,"swish"); const N=20, out=[]; for(let i=0;i<N;i++){ const u0=i/N, u1=(i+1)/N, t=at+wipe*i/N;
  out.push(fr(k+i,t,dur-t,pth(`M ${a[0]+(b[0]-a[0])*u0} ${a[1]+(b[1]-a[1])*u0} L ${a[0]+(b[0]-a[0])*u1} ${a[1]+(b[1]-a[1])*u1}`,{width:18,color:col,cap:"butt"}))); } return out; };
function arc(key,R,a0,a1,t0,T,end,col,w=6){ const N=Math.max(8,Math.round(T/FR)), out=[]; ev(t0,"swish");
  for(let i=0;i<N;i++){ const b=a0+(a1-a0)*i/N, c=a0+(a1-a0)*(i+1)/N; const [x1,y1]=P(R*Math.cos(b),R*Math.sin(b)), [x2,y2]=P(R*Math.cos(c),R*Math.sin(c));
    out.push(fr(key+i,t0+T*i/N,end-(t0+T*i/N),pth(`M ${x1} ${y1} L ${x2} ${y2}`,{width:w,color:col,cap:"round"}))); }
  const [qx,qy]=P(R*Math.cos(a1),R*Math.sin(a1)); const s=Math.sign(a1-a0); const tx=-Math.sin(a1)*s, ty=-Math.cos(a1)*s;
  const L=26, h1=[qx-L*(tx*Math.cos(0.5)-ty*Math.sin(0.5)), qy-L*(tx*Math.sin(0.5)+ty*Math.cos(0.5))], h2=[qx-L*(tx*Math.cos(-0.5)-ty*Math.sin(-0.5)), qy-L*(tx*Math.sin(-0.5)+ty*Math.cos(-0.5))];
  out.push(fr(key+"h",t0+T,end-t0-T,pth(`M ${h1[0]} ${h1[1]} L ${qx} ${qy} L ${h2[0]} ${h2[1]}`,{width:w,color:col,cap:"round"})));
  return out; }
const dashed=(k,a,b,t,end,col)=> fr(k,t,end-t,pth(`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`,{width:5,color:col,cap:"round"},{dash:[16,12]}),fadeIn);
const L34=(k,text,x,y,at,dur,o={})=> <Label key={k} text={text} x={x} y={y} size={o.size||34} font={o.font||C.fMono} at={at} dur={dur} out={o.out} color={o.color} align={o.align||"center"} w={o.w||600}/>;
// working rows under the figure
const ROW=(k,text,y,at,d,o={})=> L34(k,text,o.x??80,y,at,d,{size:o.size||40,align:"left",w:940,color:o.color,font:o.font});

// axes + ticks + a few numbers, and the two mirrors (static unless animated)
function Figure(d,{m1=false,m2=false,m1Label=true}={}){
  const n=[];
  const ax=P(-1.4,0), axe=P(6.6,0), ay=P(0,-5.45), aye=P(0,3.6);
  n.push(fr("axes",0,d,[pth(`M ${ax[0]} ${ax[1]} L ${axe[0]} ${axe[1]} M ${ay[0]} ${ay[1]} L ${aye[0]} ${aye[1]}`,{width:5,color:C.navy,cap:"round"}),
    pth(`M ${axe[0]-20} ${axe[1]-12} L ${axe[0]} ${axe[1]} L ${axe[0]-20} ${axe[1]+12} M ${aye[0]-12} ${aye[1]+20} L ${aye[0]} ${aye[1]} L ${aye[0]+12} ${aye[1]+20}`,{width:5,color:C.navy,cap:"round"})],fadeIn));
  const tk=[]; for(let i=-1;i<=6;i++){ if(!i) continue; const [x,y]=P(i,0); tk.push(`M ${x} ${y-9} L ${x} ${y+9}`); } for(let j=-5;j<=3;j++){ if(!j) continue; const [x,y]=P(0,j); tk.push(`M ${x-9} ${y} L ${x+9} ${y}`); }
  n.push(fr("ticks",0.1,d-0.1,pth(tk.join(" "),{width:4,color:C.navy,cap:"round"})));
  [3,5].forEach(v=>n.push(L34("tx"+v,String(v),P(v,0)[0],OY+16,0.15,d,{size:30,w:60})));
  [[3,"3"],[-3,"−3"],[-5,"−5"]].forEach(([v,s])=>n.push(L34("ty"+v,s,OX-38,P(0,v)[1]-19,0.15,d,{size:30,w:70})));
  n.push(L34("lx","x",axe[0]+6,OY+14,0.2,d,{w:40})); n.push(L34("ly","y",OX+34,aye[1]-6,0.2,d,{w:40}));
  if(m1){ n.push(fr("m1",0,d,pth(`M ${P(-1.4,0).join(" ")} L ${P(6.4,0).join(" ")}`,{width:18,color:C.cobalt+"40",cap:"butt"}))); if(m1Label) n.push(L34("m1l","mirror 1",900,630,0,d,{color:C.cobalt,w:200})); }
  if(m2){ n.push(fr("m2",0,d,pth(`M ${P(-1.4,1.4).join(" ")} L ${P(5.3,-5.3).join(" ")}`,{width:18,color:C.coral+"40",cap:"butt"}))); n.push(L34("m2l","y = −x",860,1180,0,d,{color:C.coral,w:200})); }
  return n;
}

export const SCENES = ({ S, ctx, C, TOP }) => [
  // ---- question: the triangle on true axes, then the two mirrors ----
  S(null, (r, d) => {
    const n=[...Figure(d)]; const tA=r("A00B11C53"), tX=r("x axis"), tL=r("line y");
    n.push(fr("tri0",0.2,d-0.2,triKids(S0),fadeIn)); ev(0.2,"pop"); dotBB(S0,0.2,d);
    n.push(L34("lA","(0, 0)",128,OY+18,tA,d,{w:140})); n.push(L34("lB","(1, 1)",375,500,tA+1.5,d,{w:140})); n.push(L34("lC","(5, 3)",820,372,tA+3,d,{w:140}));
    n.push(ROW("q1","A(0, 0)   B(1, 1)   C(5, 3)",1280,tA,d,{size:42}));
    n.push(...Band({k:"m1",a:P(-1.4,0),b:P(6.4,0),at:tX,dur:d,col:C.cobalt+"59"}));
    n.push(L34("m1l","mirror 1",900,630,tX+0.4,d,{color:C.cobalt,w:200}));
    n.push(ROW("q2","1st mirror: the x-axis",1360,tX+0.3,d,{color:C.cobalt,font:C.fBody}));
    n.push(...Band({k:"m2",a:P(-1.4,1.4),b:P(5.3,-5.3),at:tL,dur:d,col:C.coral+"59"}));
    n.push(L34("m2l","y = −x",860,1180,tL+0.4,d,{color:C.coral,w:200}));
    n.push(ROW("q3","2nd mirror: the line y = −x",1425,tL+0.3,d,{color:C.coral,font:C.fBody}));
    return n;
  }, { cam: STATIC }),

  // ---- first mirror: flip across the x-axis (y changes sign) ----
  S("Reflecting about", (r, d) => {
    const n=[...Figure(d,{m1:true,m2:true})]; const tF=r("flips"), tA=r("A stays"), tB=r("B becomes"), tC=r("C becomes"), T=1.1;
    n.push(fr("tri0",0,tF,triKids(S0))); dotBB(S0,0,tF);
    n.push(fr("g0",tF,d-tF,triKids(S0,{dots:false,ghost:true}),[{property:"opacity",from:0,to:0.5,at:0,duration:0.3}]));
    n.push(dashed("v1",P(1,1),P(1,-1),tF,d,C.cobalt), dashed("v2",P(5,3),P(5,-3),tF,d,C.cobalt));
    n.push(...motion("f1",u=>lerp(S0,S1,u),tF,T));
    n.push(fr("tri1",tF+T,d-tF-T,triKids(S1))); dotBB(S1,tF+T,d);
    n.push(ROW("r1","x-axis: (x, y) → (x, −y)",1270,tF+0.2,d,{size:44}));
    n.push(<Ring key="pa" x={OX} y={OY} r={40} at={tA} dur={d}/>);
    n.push(ROW("a1","A(0, 0) stays at (0, 0)",1350,tA,d));
    n.push(<Pulse key="pb" x={P(1,-1)[0]} y={P(1,-1)[1]} at={tB} dur={d}/>); n.push(L34("lB1","(1, −1)",478,770,tB+0.2,d,{w:150}));
    n.push(ROW("b1","B(1, 1) → (1, −1)",1410,tB,d));
    n.push(<Pulse key="pc" x={P(5,-3)[0]} y={P(5,-3)[1]} at={tC} dur={d}/>); n.push(L34("lC1","(5, −3)",830,972,tC+0.2,d,{w:150}));
    n.push(ROW("c1","C(5, 3) → (5, −3)",1470,tC,d));
    return n;
  }, { cam: STATIC }),

  // ---- second mirror: y = −x swaps AND flips both signs (recall the y = x swap) ----
  S("Remember, reflecting", (r, d) => {
    const n=[...Figure(d,{m2:true})]; const tSw=r("swaps"), tFor=r("For y"), tFl=r("flip both"), tB=r("B at"), tLn=r("on that line"), tC=r("C goes"), tC2=r("3 minus 5"), T=1.3;
    n.push(fr("tri1",0,tC,triKids(S1))); dotBB(S1,0,tC);
    // recall from Q2: y = x swaps the coordinates
    bb({k:"srect",n:"recall Q2",x:400,y:330,w:630,h:300,t0:0.2,t1:d});
    n.push(<Layer key="rq" at={0.2} dur={d} sfx="pop" anim={fadeIn}><rect x={400} y={330} width={630} height={300} radius={14} fill={C.paper} strokeColor={C.cobalt} strokeWidth={4} dash={[14,10]}/></Layer>);
    n.push(L34("rqt","from Q2",420,344,0.3,d,{font:C.fBody,align:"left",w:300,color:C.cobalt}));
    n.push(L34("rq1","y = x: swap",420,400,tSw,d,{size:38,align:"left",w:330}));
    n.push(L34("rq2","(a, b) → (b, a)",420,460,tSw+0.3,d,{size:34,align:"left",w:330}));
    n.push(fr("rqm",0.4,d-0.4,[pth("M 790 615 L 1005 400",{width:4,color:C.navy},{dash:[12,10]}),
      <rect x={824} y={446} width={24} height={24} radius={12} fill={C.cobalt} strokeColor={C.navy} strokeWidth={3}/>],fadeIn));
    n.push(fr("rqp",tSw,d-tSw,[pth("M 846 470 L 942 566",{width:5,color:C.coral,cap:"round"},{dash:[10,8]}),
      <rect x={944} y={566} width={24} height={24} radius={12} fill={C.coral} strokeColor={C.navy} strokeWidth={3}/>],fadeIn));
    n.push(L34("rqa","(1, 4)",836,394,0.5,d,{size:30,w:120}));
    n.push(L34("rqb","(4, 1)",880,586,tSw+0.2,d,{size:30,w:120}));
    // the rule for y = −x
    n.push(ROW("r2","y = −x: swap AND flip both signs",1270,tFor,d,{size:38,font:C.fBody}));
    n.push(ROW("r2b","(x, y) → (−y, −x)",1335,tFl,d,{size:44}));
    // B is on the mirror, so it stays; C crosses it
    n.push(<Pulse key="pb" x={P(1,-1)[0]} y={P(1,-1)[1]} at={tB} dur={d} col={C.cobalt}/>);
    n.push(ROW("b2","B(1, −1) stays: it sits on y = −x",1410,tLn,d,{size:38}));
    n.push(dashed("v3",P(5,-3),P(3,-5),tC,d,C.coral));
    n.push(fr("g1",tC,d-tC,triKids(S1,{dots:false,ghost:true}),[{property:"opacity",from:0,to:0.5,at:0,duration:0.3}]));
    n.push(...motion("f2",u=>lerp(S1,S2,u),tC,T));
    n.push(fr("tri2",tC+T,d-tC-T,triKids(S2))); dotBB(S2,tC+T,d);
    n.push(<Pulse key="pc" x={P(3,-5)[0]} y={P(3,-5)[1]} at={tC2} dur={d}/>); n.push(L34("lC2","(3, −5)",390,1172,tC2+0.2,d,{w:150}));
    n.push(ROW("c2","C(5, −3) → (3, −5)",1475,tC2,d));
    return n;
  }, { cam: STATIC }),

  // ---- the answer ----
  S("So the final", (r, d) => {
    const n=[...Figure(d,{m1:true,m2:true,m1Label:false})]; const tA=r("A00B1"), tC=r("C3");
    n.push(fr("g0",0,d,triKids(S0,{dots:false,ghost:true}),[{property:"opacity",from:0,to:0.45,at:0,duration:0.3}]));
    n.push(fr("tri2",0,d,triKids(S2))); dotBB(S2,0,d);
    n.push(L34("lA","(0, 0)",128,OY+18,tA,d,{w:140})); n.push(L34("lB","(1, −1)",478,770,tA+1.2,d,{w:150})); n.push(L34("lC","(3, −5)",390,1172,tC,d,{w:150}));
    n.push(ROW("t","final triangle",1280,0.2,d,{font:C.fBody,size:40}));
    n.push(L34("fa","A′(0, 0)",80,1360,tA,d,{size:46,align:"left",w:260}));
    n.push(L34("fb","B′(1, −1)",370,1360,tA+1.2,d,{size:46,align:"left",w:290}));
    n.push(L34("fc","C′(3, −5)",700,1360,tC,d,{size:46,align:"left",w:300,color:C.coral}));
    return n;
  }, { cam: STATIC }),

  // ---- overall: a 90° clockwise turn = twice the 45° between the mirrors; not mirrored ----
  S("Overall", (r, d) => {
    const n=[...Figure(d,{m1:true,m2:true,m1Label:false})];
    const tXY=r("xy"), tRot=r("rotation"), tTwo=r("Two reflections"), tTw=r("twice"), t45=r("45"), tCan=r("cancel"), tMir=r("mirrored");
    n.push(fr("g0",0,d,triKids(S0,{dots:false,ghost:true}),[{property:"opacity",from:0,to:0.5,at:0,duration:0.3}]));
    n.push(fr("tri2",0,d,triKids(S2))); dotBB(S2,0,d);
    n.push(ROW("o1","(x, y) → (y, −x)",1270,tXY,d,{size:46}));
    // the whole triangle swings 90° clockwise about O
    const R0=Math.hypot(5,3), a0=Math.atan2(3,5), TS=1.8;
    n.push(...arc("a90",R0,a0,a0-Math.PI/2+0.045,tRot,TS,d,C.coral,6));
    { const N=Math.round(TS/FR); for(let i=0;i<N;i++) n.push(fr("sw"+i,tRot+i*FR,FR+0.001,triKids(rot(S0,-Math.PI/2*ease((i+1)/N)),{dots:false,ghost:true,col:C.cobalt}))); ev(tRot,"move"); }
    n.push(L34("l90","90°",880,800,tRot+TS,d,{color:C.coral,w:100}));
    n.push(ROW("o2","= rotation of 90° clockwise about O",1338,tRot,d,{size:38,color:C.coral,font:C.fBody}));
    n.push(ROW("o3","two mirrors that cross → a rotation",1400,tTwo,d,{size:36,font:C.fBody}));
    n.push(...arc("a45",2.15,0,-Math.PI/4,t45,0.8,d,C.coral,6)); n.push(L34("l45","45°",470,740,t45+0.3,d,{color:C.coral,w:100}));
    n.push(ROW("o4","45° apart → turn = 2 × 45° = 90°",1458,t45,d,{size:36}));
    [S0,S2].forEach((V,i)=>{ const p=V.map(v=>P(...v)); n.push(fr("w"+i,tCan+i*0.4,d-tCan-i*0.4,pth(chevD(p),{width:9,color:C.coral,cap:"round"}),fadeIn)); ev(tCan+i*0.4,"ping"); });
    n.push(ROW("o5","flips cancel: not mirrored, same shape + size",1522,tMir,d,{size:34,font:C.fBody}));
    return n;
  }, { cam: STATIC, n: 2 }),

  // ---- answer card ----
  S("In your exam", (r, d) => [
    ...AnswerCard({ page: ANSWERS["cg-q09"][0], title: "WRITE THIS · 5 MARKS · 1/1", at: 0, dur: d, y: TOP + 24 }),
  ], { cam: STATIC }),
];
