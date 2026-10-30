import { Box, Label, Layer, Arrow, Check, Mover } from "./prims.jsx";
import { AnswerCard } from "./cards.jsx";
import { ANSWERS } from "./answers.jsx";
// os-q05 v3: first / best / worst fit. One memory bar (top = start of memory), holes drawn to scale.
// Every placement comes from sim(), so the numbers on screen are the algorithm's own.
const HOLES=[100,500,200,300,600], PROCS=[212,417,112,426];
const K=0.54, MX=60, MW=370, MCX=245, AH=36, LX=800, BW=330, MKX=532, W=1080, H=1920;
function sim(alg){ const free=HOLES.slice(), used=[0,0,0,0,0];
  return PROCS.map(p=>{ const probes=[]; let pick=-1;
    if(alg==="first"){ for(let k=0;k<5;k++){ const f=free[k]>=p; probes.push({k,f}); if(f){pick=k;break;} } }
    else { for(let k=0;k<5;k++) probes.push({k,f:free[k]>=p}); const ok=probes.filter(q=>q.f).map(q=>q.k);
      if(ok.length) pick=ok.reduce((a,b)=> alg==="best"? (free[b]<free[a]?b:a) : (free[b]>free[a]?b:a)); }
    const before=free.slice(), usedB=used.slice(); if(pick>=0){ free[pick]-=p; used[pick]+=p; }
    return {p,probes,pick,before,usedB,after:free.slice()}; }); }
