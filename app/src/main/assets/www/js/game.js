const C=document.getElementById('c'),X=C.getContext('2d'),W=960,H=540,GY=420,BX=230,INK='#232B4A',CR='#FFF1D6';
const I={};for(const k in ASSETS){const im=new Image();im.src=ASSETS[k][0];I[k]=im;}
let save={money:0,rep:0,up:{ins:0,sus:0,wid:0}};
try{const s=JSON.parse(localStorage.getItem('jhula1'));if(s)save=s}catch(e){}
const persist=()=>{try{localStorage.setItem('jhula1',JSON.stringify(save))}catch(e){}};
// audio
let AC,mute=false,lastK=-9,bt0=0,BPM=110,BM=60000/110;
function au(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state=='suspended')AC.resume()}
function beep(f,d,ty,v,t){if(!AC||mute)return;t=t||0;const n=AC.currentTime+t,o=AC.createOscillator(),g=AC.createGain();o.type=ty||'square';o.frequency.value=f;g.gain.setValueAtTime(v||.07,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(AC.destination);o.start(n);o.stop(n+d+.02)}
const PEN=[262,294,330,392,440,392,330,294];
function music(now){const k=Math.floor((now-bt0)/BM);if(k>lastK){lastK=k;if(S=='title'||S=='stall'||S=='ride'){beep(k%2?70:90,.12,'sine',.12);if(k%4==2)beep(PEN[(k>>1)%8]*(k%16<8?1:1.5),.2,'triangle',.05);if(k%2)beep(1800,.03,'square',.015)}}}
// helpers
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),hash=i=>{const s=Math.sin(i*127.1)*43758.5;return s-Math.floor(s)};
function put(n,x,yb,h,o){o=o||{};const im=I[n];if(!im||!im.width)return;const w=im.width*h/im.height;X.save();X.translate(x,yb);if(o.rot)X.rotate(o.rot);X.scale((o.sx||1)*(o.fl?-1:1),o.sy||1);if(o.a!=null)X.globalAlpha=o.a;X.drawImage(im,-w/2,-h,w,h);X.restore()}
function T(s,x,y,sz,c,al){X.font=sz+'px "Lilita One",Impact,sans-serif';X.textAlign=al||'center';X.textBaseline='middle';X.lineWidth=Math.max(3,sz/5);X.strokeStyle=INK;X.lineJoin='round';X.strokeText(s,x,y);X.fillStyle=c||CR;X.fillText(s,x,y)}
function RR(x,y,w,h,r,f,s,lw){X.beginPath();X.roundRect(x,y,w,h,r);if(f){X.fillStyle=f;X.fill()}if(s){X.lineWidth=lw||4;X.strokeStyle=s;X.stroke()}}
const tier=f=>f>=90?0:f>=70?1:f>=40?2:3,TC=['#FFD966','#8FD18A','#C98B5B','#D9413B'],TN=['Golden','Fresh','Okay','Turning'],MULT=[1.6,1.2,.8,.3];
const FACE=['f_laugh','f_laugh','f_thumb','f_thumb'];
const LINES=[[['Old Woman','Still warm! Jhula bhai, this is why I wake up early.'],['Kite Kid','It tastes like sunshine. Can I have two?'],['Baker','Best milk in the district. Take a bun!']],[['Shopkeeper','Lovely and cool. Same time tomorrow, please.'],['Fisherman','Good stuff. Keeps me going till the tide.']],[['Teacher','Thank you so much! Just what I needed.'],['Cafe Owner','Wonderful, right on time! Thank you!']],[['Grandfather','God bless you, beta! I will boil it at once.'],['Tourist','Oh, thank you! You are a lifesaver!']]];
// state
let S='title',paused=false,ptrs={},held={},btns=[],now=0,shake=0,P=[],FT=[],FL=[],face='f_calm',faceT=0,bottles=[],sf=0,st,R,tcam=0;
const END=6700,SPOT=170,ZW=80,CAPB=10,CAPML=100,cust=[900,1650,2400,3150,3900,4650,5400,6150],OB=[[560,'barr'],[1250,'rock'],[2050,'hay'],[2850,'barr'],[3500,'rock'],[4250,'bush'],[4950,'hay'],[5700,'barr']],OBH={barr:62,rock:42,bush:48,hay:70};
function Pk(x,y,t){return{x,y,t,got:0}}
function mkPick(){const a=[];[[380,0],[700,0],[1050,0],[1380,1],[1850,0],[2150,1],[2650,0],[3000,1],[3650,0],[4000,1],[4400,0],[4850,1],[5200,0],[5600,1],[6000,0],[6400,1]].forEach(([x,hi],j)=>{for(let i=0;i<5;i++)a.push(Pk(x+i*42,hi?GY-150+Math.abs(i-2)*-12:GY-70,'coin'))});a.push(Pk(700,GY-80,'bottle'),Pk(2200,GY-80,'bottle'),Pk(3750,GY-80,'bottle'),Pk(5250,GY-80,'bottle'),Pk(1150,GY-80,'bottleg'),Pk(4500,GY-80,'bottleg'),Pk(2000,GY-80,'clock'),Pk(5000,GY-80,'clock'),Pk(2800,GY-80,'shield'),Pk(5600,GY-80,'shield'),Pk(3600,GY-80,'heart'),Pk(6300,GY-80,'heart'));return a}
function say(s,x,y,c){FT.push({s,x,y,l:1.2,c:c||CR})}
function burst(x,y,n,c,sp){for(let i=0;i<n;i++)P.push({x,y,vx:rnd(-1,1)*sp,vy:rnd(-1.2,.2)*sp,l:rnd(.4,.9),c,r:rnd(3,7)})}
function setFace(f,t){face=f;faceT=t||1.5}
// stall
function startStall(){S='stall';btns=[];paused=false;au();const t0=performance.now();st={t0,nt:Array.from({length:48},(_,i)=>2.5+i*BM/1000).map(t=>({t,s:0})),p:50,fill:0,b:0,sc:0,g:0,gt:0,fx:[],done:0,seal:0};bt0=t0+2500;lastK=-9}
let pressT=-9e9;
function stallTap(){pressT=performance.now();const T0=(performance.now()-st.t0)/1000,w=.27*(1+.3*save.up.wid);let b=null,bd=9;for(const n of st.nt)if(!n.s&&Math.abs(T0-n.t)<w&&Math.abs(T0-n.t)<bd){b=n;bd=Math.abs(T0-n.t)}
if(!b){st.p=clamp(st.p-2,0,100);beep(120,.1,'sawtooth',.06);return}
const dt=T0-b.t,a=Math.abs(dt),k=1+.3*save.up.wid,g=a<.09*k?0:a<.17*k?1:2;b.s=1;st.hitT=performance.now();burst(335,385,8,'#ffffff',150);const ml=[40,32,22][g],ok=st.p>=40&&st.p<=70;st.p=clamp(st.p+(dt<-.03?10:dt>.03?4:7),0,100);st.fill+=ok?ml:ml/2;st.sc+=[1,.7,.4][g];st.g++;
st.fx.push({s:['PERFECT','GOOD','OK'][g]+(ok?'':' (foam)'),l:.7,c:[ '#FFD966','#8FD18A','#BFE3F5'][g]});beep(520+g*-60+st.g*3,.12,'triangle',.1);
if(st.fill>=CAPML){st.fill-=CAPML;if(st.b<CAPB)st.b++;st.seal=.6;beep(900,.25,'sine',.1);beep(1200,.25,'sine',.1,.1)}}
function updStall(dt){const T0=(performance.now()-st.t0)/1000;for(const n of st.nt)if(!n.s&&T0-n.t>.27){n.s=2;st.p=clamp(st.p-8,0,100);st.fx.push({s:'MISS',l:.7,c:'#D9413B'})}
st.p=clamp(st.p-6*dt,0,100);if(st.p>=40&&st.p<=70)st.gt+=dt;st.seal-=dt;st.fx.forEach(f=>f.l-=dt);st.fx=st.fx.filter(f=>f.l>0);
if(T0>2.5+48*BM/1000+.8&&S=='stall'){const acc=st.sc/48,gf=st.gt/(T0-2.5);sf=Math.round(60+40*clamp(acc*.85+gf*.15,0,1));const n=Math.max(8,Math.min(CAPB,st.b));bottles=Array(n).fill(sf);st.done=1;S='batch'}}
// ---- chest-squeeze animation (replaces the old mouth stream) ----
const SRC_L={x:191,y:343},SRC_R={x:236,y:331};            // the two marked chest spots (canvas coords)
const SKIN='#FDAD74',SKIN_LN='#3a2218';
function bez(p0,c,p1,t){const u=1-t;return{x:u*u*p0.x+2*u*t*c.x+t*t*p1.x,y:u*u*p0.y+2*u*t*c.y+t*t*p1.y}}
function spurt(p0,c,p1,hs){                                  // flowing white stream: head races out, tail follows
  const head=clamp(hs/.14,0,1),tail=clamp((hs-.16)/.2,0,1);if(tail>=1||head<=tail)return;
  const f=1-tail*.5,pts=[];for(let i=0;i<=24;i++){pts.push(bez(p0,c,p1,tail+(head-tail)*i/24))}
  X.lineCap='round';X.lineJoin='round';
  for(const [w,col] of [[11*f+4,INK],[7*f+2,'#ffffff']]){X.beginPath();pts.forEach((p,i)=>i?X.lineTo(p.x,p.y):X.moveTo(p.x,p.y));X.lineWidth=w;X.strokeStyle=col;X.stroke()}
}
// ---- right arm: rebuilt from the original left-arm art (mirrored), so it matches the character's style ----
// upper arm is drawn UNDER the body (the striped sleeve covers its top), forearm + fist is drawn OVER the apron
// and bends at the elbow: rest = fist resting on the chest, press = fist pushed into the chest.
const ELB={x:112,y:142},UP={x:14.33,y:31.33},FP={x:14.33,y:15.33};          // elbow (sprite px) and piece pivots
const pressAmt=()=>{const ps=(performance.now()-pressT)/1000;return pressT<0?0:clamp(ps<.07?ps/.07:1-(ps-.07)/.24,0,1)};
const standSq=()=>{const q=Math.max(0,1-(performance.now()-pressT)/280);return{sx:1+.05*q,sy:1-.03*q}};
function inSprite(fn,x,yb,h,sq){const k=h/260;X.save();X.translate(x,yb);X.scale(sq.sx,sq.sy);X.scale(k,k);X.translate(-63,-260);fn();X.restore()}
function armUnder(p){const u=I.uarm;if(!u||!u.width)return;X.drawImage(u,ELB.x-1.2*p-UP.x,ELB.y-.8*p-UP.y)}
function armOver(p){const f=I.farm;if(!f||!f.width)return;const th=(120+17*p)*Math.PI/180;
  X.save();X.translate(ELB.x-1.2*p,ELB.y-.8*p);X.rotate(th);X.drawImage(f,-FP.x,-FP.y);X.restore()}
