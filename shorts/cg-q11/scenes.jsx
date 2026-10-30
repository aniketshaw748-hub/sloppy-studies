import { Arrow, Label, Ring, Check, Layer, Mover, bb, ev } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
import { C } from "./theme.jsx";
// cg-q11 · tilted window A(1,1) B(5,3) C(4,5) D(0,3) -> unit square. ONE mapping for every figure: G(x, y).
const W=1080,H=1920;
const U=100, OX=300, OY=890; const G=(x,y)=>[OX+x*U, OY-y*U];
const STATIC=[{t:0,x:540,y:960,z:1},{t:0.5,x:540,y:960,z:1}];
const WIN=[[1,1],[5,3],[4,5],[0,3]];          // A B C D
const UNIT=[[0,0],[1,0],[1,1],[0,1]];
const R5=Math.sqrt(5), TH=Math.atan2(1,2);
const WP=WIN.map(p=>G(...p)), UP=UNIT.map(p=>G(...p));
const ease=s=>{ s=Math.max(0,Math.min(1,s)); return s*s*(3-2*s); };
const lerp=(a,b,s)=>a+(b-a)*s;

const pd=pts=>pts.map((p,i)=>(i?"L ":"M ")+p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" ")+" Z";
const segsOf=pts=>pts.map((p,i)=>[p[0],p[1],pts[(i+1)%pts.length][0],pts[(i+1)%pts.length][1]]);
const path=(k,d,at,end,col,w=6,dash,fill)=> <frame key={k} at={Math.max(0,at)} duration={Math.max(0.03,end-Math.max(0,at))} width={W} height={H} layout="none">
  <path d={d} x={0} y={0} width={W} height={H} stroke={col?{width:w,color:col,cap:"round"}:undefined} dash={dash} fill={fill}/></frame>;
// a stroke that draws itself
function draw(k,segs,t0,end,col,w=6,speed=2400,dashed=false){
  const out=[]; let t=t0; ev(t0,"swish");
  segs.forEach(([x1,y1,x2,y2],si)=>{ const L=Math.hypot(x2-x1,y2-y1), dd=L/speed, n=Math.max(1,Math.ceil(L/(dashed?18:30)));
    for(let i=0;i<n;i++){ if(dashed&&i%2) continue; const a=i/n,b=Math.min(1,(i+1)/n+(dashed?0:0.02)); const ta=Math.min(t+dd*a,end-0.2);
      out.push(path(k+si+"_"+i,`M ${x1+(x2-x1)*a} ${y1+(y2-y1)*a} L ${x1+(x2-x1)*b} ${y1+(y2-y1)*b}`,ta,end,col,w)); }
    t+=dd; });
  return out;
}
const dot=(k,x,y,at,dur,col,rad=11,out)=>{ bb({k:"icon",n:"dot "+k,x:x-rad,y:y-rad,w:rad*2,h:rad*2,t0:at,t1:out??dur,on:true});
  return <Layer key={k} at={at} dur={dur} out={out} sfx="pop" anim={[{property:"opacity",from:0,to:1,at:0,duration:0.1},{property:"scale",from:0.4,to:1,at:0,duration:0.3}]}>
  <rect x={x-rad} y={y-rad} width={rad*2} height={rad*2} radius={rad} fill={col||C.navy}/></Layer>; };
// centred label kept inside x 40..1040
const lab=(k,text,cx,y,at,dur,{size=30,color,font,out}={})=>{ const tw=[...text].length*size*0.62; const x=Math.min(Math.max(cx,42+tw/2),1038-tw/2);
  return <Label key={k} text={text} x={x} y={y} w={Math.ceil(tw)+24} size={size} font={font||C.fMono} at={at} dur={dur} color={color} out={out}/>; };
// working row, left aligned, below the figure
const row=(k,text,y,at,dur,{size=40,color,x=70,w}={})=> <Label key={k} text={text} x={x} y={y} w={w||(1030-x)} size={size} font={C.fMono} at={at} dur={dur} color={color} align="left"/>;