const rectPath=(x,y,w,h)=>`M ${x} ${y} L ${x+w} ${y} L ${x+w} ${y+h} L ${x} ${y+h} Z`;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export const SCENES = ({ S, C, TOP, D, cue }) => {
  const STILL=[{t:0,x:540,y:960,z:1},{t:1,x:540,y:960,z:1}];
  const Y0=TOP+170;
  const geo=(()=>{ let y=Y0; const al=[], ho=[]; for(let i=0;i<5;i++){ al.push(y); y+=AH; ho.push({top:y,h:HOLES[i]*K}); y+=HOLES[i]*K; } al.push(y); return {al,ho}; })();
  const regTop=(k,u)=>geo.ho[k].top+u*K, regH=(k,u)=>(HOLES[k]-u)*K;
  // memory bar: grey = in use (a process), dashed = free hole. stagger>0 draws it top to bottom.
  const Mem=(d,stagger=0,at0=0,holeAt)=>{ const out=[]; let i=0;
    geo.al.forEach((y,a)=>{ out.push(<Layer key={"al"+a} at={at0+stagger*(i++)} dur={d}><rect x={MX} y={y} width={MW} height={AH} fill={C.navy} opacity={0.32}/></Layer>);
      if(a<5){ const h=geo.ho[a]; out.push(<Layer key={"ho"+a} at={holeAt!=null?holeAt+a*0.1:at0+stagger*(i++)} dur={d} sfx={stagger?"pop":undefined}><path d={rectPath(MX+4,h.top+3,MW-8,h.h-6)} x={0} y={0} width={W} height={H} stroke={{width:4,color:C.navy}} dash={[14,10]}/></Layer>); } });
    return out; };
  const regLab=(k,u,amt,at,out,d)=> <Label key={"rl"+k+"_"+u+"_"+at} text={amt+" K"} x={MCX} y={regTop(k,u)+regH(k,u)/2-34*0.62} size={34} font={C.fMono} color={C.navy} at={at} out={out} dur={d}/>;
  const mark=(ok,x,y,at,out,d,key,s=1)=> <Layer key={key} at={at} out={out} dur={d} sfx={ok?"tick":"wrong"}>
    {ok? <path d={`M ${x-20*s} ${y} L ${x-6*s} ${y+15*s} L ${x+22*s} ${y-16*s}`} x={0} y={0} width={W} height={H} stroke={{width:9,color:C.cobalt,cap:"round"}}/>
       : <path d={`M ${x-15*s} ${y-15*s} L ${x+15*s} ${y+15*s} M ${x+15*s} ${y-15*s} L ${x-15*s} ${y+15*s}`} x={0} y={0} width={W} height={H} stroke={{width:9,color:C.coral,cap:"round"}}/>}</Layer>;
  const outline=(k,u,at,out,d,col,key,blink)=> <Layer key={key} at={at} out={out} dur={d} sfx={blink?"wrong":"ping"}
      anim={blink?[{property:"opacity",keyframes:[{at:0,value:0},{at:0.12,value:1},{at:0.3,value:0.15},{at:0.45,value:1},{at:0.6,value:0.15},{at:0.75,value:1}]}]:undefined}>
    <path d={rectPath(MX-6,regTop(k,u)-4,MW+12,regH(k,u)+8)} x={0} y={0} width={W} height={H} stroke={{width:8,color:col}}/></Layer>;
  const chip=(j,at,out,d)=> <Box key={"chip"+j} x={175+j*240} y={1515} w={220} h={90} label={PROCS[j]+" K"} size={40} tone="hot" at={at} out={out} dur={d}/>;
  const block=(p,ch)=> [<rect key="r" x={0} y={2} width={BW} height={ch-4} radius={8} fill={C.coral} strokeColor={C.navy} strokeWidth={3}/>,
    <text key="t" x={0} y={ch/2-36*0.62} width={BW} align="center" fontFamily={C.fMono} fontWeight={700} fontSize={36} color={C.ink}>{p+" K"}</text>];
  const title=(name,rule,at,d)=>[<Label key="tn" text={name} x={540} y={TOP+20} size={60} font={C.fHead} color={C.coral} w={1000} at={at} dur={d}/>,
    <Label key="tr" text={rule} x={540} y={TOP+100} size={38} w={1000} at={at+0.25} dur={d}/>];
  const legend=(at1,at2,d,y=TOP+34)=>[
    <Layer key="lg1" at={at1} dur={d}><rect x={70} y={y+6} width={70} height={36} fill={C.navy} opacity={0.32}/></Layer>,
    <Label key="lg1t" text="in use (a process)" x={156} y={y} size={36} align="left" w={420} at={at1+0.1} dur={d}/>,
    <Layer key="lg2" at={at2} dur={d}><path d={rectPath(600,y+6,70,36)} x={0} y={0} width={W} height={H} stroke={{width:4,color:C.navy}} dash={[14,10]}/></Layer>,
    <Label key="lg2t" text="hole (free)" x={686} y={y} size={36} align="left" w={340} at={at2+0.1} dur={d}/>];

  // one full run: probe each hole (tick / cross), choose, slide in on the word, write the leftover.
  const RUN=(alg,d,sch,ex={})=>{ const R=sim(alg), out=[...Mem(d)];
    const ls=[0,0,0,0,0], la=HOLES.slice(), lu=[0,0,0,0,0];
    const endLab=(k,t)=>out.push(regLab(k,lu[k],la[k],ls[k],t,d));
    R.forEach((x,j)=>{ const s=sch[j], ch=x.p*K, yc=k=>regTop(k,x.usedB[k])+ch/2, n=x.probes.length;
      out.push(chip(j,0,s.start,d));
      const pts=[]; let step, marksOut;
      if(x.pick>=0){
        step = alg==="first"? clamp((s.land-0.55-s.start)/Math.max(1,n-1),0.12,0.45) : clamp((s.land-0.9-s.start)/Math.max(1,n-1),0.08,0.3);
        x.probes.forEach((q,i)=>pts.push({t:s.start+i*step,x:LX,y:yc(q.k)}));
        const tL=s.start+(n-1)*step; let slide0;
        if(alg==="first"){ slide0=Math.max(tL+0.1,s.land-0.45); }
        else { out.push(outline(x.pick,x.usedB[x.pick],tL+0.15,s.land+0.3,d,C.coral,"ch"+j));
          slide0=Math.max(tL+0.2,s.land-0.45); pts.push({t:slide0,x:LX,y:yc(x.pick)}); }
        pts.push({t:s.land,x:MCX,y:yc(x.pick)}); marksOut=s.land;
        endLab(x.pick,slide0); la[x.pick]=x.after[x.pick]; lu[x.pick]=x.usedB[x.pick]+x.p; ls[x.pick]=s.land; }
      else { step=clamp((s.flash-0.15-s.start)/Math.max(1,n-1),0.08,0.4);
        x.probes.forEach((q,i)=>pts.push({t:s.start+i*step,x:LX,y:yc(q.k)}));
        const tL=s.start+(n-1)*step, fl=Math.max(s.flash,tL+0.15);
        x.probes.forEach(q=>out.push(outline(q.k,x.usedB[q.k],fl,fl+0.9,d,C.coral,"fl"+j+q.k,true)));
        const m0=fl+0.3, top=geo.ho[0].top; pts.push({t:m0,x:LX,y:yc(x.probes[n-1].k)},{t:m0+0.5,x:LX,y:top+ch/2});
        out.push(<Label key={"wait"+j} text="WAITS" x={LX} y={top+ch+16} size={48} font={C.fHead} color={C.coral} w={330} at={Math.max(m0+0.5,s.wait)} dur={d}/>);
        marksOut=fl+0.9; }
      x.probes.forEach((q,i)=>out.push(mark(q.f, MKX, regTop(q.k,x.usedB[q.k])+regH(q.k,x.usedB[q.k])/2, s.start+i*step+0.08, marksOut, d, "mk"+j+"_"+i)));
      out.push(<Mover key={"mv"+j} pts={pts} cw={BW} ch={ch} at={s.start} out={ex.allFit} dur={d}>{block(x.p,ch)}</Mover>);
      if(ex.allFit!=null && x.pick>=0) out.push(<Box key={"ok"+j} x={MCX} y={regTop(x.pick,x.usedB[x.pick])+ch/2-3} w={BW} h={ch-10} label={x.p+" K"} size={34} tone="b" at={ex.allFit} dur={d}/>);
    });
    for(let k=0;k<5;k++) endLab(k,d);
    return out; };

  // the rules: a to-scale strip of the same five holes, with a 212 K process
  const U=(960-6*14)/1700, holeX=i=>{ let x=60+14; for(let k=0;k<i;k++) x+=HOLES[k]*U+14; return x; };
  const strip=(y,at,d,key)=> <Layer key={key} at={at} dur={d} sfx="pop">{[0,1,2,3,4,5].flatMap(i=>{ const xu=i<5?holeX(i)-14:holeX(4)+HOLES[4]*U;
      const o=[<rect key={"u"+i} x={xu} y={y} width={14} height={100} fill={C.navy} opacity={0.32}/>];
      if(i<5) o.push(<path key={"h"+i} d={rectPath(holeX(i)+3,y+3,HOLES[i]*U-6,94)} x={0} y={0} width={W} height={H} stroke={{width:4,color:C.navy}} dash={[12,9]}/>); return o; })}</Layer>;
  const fillHole=(i,y,at,d,key)=> <Layer key={key} at={at} dur={d} sfx="ping"><rect x={holeX(i)+2} y={y+2} width={HOLES[i]*U-4} height={96} radius={4} fill={C.coral} opacity={0.85}/></Layer>;
  const ROW=(y0,name,rule,ok,pick,tName,tMarks,tPick,d,key)=>{ const yb=y0+150, o=[
    <Label key={key+"n"} text={name} x={60} y={y0} size={56} font={C.fHead} color={C.coral} align="left" w={560} at={tName} dur={d}/>,
    <Label key={key+"pl"} text="process" x={800} y={y0+10} size={36} w={220} at={tName+0.15} dur={d}/>,
    <Layer key={key+"pr"} at={tName+0.15} dur={d} sfx="pop"><rect x={1020-212*U} y={y0+4} width={212*U} height={56} radius={6} fill={C.coral} strokeColor={C.navy} strokeWidth={3}/></Layer>,
    <Label key={key+"r"} text={rule} x={60} y={y0+76} size={38} align="left" w={960} at={tName+0.3} dur={d}/>,
    strip(yb,tName+0.45,d,key+"s")];
    ok.forEach((f,i)=>{ if(f==null) return; o.push(mark(f,holeX(i)+HOLES[i]*U/2,yb+50,tMarks+i*0.14,tPick,d,key+"m"+i,0.8)); });
    o.push(fillHole(pick,yb,tPick,d,key+"f"));
    o.push(<Label key={key+"t"} text="takes this one" x={holeX(pick)+HOLES[pick]*U/2} y={yb+112} size={34} w={300} color={C.coral} at={tPick+0.1} dur={d}/>);
    return o; };

  // small callback to the earlier video (os-q04's contiguous blocks with gaps between them)
  const RX=480, RW=550, RY=Y0, RH=260;
  const recall=(at,d)=>{ const segs=[["P1",120],[null,70],["P2",150],[null,55],["P3",95]]; let x=RX+30; const by=RY+70, o=[];
    segs.forEach(([nm,w],i)=>{ if(nm){ o.push(<rect key={"s"+i} x={x} y={by} width={w} height={80} radius={6} fill={C.navy} opacity={0.32}/>); }
      else o.push(<path key={"s"+i} d={rectPath(x+2,by+2,w-4,76)} x={0} y={0} width={W} height={H} stroke={{width:4,color:C.coral}} dash={[10,8]}/>); x+=w; });
    return [<Layer key="rcp" at={at} dur={d}><path d={rectPath(RX,RY,RW,RH)} x={0} y={0} width={W} height={H} stroke={{width:3,color:C.cobalt}} dash={[12,10]}/>{o}</Layer>,
      <Box key="rct" x={RX+100} y={RY} w={170} h={54} label="from Q4" size={34} tone="b" at={at} dur={d}/>,
      ...[["P1",RX+30+60],["P2",RX+30+190+75],["P3",RX+30+395+47]].map(([t,cx],i)=> <Label key={"rcl"+i} text={t} x={cx} y={RY+70+40-34*0.62} size={34} font={C.fMono} w={120} at={at+0.1} dur={d}/>),
      <Label key="rcg" text="gaps between blocks" x={RX+RW/2} y={RY+175} size={36} color={C.coral} w={500} at={at+0.4} dur={d}/>]; };

  const sb=["first","best","worst"].map(a=>sim(a)[3].after);   // free space left in each hole afterwards
  const CX=c=>146+c*192;
  const t1=cue("in your exam"), pages=ANSWERS["os-q05"], dd=(D-t1)/pages.length;
  const card=(k,r,d)=>[...AnswerCard({ page: pages[k], title: "WRITE THIS · 5 MARKS · "+(k+1)+"/"+pages.length, at: 0, dur: d, y: TOP + 24 })];
  return [
  // Question: the memory bar, and the three methods named as they are read
  S(null,(r,d)=>[ ...Mem(d,0.05),
    <Label key="mem" text="memory" x={MCX} y={TOP+90} size={40} font={C.fHead} w={370} at={0.1} dur={d}/>,
    ...["FIRST FIT","BEST FIT","WORST FIT"].map((t,i)=> <Box key={"w"+i} x={LX} y={560+i*150} w={360} h={104} label={t} size={40} tone="ghost" at={[r("first"),r("best"),r("worst")][i]} dur={d}/>),
  ],{cam:STILL}),

  // Recall: contiguous blocks leave gaps (from Q4); the gaps are HOLES; a new process needs one
  S("remember from the last",(r,d)=>[ ...Mem(d,0,0,r("free gaps")),
    ...legend(r("process gets"),r("free gaps"),d),
    ...recall(0.15,d),
    ...[0,1,2,3,4].map(k=> <Label key={"hl"+k} text="hole" x={MCX} y={geo.ho[k].top+geo.ho[k].h/2-34*0.62} size={34} color={C.coral} w={300} at={r("holes")+k*0.12} dur={d}/>),
    <Box key="np" x={RX+RW/2} y={RY+430} w={340} h={100} label="new process" size={40} tone="hot" at={r("new process")} dur={d}/>,
    <Arrow key="npa" x1={RX+RW/2-180} y1={RY+430} x2={MX+MW+20} y2={RY+430} color={C.coral} at={r("which hole")} dur={d}/>,
    <Label key="npq" text="which hole?" x={RX+RW/2} y={RY+500} size={40} color={C.coral} w={400} at={r("which hole")} dur={d}/>,
    ...["FIRST FIT","BEST FIT","WORST FIT"].map((t,i)=> <Box key={"m"+i} x={RX+RW/2} y={RY+660+i*130} w={360} h={96} label={t} size={38} tone="ghost" at={r("three methods")+i*0.25} dur={d}/>),
  ],{cam:STILL, hold:"which hole", holdY:960}),

  // The three rules, each on a to-scale strip of the same holes with a 212 K process
  S("first fit takes",(r,d)=>{ const y=[TOP+40,TOP+500,TOP+960];
    return [
    ...ROW(y[0],"FIRST FIT","the FIRST hole that's big enough",[false,true,null,null,null],1,0,r("first hole"),r("big enough"),d,"a"),
    ...ROW(y[1],"BEST FIT","the SMALLEST hole that's big enough",[false,true,false,true,true],3,r("best fit"),r("smallest"),r("smallest")+0.9,d,"b"),
    ...ROW(y[2],"WORST FIT","the BIGGEST hole",[null,null,null,null,null],4,r("worst fit"),r("biggest"),r("biggest"),d,"c"),
  ]; },{cam:STILL, hold:"biggest", holdY:960}),

  // The example: hole sizes, then the queue of processes
  S("let's try all three",(r,d)=>[ ...Mem(d,0.04),
    ...title("EXAMPLE","sizes in K · the same for all three",0,d),
    ...HOLES.map((h,k)=>regLab(k,0,h,r(String(h)),d,d)),
    <Label key="hl" text="holes" x={LX} y={Y0+180} size={44} font={C.fHead} color={C.navy} w={330} at={r("holes")} dur={d}/>,
    <Arrow key="ha" x1={LX-110} y1={Y0+210} x2={MX+MW+30} y2={Y0+210} color={C.navy} width={6} at={r("holes")} dur={d}/>,
    <Label key="pl" text="processes need:" x={LX} y={1408} size={38} w={420} at={r("processes")} dur={d}/>,
    ...PROCS.map((p,j)=>chip(j,r(String(p)),d,d)),
  ],{cam:STILL, hold:"processes", holdY:960}),

  S("first fit",(r,d)=>[
    ...RUN("first",d,[{start:0.4,land:r("500")},{start:r("417"),land:r("600")},{start:r("112"),land:r("left")+0.6},{start:r("426"),flash:r("no hole"),wait:r("waits")}]),
    ...title("FIRST FIT","the first hole that's big enough",0,d),
  ],{cam:STILL, n:3}),

  S("best fit",(r,d)=>[
    ...RUN("best",d,[{start:0.4,land:r("300")},{start:r("417"),land:r("500")},{start:r("112"),land:r("200")},{start:r("426"),land:r("600")}],{allFit:r("everything")}),
    ...title("BEST FIT","the smallest hole that's big enough",0,d),
    <Label key="all" text={"EVERYTHING\nFITS"} x={LX} y={760} size={52} font={C.fHead} color={C.cobalt} w={360} at={r("everything")+0.2} dur={d}/>,
  ],{cam:STILL, n:3}),

  S("worst fit",(r,d)=>[
    ...RUN("worst",d,[{start:0.4,land:r("600")},{start:r("417"),land:r("500")},{start:r("112"),land:r("left")+0.6},{start:r("426"),flash:r("waits"),wait:r("again")}]),
    ...title("WORST FIT","the biggest hole",0,d),
  ],{cam:STILL, n:3}),

  // Verdict: what's left free in each hole after each method
  S("so here",(r,d)=>{ const out=[], Y=[TOP+40,TOP+460,TOP+880];
    const names=["FIRST FIT","BEST FIT","WORST FIT"], stat=["426 waits","all four fit","426 waits"];
    const why=[["fastest: stops searching early",r("fastest")],["tiny leftovers, hard to use",r("tiny")],["keeps leftovers big enough to use",r("tries")]];
    Y.forEach((y0,i)=>{ const t0=0.1+i*0.35;
      out.push(<Label key={"n"+i} text={names[i]} x={60} y={y0} size={48} font={C.fHead} color={C.coral} align="left" w={480} at={t0} dur={d}/>);
      out.push(<Label key={"s"+i} text={stat[i]} x={560} y={y0+6} size={40} align="left" w={460} color={i===1?C.cobalt:C.navy} at={t0+0.1} dur={d}/>);
      out.push(<Label key={"fl"+i} text="left free in each hole (K):" x={60} y={y0+72} size={34} align="left" w={900} at={t0+0.15} dur={d}/>);
      sb[i].forEach((v,c)=>{ const hot=i===1&&c>=1&&c<=3, good=i===2&&c===4;
        out.push(<Box key={"c"+i+c} x={CX(c)} y={y0+170} w={172} h={84} label={String(v)} size={42} tone="a" at={t0+0.2+c*0.05} out={hot?why[1][1]+(c-1)*0.15:good?why[2][1]+0.3:undefined} dur={d}/>);
        if(hot) out.push(<Box key={"h"+i+c} x={CX(c)} y={y0+170} w={172} h={84} label={String(v)} size={42} tone="hot" at={why[1][1]+(c-1)*0.15} dur={d}/>);
        if(good) out.push(<Box key={"g"+i+c} x={CX(c)} y={y0+170} w={172} h={84} label={String(v)} size={42} tone="b" at={why[2][1]+0.3} dur={d}/>); });
      out.push(<Label key={"y"+i} text={why[i][0]} x={60} y={y0+240} size={38} align="left" w={960} color={C.cobalt} at={why[i][1]} dur={d}/>); });
    out.push(<Layer key="win" at={r("wins")} dur={d} sfx="ping"><path d={rectPath(44,Y[1]-16,992,316)} x={0} y={0} width={W} height={H} stroke={{width:6,color:C.cobalt}}/></Layer>);
    out.push(<Label key="wl" text="WINS HERE" x={540} y={Y[1]+330} size={40} font={C.fHead} color={C.cobalt} w={400} at={r("wins")+0.1} dur={d}/>);
    return out; },{cam:STILL, hold:"worst fit tries", holdY:960}),

  // Answer cards: "In your exam" to the end, pages split evenly
  S("in your exam",(r,d)=>card(0,r,d),{cam:STILL}),
  ...pages.slice(1).map((_,i)=>{ const t=t1+dd*(i+1); return {at:t,cam:[{t:0,x:540,y:960,z:1},{t:1,x:540,y:960,z:1}],holdT:null,
      draw:d=>{ globalThis.__T0=t; globalThis.__SKEND=0; return card(i+1,null,d); }}; }),
  ];
};