function drawMan(x,yb,h,sq,p){inSprite(()=>armUnder(p),x,yb,h,sq);put('stand',x,yb,h,sq)}   // arm-under + body
function chestHand(press){inSprite(()=>armOver(press),210,GY+100,330,standSq())}            // forearm + fist on top
function mouth(){
  const now_=performance.now(),hs=(now_-(st.hitT||0))/1000-.05;   // milk starts 50ms after the press
  const press=pressAmt(),on=st.hitT&&hs>=0&&hs<.4;
  put('bottle',335,470,100);
  if(on){
    const w=1-hs/.4,B={x:335,y:387};
    spurt(SRC_L,{x:258,y:296},B,hs);spurt(SRC_R,{x:292,y:292},{x:337,y:386},hs);
    X.fillStyle='rgba(255,255,255,.92)';X.strokeStyle=INK;X.lineWidth=2;
    for(const s of [SRC_L,SRC_R]){X.beginPath();X.arc(s.x,s.y,5*w+2,0,7);X.fill();X.stroke()}
  }
  chestHand(press);
  if(press>.5){X.save();X.lineCap='round';X.strokeStyle=INK;X.lineWidth=3;     // squeeze ticks
    for(let k=0;k<3;k++){const a=-2.6+k*.5;X.beginPath();X.moveTo(236+Math.cos(a)*22,331+Math.sin(a)*22);X.lineTo(236+Math.cos(a)*30,331+Math.sin(a)*30);X.stroke()}X.restore()}
}
function drawStall(){const T0=(performance.now()-st.t0)/1000;scene(tcam,now);put('stall',200,GY+60,300,{a:.55});drawMan(210,GY+100,330,standSq(),pressAmt());mouth();
RR(370,60,34,320,12,'#fff9',INK,4);const py=380-st.p*3.2;RR(371,380-70*3.2,32,30*3.2,8,'#8FD18A');X.fillStyle=st.p>=40&&st.p<=70?'#8FD18A':'#D9413B';X.beginPath();X.moveTo(366,py);X.lineTo(346,py-12);X.lineTo(346,py+12);X.fill();T('PRESSURE',387,40,18);
RR(500,60,86,350,16,'#232B4Acc');const ry=390,top=70,spd=(ry-top)/1.6;for(const n of st.nt){const y=ry-(n.t-T0)*spd;if(y<top-30||y>ry+60||n.s==1)continue;X.globalAlpha=n.s==2?.3:1;X.beginPath();X.arc(543,y,22,0,7);X.fillStyle=CR;X.fill();X.lineWidth=5;X.strokeStyle='#3B5BDB';X.stroke();X.fillStyle='#3B5BDB';X.beginPath();X.arc(543,y+3,8,0,7);X.fill();X.globalAlpha=1}
X.beginPath();X.arc(543,ry,32,0,7);X.lineWidth=6;X.strokeStyle='#F7B6C2';X.stroke();
st.fx.forEach(f=>T(f.s,543,ry-50-(.7-f.l)*50,28,f.c));
const bx=760,by=420,bh=210;RR(bx-45,by-bh+40,90,bh-40,22,'#fff3',INK,5);const fh=(bh-40)*Math.min(1,st.fill/CAPML);X.save();X.beginPath();X.roundRect(bx-45,by-bh+40,90,bh-40,22);X.clip();X.fillStyle='#fff';X.fillRect(bx-45,by-fh,90,fh);X.fillStyle='#BFE3F5';X.fillRect(bx-45,by-fh,90,5);X.restore();RR(bx-45,by-bh+40,90,bh-40,22,0,INK,5);RR(bx-26,by-bh,52,50,10,'#fff3',INK,5);RR(bx-30,by-bh-14,60,18,6,st.seal>0?'#FFD966':CR,INK,4);
if(T0>2.3)for(let i=0;i<4;i++){X.beginPath();X.arc(bx,by-60,70+Math.sin(now*6+i)*6,i*1.6,i*1.6+.9);X.lineWidth=4;X.strokeStyle='#FFD966';X.stroke()}
T(Math.floor(st.fill)+' / '+CAPML+' ml',bx,by+28,24);for(let i=0;i<CAPB;i++)put('bottle',684+(i%5)*44,i<5?118:178,i<st.b?50:38,{a:i<st.b?1:.3});T('Bottles: '+st.b+' / '+CAPB,760,36,26);
if(T0<2.5)T('Tap on the beat when a drop hits the pink ring!',480,500,26);else T('Keep pressure in the green  -  tap / Space',480,510,20)}
// ride
function startRide(){S='ride';btns=[];au();R={x:0,v:0,y:0,vy:0,air:0,fr:bottles.slice(),pk:mkPick(),ob:OB.map(o=>({x:o[0],t:o[1],hit:0})),cu:cust.map((x,i)=>({x,i,done:0,miss:0,mm:0,say:0,msg:'',nm:'',pend:0,rt:-1,pr:0,pf:0,t:0})),earn:0,sold:0,combo:0,hearts:0,slow:0,shield:0,fl:[],give:null,hf:[],inv:0,atEnd:0,age:0,coins:0,end:0,sfSum:0};bt0=performance.now();lastK=-9}
const ctrl={back:[22,440,146,84],give:[384,438,192,86],hop:[640,440,140,84],gas:[796,440,142,84]},FIN=[380,100,200,48];
const finShown=()=>R&&R.atEnd&&!R.give&&R.fr.length&&R.cu.some(c=>!c.done);
function hold(n){return held[n]||Object.values(ptrs).includes(n)}
function rideDraw(fi,xr,yb,o){const im=I['ride'+fi];if(!im||!im.width)return;const q=.93,w=im.width*q,h=im.height*q;X.save();X.translate(xr,yb);X.scale(o.sx||1,o.sy||1);if(o.rot)X.rotate(o.rot);if(o.a!=null)X.globalAlpha=o.a;X.drawImage(im,-w,-h,w,h);X.restore()}
function nearCust(){let b=null,bd=1e9;for(const c of R.cu){if(c.done)continue;const d=Math.abs(c.x-R.x-SPOT);if(d<ZW&&d<bd){b=c;bd=d}}return b}
function giveAct(){if(S!='ride'||paused||R.give)return;const c=nearCust();if(!c){say('No customer here',BX,GY-200,'#BFE3F5');beep(150,.1,'sawtooth');return}
if(Math.abs(R.v)>200){say('Slow down!',BX,GY-200,'#D9413B');return}if(!R.fr.length){say('Crate is empty',BX,GY-200,'#D9413B');return}
R.fr.sort((a,b)=>b-a);const f=R.fr.shift(),t=tier(f),pf=Math.abs(c.x-R.x-SPOT)<35&&Math.abs(R.v)<90;let pr=40*MULT[t];if(pf)pr+=10;pr*=1+Math.min(.5,R.combo*.05);pr=Math.round(pr);
if(t<3)R.combo++;else R.combo=0;R.sold++;R.earn+=pr;R.sfSum+=f;if(pf)R.hearts++;
c.done=1;c.t=t;c.pr=pr;c.pf=pf;c.pend=.4;c.rt=-1;c.say=0;const L=LINES[t][Math.floor(Math.random()*LINES[t].length)];c.nm=L[0];c.msg=L[1];
R.give={c,t:0};setFace(FACE[t],2.2);beep(600,.12,'triangle',.08)}
function react(c){const kx=c.x-R.x+BX+10;c.rt=0;c.say=3.4;say('+\u20b9'+c.pr+(c.pf?' Perfect!':''),kx,GY-215,TC[c.t]);burst(kx,GY-100,18,TC[c.t],260);burst(kx,GY-100,8,'#F7B6C2',200);
for(let i=0;i<7;i++)R.hf.push({x:c.x+10+rnd(-26,26),y:GY-120-rnd(0,30),vy:-rnd(60,120),l:1.5+rnd(0,.8),p:rnd(0,6)});beep(880,.2,'sine',.1);beep(1320,.2,'sine',.08,.1);beep(1760,.25,'sine',.07,.2)}
function updRide(dt){const gas=hold('gas'),bk=hold('back');R.age+=dt;
if(gas){R.v=Math.min(340,R.v+(R.v<0?560:260)*dt)}
else if(bk){R.v=Math.max(-190,R.v-(R.v>0?600:320)*dt)}
else if(R.v>0)R.v=Math.max(0,R.v-70*dt);else if(R.v<0)R.v=Math.min(0,R.v+260*dt);
if(R.y==0&&R.vy==0&&hold('hop')&&!R.hopL){R.vy=780;R.hopL=1;beep(400,.15,'triangle',.08)}if(!hold('hop'))R.hopL=0;
R.y+=R.vy*dt;R.vy-=1900*dt;if(R.y<=0){if(R.air){R.air=0;if(R.vy<-400){const pen=1*(save.up.sus?.5:1);R.fr=R.fr.map(f=>Math.max(0,f-pen));burst(BX-60,GY,6,'#E8D4B8',120)}}R.y=0;R.vy=0}else{R.air=1;if(Math.abs(R.v)>5&&Math.abs(R.v)<150)R.v=R.v<0?-150:150}
R.x+=R.v*dt;if(R.x<0){R.x=0;if(R.v<0)R.v=0}if(R.x>=END){R.x=END;if(R.v>0)R.v=0}R.atEnd=R.x>=END-1?1:0;
R.an=(R.an||0)+dt*(Math.abs(R.v)>20?4+Math.abs(R.v)/60:0);R.slow=Math.max(0,R.slow-dt);R.inv=Math.max(0,R.inv-dt);R.fr=R.fr.map(f=>Math.max(0,f-(R.slow>0?0:(1/3)*(save.up.ins?.75:1)*dt)));
if(Math.abs(R.v)>80&&R.y==0&&Math.random()<dt*20)P.push({x:BX-100,y:GY,vx:-R.v*.3,vy:rnd(-40,-10),l:.6,c:'#E8D4B8',r:rnd(5,10)});
// obstacles: small hit zone at the bike's front (or rear when reversing), generous jump clearance
const hz=R.v>=0?120:-105;
if(R.inv<=0)for(const o of R.ob){if(o.hit||Math.abs(R.v)<=5)continue;if(Math.abs(o.x-(R.x+hz))<30&&R.y<OBH[o.t]*.7){o.hit=1;if(R.shield){R.shield=0;say('Shield!',BX,GY-200,'#9FE0D0')}else{R.v=R.v>=0?Math.min(R.v,60):Math.max(R.v,-60);const pen=4*(save.up.sus?.5:1);R.fr=R.fr.map(f=>Math.max(0,f-pen));say('Ouch! Hop over it',BX,GY-210,'#D9413B');R.combo=0;R.inv=1;shake=.3;setFace('f_alarm',1.2);beep(110,.3,'sawtooth',.12)}}}
for(const p of R.pk)if(!p.got&&Math.abs(p.x-R.x)<48&&Math.abs(p.y-(GY-R.y-70))<62){p.got=1;burst(BX,p.y,6,'#FFD966',140);if(p.t=='coin'){R.earn+=5;R.coins++;beep(1040,.08,'square',.06)}else{beep(1300,.2,'sine',.1);if(p.t=='bottle'){if(R.fr.length<CAPB){R.fr.push(85);say('+1 bottle',BX,GY-200,'#FFF1D6')}else say('Crate full',BX,GY-200,'#D9413B')}if(p.t=='bottleg'){R.fr=R.fr.map(f=>Math.min(100,f+15));say('Fresh +15',BX,GY-200,'#FFD966')}if(p.t=='clock'){R.slow=8;say('Decay frozen!',BX,GY-200,'#9FE0D0')}if(p.t=='shield'){R.shield=1;say('Shield up',BX,GY-200,'#9FE0D0')}if(p.t=='heart'){R.hearts++;say('+1 heart',BX,GY-200,'#F7B6C2')}}}
for(const c of R.cu){c.say-=dt;const u=c.x-R.x;
 if(c.pend>0){c.pend-=dt;if(c.pend<=0)react(c)}else if(c.done&&c.rt>=0)c.rt+=dt;
 if(!c.done&&u<30&&!c.miss){c.miss=1;if(!c.mm){c.mm=1;R.combo=0}say('Missed! Hold BACK',BX,GY-190,'#D9413B')}
 if(!c.done&&c.miss&&u>=60)c.miss=0}
if(R.give){R.give.t+=dt;if(R.give.t>=1)R.give=null}
R.hf.forEach(h=>{h.y+=h.vy*dt;h.l-=dt});R.hf=R.hf.filter(h=>h.l>0);
const allDone=R.cu.every(c=>c.done&&c.pend<=0);
if(!R.give&&(allDone||(!R.fr.length&&R.cu.every(c=>c.pend<=0)))){R.end+=dt;if(R.end>1.8)finish()}else R.end=0}
function finish(){S='result';const avg=R.sold?Math.round(R.sfSum/R.sold):0;R.avg=avg;R.stars=R.earn>=560?3:R.earn>=400?2:R.earn>=160?1:0;save.money+=R.earn;save.rep+=R.hearts;persist()}
function ease(t){t=clamp(t,0,1);return t*t*(3-2*t)}
function drawSmile(x,y,r,sc){X.save();X.translate(x,y);X.scale(sc,sc);X.beginPath();X.arc(0,0,r,0,7);X.fillStyle='#FFD966';X.fill();X.lineWidth=4;X.strokeStyle=INK;X.stroke();
X.fillStyle='rgba(255,120,140,.55)';for(const d of[-1,1]){X.beginPath();X.arc(d*r*.58,r*.25,r*.2,0,7);X.fill()}
X.lineCap='round';X.lineWidth=3.5;for(const d of[-1,1]){X.beginPath();X.arc(d*r*.36,-r*.08,r*.17,Math.PI*1.12,Math.PI*1.88);X.stroke()}
X.beginPath();X.arc(0,r*.02,r*.52,.12*Math.PI,.88*Math.PI);X.closePath();X.fillStyle='#8A2F2F';X.fill();X.lineWidth=3;X.stroke();X.restore()}
function drawGive(cam){const g=R.give;if(!g)return;const c=g.c,kx=c.x-cam+10,e=g.t<.4?ease(g.t/.4):g.t<.6?1:1-ease((g.t-.6)/.4);if(e<.02)return;
const S0={x:BX+8,y:GY-94-R.y},H0={x:BX+42,y:GY-85-R.y},Tg={x:kx-24,y:GY-52};
const H={x:H0.x+(Tg.x-H0.x)*e,y:H0.y+(Tg.y-H0.y)*e-Math.sin(e*Math.PI)*16};
const dx=H.x-S0.x,dy=H.y-S0.y,L=Math.hypot(dx,dy)||1;let nx=-dy/L,ny=dx/L;if(ny<0){nx=-nx;ny=-ny}const bend=clamp(70-L*.3,8,36),El={x:(S0.x+H.x)/2+nx*bend,y:(S0.y+H.y)/2+ny*bend};
X.save();X.lineCap='round';X.lineJoin='round';
X.beginPath();X.moveTo(S0.x,S0.y);X.lineTo(El.x,El.y);X.lineTo(H.x,H.y);X.lineWidth=21;X.strokeStyle=INK;X.stroke();
X.beginPath();X.moveTo(S0.x,S0.y);X.lineTo(El.x,El.y);X.lineWidth=15;X.strokeStyle='#4A63B0';X.stroke();
X.beginPath();X.moveTo(El.x,El.y);X.lineTo(H.x,H.y);X.lineWidth=15;X.strokeStyle=SKIN;X.stroke();
X.beginPath();X.arc(H.x,H.y,11,0,7);X.fillStyle=SKIN;X.fill();X.lineWidth=3;X.strokeStyle=INK;X.stroke();X.restore();
if(g.t<.4)put('bottle',H.x+8,H.y+20,46,{rot:.25})}
function drawRide(){const cam=R.x-BX;scene(cam,now);
for(const c of R.cu){const sx=c.x-cam;if(sx<-260||sx>W+260)continue;const hs=c.i%2?'stall':'house';put(hs,sx,GY+4,hs=='house'?190:180);
const rt=c.done&&c.rt>=0?c.rt:-1,fade=Math.max(0,1-rt/3.4),jp=rt>=0?Math.abs(Math.sin(rt*8))*fade*30:0,kx=sx+10;
put('kid',kx,GY+16-jp,128,{rot:rt>=0?Math.sin(rt*14)*.09*fade:0,sy:rt>=0&&jp<2?.97:1});
if(c.done&&c.pend<=0)put('bottle',kx-18,GY-16-jp,46,{rot:-.35});
if(rt>=0&&rt<3.4){const k=ease(rt/.3)*(1+.12*Math.sin(rt*10))*clamp((3.4-rt)/.4,0,1);drawSmile(kx,GY-158-jp*.5,25,Math.max(.01,k))}
if(!c.done){const u=c.x-R.x,near=Math.abs(u-SPOT)<ZW,ok=Math.abs(R.v)<=200;put('heart',kx,GY-190+Math.sin(now*4+c.i)*6,44,{a:c.miss?.55:1});if(c.miss)T('Missed!',kx,GY-215,22,'#D9413B');
 if(near){X.setLineDash([12,10]);X.beginPath();X.ellipse(kx,GY+14,78,20,0,0,7);X.lineWidth=5;X.strokeStyle=ok?'#8FD18A':'#D9413B';X.stroke();X.setLineDash([])}}
if(c.say>0&&c.msg){X.font='20px "Lilita One",Impact,sans-serif';const w=Math.min(300,X.measureText(c.msg).width+30),bx=clamp(kx-w/2,10,W-w-10),by=GY-340;RR(bx,by,w,70,16,CR,INK,4);T(c.nm,bx+w/2,by+18,18,TC[c.t]);X.fillStyle=INK;X.font='15px Arial,sans-serif';X.textAlign='center';const ws=c.msg.split(' ');let l1='',l2='';ws.forEach(q=>{if((l1+q).length<34&&!l2)l1+=q+' ';else l2+=q+' '});X.fillText(l1.trim(),bx+w/2,by+40);X.fillText(l2.trim(),bx+w/2,by+58)}}
for(const o of R.ob){const sx=o.x-cam;if(sx<-100||sx>W+100)continue;put(o.t=='hay'?'hay':o.t,sx,GY+6,OBH[o.t],{a:o.hit?.5:1})}
for(const p of R.pk){if(p.got)continue;const sx=p.x-cam;if(sx<-50||sx>W+50)continue;const sw=Math.sin(now*5+p.x)*3;put(p.t=='coin'?'coin':p.t,sx,p.y+30+sw,p.t=='bottleg'?64:p.t=='bottle'?56:36)}
const fi=2,sq=hold('back')&&R.v>30?{sx:1.06,sy:.94,rot:-.03}:{sy:1+Math.min(.12,Math.abs(R.vy)/5000),sx:1-Math.min(.06,Math.abs(R.vy)/9000)};
const blink=(R.shield&&Math.floor(now*8)%2)||(R.inv>0&&Math.floor(now*14)%2);
rideDraw(fi,BX+115,GY+10-R.y+(Math.abs(R.v)>20&&R.y==0?Math.sin(R.an*1.6)*1.5:0),Object.assign({},sq,{a:blink?.6:1}));if(R.shield){X.beginPath();X.arc(BX,GY-R.y-85,110,0,7);X.lineWidth=4;X.strokeStyle='#9FE0D0';X.stroke()}
drawGive(cam);
for(const h of R.hf)put('heart',h.x-cam+Math.sin(now*5+h.p)*10,h.y,24+8*clamp(h.l,0,1),{a:clamp(h.l*1.5,0,1)});
if(R.age<7){T('GAS = go   BACK = brake / reverse   HOP = jump obstacles',480,130,22);T('Stop next to a customer, then press GIVE',480,160,22,'#FFD966')}
fx();hud()}
function fx(){for(const p of P){X.globalAlpha=clamp(p.l*2,0,1);X.beginPath();X.arc(p.x-(S=='ride'?0:0),p.y,p.r,0,7);X.fillStyle=p.c;X.fill()}X.globalAlpha=1;for(const f of FT)T(f.s,f.x,f.y-(1.2-f.l)*40,30,f.c)}
const BC={back:['#FFC36B','#F59E3B','#A85A10'],gas:['#7BE08F','#3FBF63','#1E7F3C'],hop:['#8FB2FF','#4F86F7','#2650B5'],give:['#FFF0A8','#FFD966','#B8922A'],off:['#E6E2DA','#BDB8AE','#85807A']};
function chev(cx,cy,d,s){X.lineCap='round';X.lineJoin='round';for(const[w,c]of[[s*.5,INK],[s*.3,'#fff']]){X.lineWidth=w;X.strokeStyle=c;X.beginPath();X.moveTo(cx-d*s*.35,cy-s*.55);X.lineTo(cx+d*s*.35,cy);X.lineTo(cx-d*s*.35,cy+s*.55);X.stroke()}}
function chevUp(cx,cy,s){X.lineCap='round';X.lineJoin='round';for(const[w,c]of[[s*.5,INK],[s*.3,'#fff']]){X.lineWidth=w;X.strokeStyle=c;X.beginPath();X.moveTo(cx-s*.6,cy+s*.45);X.lineTo(cx,cy-s*.1);X.lineTo(cx+s*.6,cy+s*.45);X.stroke()}}
function pill(x,y,w,h,main,dark){const r=Math.min(16,h/2);RR(x,y+5,w,h-5,r,dark,INK,4);RR(x,y,w,h-5,r,main,INK,4);RR(x+8,y+4,w-16,Math.max(5,(h-5)*.26),5,'rgba(255,255,255,.35)')}
function ctrlBtn(k,b,on,lab,stt){const[x,y,w,h]=b,pal=BC[k=='give'&&stt==0?'off':k],off=on?6:0,fh=h-10,cx=x+w/2;
X.save();if(k=='give'&&stt==2){X.shadowColor='#FFF1D6';X.shadowBlur=24+10*Math.sin(now*8)}RR(x,y+8,w,fh,22,pal[2],INK,5);X.restore();
const g=X.createLinearGradient(0,y+off,0,y+off+fh);g.addColorStop(0,pal[0]);g.addColorStop(1,pal[1]);RR(x,y+off,w,fh,22,g,INK,5);RR(x+12,y+off+6,w-24,12,6,'rgba(255,255,255,.4)');
const cy=y+off+fh*.4;
if(k=='gas'){chev(cx-12,cy,1,26);chev(cx+14,cy,1,26)}else if(k=='back'){chev(cx+12,cy,-1,26);chev(cx-14,cy,-1,26)}else if(k=='hop')chevUp(cx,cy+2,30);else put('bottle',cx,cy+20,44,{rot:.2});
T(lab,cx,y+off+fh-15,22,k=='give'&&stt==0?'#6B665F':CR)}
function hud(){RR(10,10,235,84,18,CR+'ee',INK,4);if(I[face]&&I[face].width){X.save();X.beginPath();X.arc(52,52,34,0,7);X.clip();put(face,52,106,86);X.restore();X.beginPath();X.arc(52,52,34,0,7);X.lineWidth=4;X.strokeStyle=INK;X.stroke()}
T('\u20b9'+(save.money+R.earn),150,36,32,'#FFD966');for(let i=0;i<5;i++)put('heart',104+i*28,80,i<R.hearts?24:18,{a:i<R.hearts?1:.25});
const gx=330,gw=300;RR(gx,16,gw,12,6,'#fff8',INK,3);cust.forEach((c,i)=>{const o=R.cu[i];X.beginPath();X.arc(gx+c/END*gw,22,8,0,7);X.fillStyle=o.done?'#8FD18A':o.miss?'#D9413B':CR;X.fill();X.lineWidth=3;X.strokeStyle=INK;X.stroke()});put('ride2',gx+clamp(R.x/END,0,1)*gw,42,22);
const avg=R.fr.length?R.fr.reduce((a,b)=>a+b,0)/R.fr.length:0,t=tier(avg);
RR(14,356,200,64,16,CR+'ee',INK,4);put('bottle',40,412,52);RR(66,372,134,18,9,'#fff',INK,3);RR(66,372,Math.max(4,134*avg/100),18,9,TC[t],INK,3);T(Math.round(avg)+' '+TN[t],133,404,22,TC[t]);
RR(228,356,224,64,16,CR+'ee',INK,4);for(let i=0;i<CAPB;i++){const f=R.fr[i];put('bottle',248+(i%5)*34,i<5?392:414,34,{a:f==null?.2:1})}T('x'+R.fr.length,426,388,28,'#FFD966');
const miss=R.cu.filter(c=>c.miss&&!c.done).length;if(miss&&R.fr.length)T('<< '+miss+' missed - hold BACK to return',480,76,22,'#FFD966');
if(combo_ok())T('Combo x'+R.combo,BX,GY-250,26,'#FFD966');
if(finShown()){pill(FIN[0],FIN[1],FIN[2],FIN[3],'#FFD966','#C9A02A');T('FINISH ROUTE',480,FIN[1]+22,24,INK)}
const cn=nearCust(),ready=cn&&Math.abs(R.v)<=200;
for(const k in ctrl)ctrlBtn(k,ctrl[k],hold(k),{back:'BACK',hop:'HOP',gas:'GAS',give:'GIVE'}[k],k=='give'?(ready?2:cn?1:0):0);
if(cn&&Math.abs(R.v)>200)T('Slow down to hand over milk',BX+250,GY-320,26,'#D9413B')}
function combo_ok(){return R.combo>1}
function chrome(){const p=[900,10,48,48],s=[846,10,48,48];put(paused?'btn_play':'btn_pause',924,58,48);put('btn_snd',870,58,48,{a:mute?.4:1})}
// scene
function cloud(x,y){X.beginPath();X.ellipse(x,y,60,22,0,0,7);X.ellipse(x+36,y-14,40,22,0,0,7);X.ellipse(x-34,y-8,34,18,0,0,7);X.fill()}
function hills(off,col,base,amp,f){X.fillStyle=col;X.beginPath();X.moveTo(0,GY);for(let x=0;x<=W;x+=10)X.lineTo(x,base-amp*Math.sin((x+off)*f)-amp*.5*Math.sin((x+off)*f*2.3));X.lineTo(W,GY);X.fill()}
function scene(cam,tm){const g=X.createLinearGradient(0,0,0,GY);g.addColorStop(0,'#BFE3F5');g.addColorStop(1,CR);X.fillStyle=g;X.fillRect(0,0,W,H);X.fillStyle='#fff';for(let i=0;i<6;i++)cloud(((i*260-cam*.1-tm*10)%1560+1560)%1560-200,60+(i*53%90));
hills(cam*.25,'#CDEBC6',330,60,.004);hills(cam*.45,'#A9DDA0',380,45,.006);
for(let i=0;i<8;i++){const sx=((i*400+hash(i)*120-cam*.6)%3200+3200)%3200-300;put('tree',sx,GY-4,150+hash(i+9)*60,{a:.92})}
for(let i=0;i<16;i++){const wx=i*300+hash(i+3)*120,sx=wx-cam;if(sx<-150||sx>W+150)continue;const k=Math.floor(hash(i+5)*4);put(['fence','bush','lamp','sign'][k],sx,GY+2,[60,40,130,72][k],{fl:i%2})}
const gh=100,gw=I.ground.width?I.ground.width*gh/I.ground.height:600;X.fillStyle='#7a4a2e';X.fillRect(0,GY+gh-14,W,H);for(let k=Math.floor(cam/gw);k*gw-cam<W;k++){const x=k*gw-cam;if(!I.ground.width)break;X.save();X.translate(x+(k&1?gw:0),GY-14);X.scale(k&1?-1:1,1);X.drawImage(I.ground,0,0,gw+1,gh);X.restore()}}
// menus
function title(){tcam+=140*dtm;scene(tcam,now);const bob=Math.sin(now*2)*5,pl=1+.05*Math.sin(now*5);put('logo',270,436+bob,400);rideDraw(2,940,GY+10+Math.sin(now*9)*1.5,{});btns=[];put('btn_play',620,350,110,{sx:pl,sy:pl});btns.push({r:[550,240,140,110],f:startStall});
T('DELIVERY',715,100,80,'#FFD966');T('Fresh Dudh, Happy People!',715,165,30,'#3B5BDB');T('Level 1: Opening Day',715,205,28,CR);
T('Fill bottles on the beat, ride, and hand over milk while it is fresh.',480,505,22);T('Total \u20b9'+save.money,715,28,24,'#FFD966')}
function batch(){scene(tcam,now);const q0={sx:1,sy:1};drawMan(200,GY+100,330,q0,0);inSprite(()=>armOver(0),200,GY+100,330,q0);RR(340,70,420,350,24,CR+'f2',INK,5);T('Batch ready!',550,112,44,'#3B5BDB');
const n=bottles.length;for(let i=0;i<n;i++){const row=i<5?0:1,cnt=row?n-5:Math.min(5,n),idx=row?i-5:i;put('bottle',550-(cnt-1)*31+idx*62,row?290:215,68)}
T(n+' bottles ready',550,318,26,INK);T('Starting freshness: '+sf+' ('+TN[tier(sf)]+')',550,352,26,TC[tier(sf)]);T('Tap anywhere to ride',550,392,28,CR);btns=[{r:[0,0,W,H],f:startRide}]}
function result(){scene(tcam,now);RR(230,40,500,460,26,CR+'f5',INK,5);T('Route complete!',480,82,44,'#3B5BDB');for(let i=0;i<3;i++)put('star',400+i*80,170,i<R.stars?64:48,{a:i<R.stars?1:.25});
const rows=[['Bottles sold',R.sold+' / '+cust.length],['Earned today','₹'+R.earn],['Average freshness',R.sold?R.avg:'-'],['Hearts earned',R.hearts],['Total money','₹'+save.money]];rows.forEach((r,i)=>{T(r[0],270,215+i*34,24,INK,'left');X.fillStyle='';T(String(r[1]),690,215+i*34,24,'#3B5BDB','right')});
btns=[];const ups=[['ins','Insulated crate',500],['sus','Suspension',350],['wid','Rhythm Stall',600]];ups.forEach((u,i)=>{const y=395+0,x=250+i*154,own=save.up[u[0]],can=save.money>=u[2]&&!own;pill(x,y,146,56,own?'#8FD18A':can?'#FFD966':'#A9AEB8',own?'#4E9A4A':can?'#C9A02A':'#7C818C');X.fillStyle=INK;X.font='15px "Lilita One",Impact';X.textAlign='center';X.fillText(u[1],x+73,y+20);X.fillText(own?'Owned':'₹'+u[2],x+73,y+42);btns.push({r:[x,y,146,56],f:()=>{if(can){save.money-=u[2];save.up[u[0]]=1;persist();beep(900,.2,'sine',.1)}}})});
pill(250,455,210,38,'#5B7BF0','#2A3FA0');T('Ride again',355,474,26);btns.push({r:[250,455,210,38],f:startStall});pill(480,455,230,38,CR,'#C9B88F');T('Reset progress',595,474,22,INK);btns.push({r:[480,455,230,38],f:()=>{save={money:0,rep:0,up:{ins:0,sus:0,wid:0}};persist()}});T('Upgrades',480,378,24,INK)}
// input
function pos(e){const r=C.getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]}
const inR=(p,r)=>p[0]>=r[0]&&p[0]<=r[0]+r[2]&&p[1]>=r[1]&&p[1]<=r[1]+r[3];
C.addEventListener('pointerdown',e=>{e.preventDefault();au();const p=pos(e);if(inR(p,[846,10,100,52])){if(p[0]>900){if(S=='ride')paused=!paused}else mute=!mute;return}
if(S=='ride'&&!paused){if(finShown()&&inR(p,FIN)){finish();return}for(const k in ctrl)if(inR(p,ctrl[k])){ptrs[e.pointerId]=k;if(k=='give')giveAct();return}}
else if(S=='stall')stallTap();else if(S!='ride')for(const b of btns.slice().reverse())if(inR(p,b.r)){b.f();break}
try{C.setPointerCapture(e.pointerId)}catch(x){}});
const up=e=>{delete ptrs[e.pointerId]};C.addEventListener('pointerup',up);C.addEventListener('pointercancel',up);
const KM={ArrowRight:'gas',d:'gas',D:'gas',ArrowLeft:'back',a:'back',A:'back',ArrowUp:'hop',w:'hop',W:'hop',' ':'hop'};
addEventListener('keydown',e=>{au();const k=KM[e.key];if((e.key==='p'||e.key==='Escape')&&S=='ride'){paused=!paused;return}if(S=='stall'&&(e.key==' '||e.key=='Enter')){if(!e.repeat)stallTap();e.preventDefault();return}
if(S=='batch'&&(e.key==' '||e.key=='Enter'))startRide();if(S=='title'&&(e.key==' '||e.key=='Enter'))startStall();if(S=='result'&&e.key=='Enter')startStall();if((e.key=='e'||e.key=='E'||e.key=='Enter'||e.key=='ArrowDown')&&!e.repeat)giveAct();if(k){held[k]=1;e.preventDefault()}});
addEventListener('keyup',e=>{const k=KM[e.key];if(k)held[k]=0});
// loop
let last=performance.now(),dtm=0;
function loop(t){requestAnimationFrame(loop);dtm=Math.min(.05,(t-last)/1000);last=t;now=t/1000;
if(!paused){if(S=='stall'){updStall(dtm)}else if(S=='ride')updRide(dtm);if(S=='title')bt0=bt0||t;music(performance.now());P.forEach(p=>{p.x+=p.vx*dtm;p.y+=p.vy*dtm;p.vy+=500*dtm;p.l-=dtm});P=P.filter(p=>p.l>0);FT.forEach(f=>f.l-=dtm);FT=FT.filter(f=>f.l>0);faceT-=dtm;if(faceT<=0)face='f_calm';shake=Math.max(0,shake-dtm)}
X.save();if(shake>0)X.translate(rnd(-1,1)*shake*20,rnd(-1,1)*shake*20);
if(S=='title')title();else if(S=='stall')drawStall();else if(S=='batch')batch();else if(S=='ride')drawRide();else if(S=='result')result();
if(S=='stall'||S=='batch')fx();X.restore();
chrome();if(paused){X.fillStyle='#232B4Acc';X.fillRect(0,0,W,H);T('Paused',480,250,64);T('Tap the play button or press P',480,310,26)}}
document.fonts&&document.fonts.load('20px "Lilita One"');requestAnimationFrame(loop);