function axes(d){
  const [x0]=G(-1.4,0), [x1]=G(6.2,0), [,yt]=G(0,5.8), [,yb]=G(0,-0.6);
  const tk=[]; for(let i=-1;i<=6;i++){ if(!i) continue; const [x]=G(i,0); tk.push(`M ${x} ${OY-8} L ${x} ${OY+8}`); }
  for(let j=1;j<=5;j++){ const [,y]=G(0,j); tk.push(`M ${OX-8} ${y} L ${OX+8} ${y}`); }
  const n=[<Layer key="ax" at={0} dur={d} anim={[{property:"opacity",from:0,to:1,at:0,duration:0.25}]}>
    <path d={`M ${x0} ${OY} L ${x1} ${OY} M ${OX} ${yb} L ${OX} ${yt}`} x={0} y={0} width={W} height={H} stroke={{width:5,color:C.navy,cap:"round"}}/>
    <path d={`M ${x1+4} ${OY} L ${x1-20} ${OY-11} L ${x1-20} ${OY+11} Z M ${OX} ${yt-4} L ${OX-11} ${yt+20} L ${OX+11} ${yt+20} Z`} x={0} y={0} width={W} height={H} fill={C.navy}/>
    <path d={tk.join(" ")} x={0} y={0} width={W} height={H} stroke={{width:4,color:C.navy,cap:"round"}}/></Layer>];
  [-1,1,2,3,4,5,6].forEach(v=>n.push(lab("tx"+v,v<0?"−"+(-v):String(v),G(v,0)[0],OY+12,0.05,d)));
  [1,2,4,5].forEach(v=>n.push(lab("ty"+v,String(v),OX-26,G(0,v)[1]-19,0.05,d)));
  n.push(lab("xn","x",G(6.2,0)[0]+26,OY-20,0.05,d,{size:34}));
  n.push(lab("yn","y",OX+34,G(0,5.8)[1]-14,0.05,d,{size:34}));
  return n;
}
const WLAB=[["A(1, 1)",G(1,1)[0]+72,G(1,1)[1]+10],["B(5, 3)",G(5,3)[0]+80,G(5,3)[1]-19],["C(4, 5)",G(4,5)[0],G(4,5)[1]-52],["D(0, 3)",G(0,3)[0]-72,G(0,3)[1]-19]];
// the tilted window: tint, outline, corner dots and coordinates
function win(d,{at=0,tAt,labels=true,ghost=false}={}){
  if(ghost) return [path("wg",pd(WP),at,d,C.navy,3,[10,10])];
  const n=[path("wf",pd(WP),at,d,null,0,null,C.cobalt+"1F"), path("wp",pd(WP),at,d,C.navy,6)];
  if(labels) WP.forEach((p,i)=>{ const t=tAt?tAt[i]:at; n.push(dot("wd"+i,p[0],p[1],t,d)); n.push(lab("wl"+i,WLAB[i][0],WLAB[i][1],WLAB[i][2],t,d)); });
  return n;
}
// the unit square at its real place: (0,0)–(1,1)
function unit(d,{at=0,solid=false,label=true}={}){
  const n=[path("uf",pd(UP),at,d,null,0,null,(solid?C.cobalt+"30":C.coral+"30")), path("up",pd(UP),at,d,C.coral,6)];
  if(label) n.push(lab("ul","unit square",G(0.5,0)[0]+40,OY+62,at+0.1,d,{size:34,font:C.fBody,color:C.coral}));
  return n;
}
const rightMark=(p,s=30)=>{ const ua=[0.894*s,-0.447*s], ud=[-0.447*s,-0.894*s]; return `M ${p[0]+ua[0]} ${p[1]+ua[1]} L ${p[0]+ua[0]+ud[0]} ${p[1]+ua[1]+ud[1]} L ${p[0]+ud[0]} ${p[1]+ud[1]}`; };

export const SCENES = ({ S, cue, D, ctx, C, TOP }) => {
  const tExam=cue("In your exam"), tMid=tExam+(D-tExam)/2;
  return [
  // 1 · the question: the tilted window, corner by corner, and the unit square it must land on
  S(null, (r, d) => {
    // whisper heard the corners as one token "A11B53C45D03" (3.3 s – 9.5 s): spread them over it
    const tW=r("window"), tA=tW+0.35, tB=tW+1.9, tC=tW+3.4, tD=tW+4.9, tU=r("unit square");
    const n=[...axes(d)];
    n.push(...draw("w",segsOf(WP),tW,d,C.navy,6,2600));
    n.push(path("wf",pd(WP),tW+0.6,d,null,0,null,C.cobalt+"1F"));
    n.push(lab("wn","window",G(2.5,3)[0],G(2.5,3)[1]-22,tW+0.4,d,{size:38,font:C.fBody,color:C.cobalt}));
    [tA,tB,tC,tD].forEach((t,i)=>{ n.push(dot("wd"+i,WP[i][0],WP[i][1],t,d)); n.push(lab("wl"+i,WLAB[i][0],WLAB[i][1],WLAB[i][2],t+0.1,d));
      n.push(<Ring key={"rg"+i} x={WP[i][0]} y={WP[i][1]} r={36} at={t} dur={Math.min(d,t+1.2)}/>); });
    n.push(...unit(d,{at:tU}));
    return n;
  }, { cam: STATIC }),

  // 2 · recall Q1 (slide, resize), then the two edges and the right angle
  S("This is the window", (r, d) => {
    const n=[...axes(d), ...win(d), ...unit(d)]; const [A,B,,Dd]=WP;
    // callback card: the Q1 window (2,2)-(6,10) slides to the origin, then shrinks to 1 by 1
    const cx=600, cy=1010, cw=420, chh=410; const u=24, ox=640, oy=1370; const g=(x,y)=>[ox+x*u, oy-y*u];
    bb({k:"box",n:"recall card",x:cx,y:cy,w:cw,h:chh,t0:0.05,t1:d});
    n.push(<Layer key="rc" at={0.05} dur={d} sfx="pop"><rect x={cx} y={cy} width={cw} height={chh} radius={14} fill={C.paper} strokeColor={C.navy} strokeWidth={4}/>
      <path d={`M ${ox} ${oy} L ${ox+7.2*u} ${oy} M ${ox} ${oy} L ${ox} ${oy-10.8*u}`} x={0} y={0} width={W} height={H} stroke={{width:3,color:C.navy,cap:"round"}}/></Layer>);
    n.push(path("rg",pd([[2,2],[6,2],[6,10],[2,10]].map(p=>g(...p))),0.6,d,C.navy,3,[8,8]));
    n.push(lab("rt","from Q1",cx+90,cy+14,0.1,d,{size:34,font:C.fBody,color:C.cobalt}));
    const t0=0.6, t1=1.6, t2=1.9, t3=2.9;
    const st=T=>{ const a=ease((T-t0)/(t1-t0)), b=ease((T-t2)/(t3-t2)); const x0=2-2*a, y0=2-2*a; const w=lerp(4,1,b), h=lerp(8,1,b); return [[x0,y0],[x0+w,y0],[x0+w,y0+h],[x0,y0+h]]; };
    const N=Math.round((t3+0.1)*15);
    for(let i=0;i<=N;i++){ const a=i/15, e=i===N?d:(i+1)/15; n.push(path("rq"+i,pd(st(a).map(p=>g(...p))),a,e,C.navy,4,null,C.cobalt+"30")); }
    n.push(lab("r1","slide",940,1150,t0,d,{size:34,font:C.fBody}));
    n.push(lab("r2","resize",940,1210,t2,d,{size:34,font:C.fBody}));
    // edges: four across, two up / one back, two up
    const tAB=r("Edge AB"), tAD=r("Edge AD"), tR=r("right angle");
    const [ax,ay]=A, [bx,by]=B, [dx,dy]=Dd;
    n.push(...draw("abx",[[ax,ay,bx,ay]],tAB+0.5,d,C.cobalt,5,700,true), ...draw("aby",[[bx,ay,bx,by]],tAB+1.2,d,C.cobalt,5,500,true));
    n.push(lab("ab4","4",(ax+bx)/2,ay+8,tAB+0.8,d,{size:34,color:C.cobalt}), lab("ab2","2",bx+26,(ay+by)/2-20,tAB+1.4,d,{size:34,color:C.cobalt}));
    n.push(<Arrow key="ab" x1={ax} y1={ay} x2={bx} y2={by} at={tAB} dur={d} color={C.cobalt} width={9}/>);
    n.push(row("e1","AB = (4, 2)",1030,tAB+0.6,d,{color:C.cobalt,w:500}));
    n.push(...draw("adx",[[ax,ay,dx,ay]],tAD+0.5,d,C.coral,5,500,true), ...draw("ady",[[dx,ay,dx,dy]],tAD+1.0,d,C.coral,5,500,true));
    n.push(lab("ad1","1",(ax+dx)/2+4,ay-48,tAD+0.7,d,{size:34,color:C.coral}), lab("ad2","2",dx-62,(ay+dy)/2-58,tAD+1.2,d,{size:34,color:C.coral}));
    n.push(<Arrow key="ad" x1={ax} y1={ay} x2={dx} y2={dy} at={tAD} dur={d} color={C.coral} width={9}/>);
    n.push(row("e2","AD = (−1, 2)",1110,tAD+0.6,d,{color:C.coral,w:500}));
    n.push(<Layer key="ra" at={tR} dur={d} sfx="tick"><path d={rightMark(A,34)} x={0} y={0} width={W} height={H} stroke={{width:6,color:C.navy,cap:"round"}}/></Layer>);
    n.push(row("e3","AB·AD = −4 + 4 = 0",1210,tR,d,{w:520}));
    n.push(row("e4","→ right angle",1290,tR+0.3,d,{w:520}));
    return n;
  }, { cam: STATIC }),

  // 3 · slide, rotate, resize: the window itself moves onto the unit square
  S("So we add", (r, d) => {
    const n=[...axes(d), ...unit(d,{label:false})];
    const tS=r("slide"), tRo=r("rotate"), tRe=r("resize");
    // the three step chips
    [["slide",tS,C.chip],["ROTATE",tRo,C.coral],["resize",tRe,C.chip]].forEach(([s,t,f],i)=>{ const x=70+i*330, y=990;
      bb({k:"box",n:"chip "+s,x,y,w:290,h:84,t0:t,t1:d});
      n.push(<Layer key={"ch"+i} at={t} dur={d} sfx="pop"><rect x={x} y={y} width={290} height={84} radius={12} fill={f} strokeColor={C.navy} strokeWidth={4}/>
        <text x={x} y={y+20} width={290} align="center" fontFamily={C.fBody} fontWeight={C.wBody} fontSize={40} color={C.navy}>{s}</text></Layer>);
      if(i) n.push(<Layer key={"ca"+i} at={t} dur={d}><path d={`M ${x-36} ${y+42} L ${x-6} ${y+42} M ${x-18} ${y+30} L ${x-6} ${y+42} L ${x-18} ${y+54}`} x={0} y={0} width={W} height={H} stroke={{width:5,color:C.navy,cap:"round"}}/></Layer>); });
    const tF=r("First"), tSub=r("subtract"), tSec=r("Second"), tLies=r("lies flat"), tAxis=r("axis"), tAng=r("angle theta"), tTan=r("tan theta"), tThird=r("Third"), tRoot=r("2 root"), tAD=r("AD is"), tDiv=r("divide");
    // motion: slide by (-1,-1), rotate by -θ, resize by 1/(2√5), 1/√5
    const W1=WIN.map(([x,y])=>[x-1,y-1]);
    const rot=(p,a)=>[p[0]*Math.cos(a)-p[1]*Math.sin(a), p[0]*Math.sin(a)+p[1]*Math.cos(a)];
    const W2=W1.map(p=>rot(p,-TH));
    // the slid window stays behind as a dashed ghost while θ is explained
    n.push(path("wg",pd(WP),0,tLies,C.navy,3,[10,10]), path("sg",pd(W1.map(p=>G(...p))),tLies,tThird,C.cobalt,4,[12,10]));
    const mot=[ {t0:tSub, t1:tSub+1.4, f:s=>WIN.map(([x,y])=>[x-s,y-s])},
                {t0:tLies, t1:tAxis+0.3, f:s=>W1.map(p=>rot(p,-TH*s))},
                {t0:tDiv, t1:tDiv+1.4, f:s=>W2.map(([x,y])=>[x*lerp(1,1/(2*R5),s), y*lerp(1,1/R5,s)])} ];
    const stt=[{t:0,pts:WIN}]; mot.forEach(m=>{ ev(m.t0,"move"); const K=Math.max(4,Math.round((m.t1-m.t0)*30)); for(let i=1;i<=K;i++) stt.push({t:m.t0+(m.t1-m.t0)*i/K, pts:m.f(ease(i/K))}); });
    stt.forEach((s_,i)=>{ const a=s_.t, b=i+1<stt.length?stt[i+1].t:d; const sp=s_.pts.map(p=>G(...p));
      n.push(<frame key={"mf"+i} at={a} duration={Math.max(0.02,b-a)} width={W} height={H} layout="none">
        <path d={pd(sp)} x={0} y={0} width={W} height={H} fill={C.cobalt+"30"}/>
        <path d={pd(sp)} x={0} y={0} width={W} height={H} stroke={{width:6,color:C.navy,cap:"round"}}/>
        <rect x={sp[0][0]-13} y={sp[0][1]-13} width={26} height={26} radius={13} fill={C.coral}/></frame>); });
    // θ: between the slid edge AB and the x axis; rise 2 over run 4
    const rEnd=tThird;
    const arc=[]; for(let i=0;i<=12;i++){ const a=TH*i/12; arc.push((i?"L ":"M ")+(OX+110*Math.cos(a)).toFixed(1)+" "+(OY-110*Math.sin(a)).toFixed(1)); }
    n.push(<Layer key="arc" at={tAng} out={rEnd} dur={d} sfx="tick"><path d={arc.join(" ")} x={0} y={0} width={W} height={H} stroke={{width:6,color:C.coral,cap:"round"}}/></Layer>);
    n.push(<Label key="th" text="θ" x={OX+150} y={OY-62} w={50} size={36} font={C.fMono} color={C.coral} at={tAng+0.1} out={rEnd} dur={d}/>);
    const [bx,by]=G(4,2);
    n.push(<Layer key="rise" at={tTan} out={rEnd} dur={d} sfx="tick"><path d={`M ${bx} ${by} L ${bx} ${OY}`} x={0} y={0} width={W} height={H} stroke={{width:6,color:C.coral}} dash={[10,8]}/></Layer>);
    n.push(<Label key="r2" text="2" x={bx+30} y={(by+OY)/2-20} w={50} size={34} font={C.fMono} color={C.coral} at={tTan+0.1} out={rEnd} dur={d}/>);
    // side lengths after the rotation, before the resize
    const s1=G(2*R5,0), s2=G(0,1.5);
    n.push(<Label key="l1" text="2√5" x={(OX+s1[0])/2} y={OY-58} w={110} size={34} font={C.fMono} color={C.cobalt} at={tRoot} out={tDiv+0.3} dur={d}/>);
    n.push(<Label key="l2" text="√5" x={OX+42} y={s2[1]-21} w={90} size={34} font={C.fMono} color={C.cobalt} at={tAD+0.5} out={tDiv+0.3} dur={d}/>);
    n.push(<Ring key="ok" x={G(0.5,0.5)[0]} y={G(0.5,0.5)[1]} r={80} at={tDiv+1.5} dur={d}/>);
    // working
    n.push(row("s1","1  slide A to 0: T(−1, −1)",1110,tF,d));
    n.push(row("s1b","x − 1,  y − 1",1180,tSub,d,{x:130,color:C.cobalt}));
    n.push(row("s2","2  rotate AB flat: R(−θ)",1260,tSec,d));
    n.push(row("s2b","tan θ = 2/4 = 1/2",1330,tTan,d,{x:130,color:C.coral}));
    n.push(row("s3","3  resize: S(1/(2√5), 1/√5)",1410,tThird,d));
    n.push(row("s3b","AB = 2√5,  AD = √5  →  1, 1",1480,tRoot,d,{x:130,color:C.cobalt}));
    return n;
  }, { cam: STATIC }),

  // 4 · N = S · R(−θ) · T(−1, −1)
  S("Multiplying the three", (r, d) => {
    const n=[...axes(d), ...win(d,{ghost:true}), ...unit(d,{solid:true,label:false})];
    n.push(dot("ao",OX,OY,0,d,C.coral,13));
    n.push(row("n0","N = S · R(−θ) · T(−1, −1)",1010,0.1,d,{size:42}));
    const t=r("gives"), x0=270, y0=1120, cw=210, rh=82, w=cw*3, h=rh*3;
    n.push(lab("neq","N =",165,y0+rh+12,t,d,{size:48}));
    bb({k:"box",n:"matrix N",x:x0,y:y0-12,w:w,h:h+12,t0:t,t1:d});
    n.push(<Layer key="br" at={t} dur={d} sfx="pop"><path d={`M ${x0+24} ${y0-12} L ${x0} ${y0-12} L ${x0} ${y0+h} L ${x0+24} ${y0+h} M ${x0+w-24} ${y0-12} L ${x0+w} ${y0-12} L ${x0+w} ${y0+h} L ${x0+w-24} ${y0+h}`} x={0} y={0} width={W} height={H} stroke={{width:5,color:C.navy,cap:"round"}}/></Layer>);
    [["1/5","1/10","−3/10"],["−1/5","2/5","−1/5"],["0","0","1"]].forEach((rw,i)=>rw.forEach((c,j)=>n.push(
      <Layer key={"m"+i+j} at={t+0.2+i*0.25} dur={d} sfx={j?undefined:"tick"}><text x={x0+cw*j} y={y0+i*rh+12} width={cw} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={46} color={i===2?C.navy:C.coral}>{c}</text></Layer>)));
    return n;
  }, { cam: STATIC }),

  // 5 · check: each corner flies to its unit-square corner
  S("Check", (r, d) => {
    const n=[...axes(d), ...win(d), ...unit(d,{label:false})];
    const TXT=["A(1, 1) → (0, 0)","B(5, 3) → (1, 0)","C(4, 5) → (1, 1)","D(0, 3) → (0, 1)"];
    const ts=[r("A goes"),r("B to"),r("C to"),r("D to")];
    WP.forEach((p,i)=>{ const t0=ts[i], t1=t0+0.8, q=UP[i];
      n.push(<Mover key={"f"+i} pts={[{t:t0,x:p[0],y:p[1]},{t:t1,x:q[0],y:q[1]}]} cw={30} ch={30} at={t0} dur={d} on={true}>
        <rect x={0} y={0} width={30} height={30} radius={15} fill={C.coral} strokeColor={C.navy} strokeWidth={4}/></Mover>);
      n.push(row("c"+i,TXT[i],1020+i*80,t1-0.3,d,{size:44})); });
    n.push(<Check key="ck" x={880} y={1150} size={140} at={r("Exactly")} dur={d}/>);
    return n;
  }, { cam: STATIC }),

  // 6 · answer card 1/2 (the trick is said over it)
  S("In your exam", (r, d) => [ ...AnswerCard({ page: ANSWERS["cg-q11"][0], title: "WRITE THIS · 5 MARKS · 1/2", at: 0, dur: d, y: TOP + 24 }) ], { cam: STATIC }),

  // 7 · answer card 2/2, from the midpoint of the remaining time
  { ...S("In your exam", (r, d) => { globalThis.__T0=tMid; return [ ...AnswerCard({ page: ANSWERS["cg-q11"][1], title: "WRITE THIS · 5 MARKS · 2/2", at: 0, dur: d, y: TOP + 24 }) ]; }, { cam: STATIC }), at: tMid },
  ];
};
