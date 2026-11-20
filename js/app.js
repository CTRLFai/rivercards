(function(){
'use strict';
const KEY='rr-save-v1', SALT='rr-tcg-2026-groundbreaking', ALPHA='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const byId=Object.fromEntries(RR.CARDS.map(c=>[c.id,c]));
const MOD='M1', STUDY=RR.STUDY[MOD];

// ---------- state ----------
const fresh=()=>({v:1,packs:{std:1,prem:0},cards:{},capital:0,pity:0,opened:0,seen:{},cp:{},notes:{},quiz:{best:null,attempts:0,passed:false,perfect:false,missed:[]},sig:{},redeemed:[],settings:{sound:true,motion:false},created:new Date().toISOString()});
let S;
try{S=JSON.parse(localStorage.getItem(KEY))||fresh()}catch(e){S=fresh()}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
save();

function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}

// ---------- sound (synthesized, no files) ----------
let AC=null;
function ac(){if(!S.settings.sound)return null;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(e){return null}return AC}
function tone(f,t0,d,type='triangle',g=.15){const a=ac();if(!a)return;const o=a.createOscillator(),v=a.createGain();o.type=type;o.frequency.value=f;v.gain.setValueAtTime(0,a.currentTime+t0);v.gain.linearRampToValueAtTime(g,a.currentTime+t0+.01);v.gain.exponentialRampToValueAtTime(.001,a.currentTime+t0+d);o.connect(v).connect(a.destination);o.start(a.currentTime+t0);o.stop(a.currentTime+t0+d+.05)}
const SFX={
  tear(){const a=ac();if(!a)return;const n=a.sampleRate*.35,b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();f.type='bandpass';f.frequency.setValueAtTime(3000,a.currentTime);f.frequency.exponentialRampToValueAtTime(800,a.currentTime+.3);g.gain.value=.35;s.buffer=b;s.connect(f).connect(g).connect(a.destination);s.start()},
  flip(){tone(900,0,.06,'square',.05)},
  rare(){[660,880,1320].forEach((f,i)=>tone(f,i*.08,.5))},
  legend(){[523,659,784,1047,1319].forEach((f,i)=>tone(f,i*.07,1.2,'sine',.14));tone(2093,.4,1.4,'sine',.05)},
  good(){tone(784,0,.15);tone(1047,.08,.25)},bad(){tone(196,0,.3,'sawtooth',.06)}
};

// ---------- codes ----------
async function checksum(body){const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(SALT+body));const b=new Uint8Array(buf);let s='';for(let i=0;i<4;i++)s+=ALPHA[b[i]%ALPHA.length];return s}
async function redeem(raw){
  const c=raw.toUpperCase().replace(/[^A-Z0-9]/g,'').replace(/^RR/,'');
  if(c.length!==12)return {err:'That code is the wrong length. Codes look like RR-E0141A7Q-XK3P.'};
  const body=c.slice(0,8),chk=c.slice(8);
  if(await checksum(body)!==chk)return {err:'That code doesn\'t check out. Copy it again from the chat.'};
  const type=body[0],mod='M'+parseInt(body.slice(1,3),10),val=parseInt(body[3],10),nonce=body.slice(4);
  if(S.redeemed.includes(body))return {err:'Already redeemed.'};
  let msg='';
  if(type==='E'){
    if(!(val>=1&&val<=5))return {err:'Bad grade in code.'};
    const prev=S.sig[mod]||0, add=Math.max(0,val-prev);
    S.packs.std+=add; if(val>prev)S.sig[mod]=val;
    if(val===5)S.packs.prem+=1;
    msg=`${mod} exercise graded ${val}/5. `+(add?`+${add} pack${add>1?'s':''}`:'No new packs (grade not higher)')+(val===5?' + 1 Premium pack':'')+(prev?`. Signature card upgraded.`:`. Signature card unlocked.`);
  } else if(type==='F'){ S.packs.prem+=1; msg='Field mission logged. +1 Premium pack.'; }
  else if(type==='B'){ S.packs.std+=val; msg=`Bonus: +${val} pack${val>1?'s':''}.`; }
  else return {err:'Unknown code type.'};
  S.redeemed.push(body); save(); return {ok:msg};
}

// ---------- packs ----------
const pick=a=>a[Math.floor(Math.random()*a.length)];
function pull(kind){
  const set=RR.CARDS.filter(c=>c.set===MOD), by=r=>set.filter(c=>c.rarity===r);
  const god=Math.random()<RR.ODDS.godPack;
  const inPack=new Set();
  const choose=r=>{let pool=by(r).filter(c=>!S.cards[c.id]&&!inPack.has(c.id));if(!pool.length)pool=by(r).filter(c=>!inPack.has(c.id));const c=pick(pool);inPack.add(c.id);return c};
  let top='R';
  if(S.pity>=RR.ODDS.legendaryPity-1||Math.random()<.15)top='L';
  const rs=['C','C','C','U',top];
  const out=rs.map((r,i)=>{const c=choose(r);const foil=god||(kind==='prem'&&i===4)||Math.random()<RR.ODDS.foil;return {c,foil}});
  S.pity=top==='L'?0:S.pity+1; S.opened++;
  out.forEach(o=>{
    const own=S.cards[o.c.id];
    if(!own){S.cards[o.c.id]={n:1,foil:o.foil,m:false};o.isNew=true;S.seen[o.c.id]=false}
    else if(o.foil&&!own.foil){own.foil=true;own.n++;o.newFoil=true}
    else{own.n++;const g=RR.RARITY[o.c.rarity].capital*(o.foil?2:1);S.capital+=g;o.cap=g}
  });
  save(); return {cards:out,god};
}

// ---------- render: chrome ----------
function chrome(){
  const n=S.packs.std+S.packs.prem;
  $('#w-packs').textContent=n+' pack'+(n===1?'':'s');
  $('#w-cap').textContent=S.capital;
  $('#b-packs').textContent=n||'';
}
let VIEW='home';
function go(v){VIEW=v;document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));render();window.scrollTo(0,0)}
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(b)go(b.dataset.v)});

function render(){chrome();const v=$('#view');v.innerHTML=VIEWS[VIEW]();bindView(v);RRtilt(v)}
const owned=()=>RR.CARDS.filter(c=>c.set===MOD&&S.cards[c.id]);
const cpDone=()=>STUDY.readings.filter(r=>S.cp[r.id]).length;
const daysLeft=()=>Math.ceil((new Date(STUDY.target+'T23:59:00')-new Date())/864e5);

function nextAction(){
  const n=S.packs.std+S.packs.prem;
  if(n)return {t:`Open ${n} pack${n>1?'s':''}`,s:'They\'re waiting on the shelf.',go:'packs'};
  const r=STUDY.readings.find(r=>!S.cp[r.id]);
  if(r)return {t:r.title,s:'Read it, then pass the checkpoint for a pack.',go:'study'};
  if(!S.quiz.passed)return {t:'Take the Module 1 quiz',s:'7/10 earns a pack. 10/10 adds a Premium.',go:'study'};
  if(!S.sig[MOD])return {t:'Write the opportunity memo',s:'Submit it in your Module 1 chat. Redeem the code here.',go:'more'};
  return {t:'Master your cards',s:'Each card has one question. Get it right to master it.',go:'binder'};
}

const VIEWS={
home(){
  const a=nextAction(), own=owned().length, size=RR.SETS[MOD].size, dl=daysLeft();
  const feat=owned().sort((x,y)=>'LRUC'.indexOf(x.rarity)-'LRUC'.indexOf(y.rarity))[0];
  return `<div class="hero"><div><p class="eyebrow">${STUDY.title}</p><h1>Set 1: ${RR.SETS[MOD].name}</h1><p class="muted small">${dl>0?`${dl} days to target (Dec 15)`:'Target date passed'}</p></div>
  ${feat?RRcard(feat,{foil:S.cards[feat.id].foil,mastered:S.cards[feat.id].m}):RRback()}</div>
  <div class="next" data-go="${a.go}"><div><span class="eyebrow">Next</span><b>${esc(a.t)}</b><span class="muted small">${esc(a.s)}</span></div><span class="go">›</span></div>
  <div class="card-panel"><div class="row" style="justify-content:space-between"><h3>Set completion</h3><span class="eyebrow">${own}/${size}</span></div><div class="bar" style="margin-top:8px"><i style="width:${own/size*100}%"></i></div>
  <div class="stats" style="margin-top:14px"><div class="stat"><b>${cpDone()}/${STUDY.readings.length}</b><span>checkpoints</span></div><div class="stat"><b>${S.quiz.best==null?'–':S.quiz.best+'/10'}</b><span>best quiz</span></div><div class="stat"><b>${Object.values(S.cards).filter(c=>c.m).length}</b><span>mastered</span></div></div></div>
  <p class="muted small" style="text-align:center">Battles unlock around Module 3.</p>`;
},
study(){
  const steps=STUDY.readings.map((r,i)=>`<div class="step ${S.cp[r.id]?'done':''}"><div class="dot">${S.cp[r.id]?'✓':i+1}</div><div class="t"><b>${esc(r.title)}</b><a href="${r.url}" target="_blank" rel="noopener">Open reading</a></div>${S.cp[r.id]?'':`<button class="btn" data-cp="${r.id}">${r.reflect?'Reflect':'Checkpoint'}</button>`}</div>`).join('');
  return `<p class="eyebrow">${STUDY.title}</p><h1>Study</h1><p class="muted">${esc(STUDY.blurb)}</p>
  <div class="card-panel"><h3>1. Readings</h3><p class="muted small">Each checkpoint you pass earns a pack.</p>${steps}</div>
  <div class="card-panel"><h3>2. Quiz</h3><p class="muted small">10 questions from a bank of ${STUDY.quiz.length}. 7/10 earns a pack the first time; 10/10 adds a Premium pack. Best: ${S.quiz.best==null?'none yet':S.quiz.best+'/10'}.</p><button class="btn wide" data-quiz>${S.quiz.attempts?'Retake quiz':'Start quiz'}</button></div>
  <div class="card-panel"><h3>3. Exercise</h3><p class="small">${esc(STUDY.exercise)}</p><button class="btn ghost wide" data-go="more">Redeem a code</button></div>`;
},
packs(){
  const sh=[];for(let i=0;i<S.packs.prem;i++)sh.push(packHTML('prem'));for(let i=0;i<S.packs.std;i++)sh.push(packHTML('std'));
  return `<h1>Packs</h1><p class="muted">Tap a pack to open it. Swipe across the top to tear.</p>
  ${sh.length?`<div class="shelf">${sh.map((p,i)=>`<div class="packwrap" data-open="${i<S.packs.prem?'prem':'std'}">${p}</div>`).join('')}</div>`:`<div class="empty"><h3>No packs right now</h3><p>Pass a checkpoint or the quiz to earn more.</p><button class="btn" data-go="study">Go study</button></div>`}
  <p class="muted small">Opened so far: ${S.opened}. Odds are listed under More.</p>`;
},
binder(){
  const set=RR.CARDS.filter(c=>c.set===MOD);
  const cells=set.map(c=>{const o=S.cards[c.id];return o?`<div class="bthumb" data-card="${c.id}">${S.seen[c.id]===false?'<span class="new">NEW</span>':''}${RRcard(c,{foil:o.foil,mastered:o.m})}</div>`:`<div class="slot"><b>${String(c.no).padStart(3,'0')}</b>${RR.RARITY[c.rarity].sym} ${RR.RARITY[c.rarity].name}</div>`}).join('');
  const sig=RR.SIGNATURES[MOD], g=S.sig[MOD];
  const sigCell=g?`<div class="bthumb" data-card="${sig.id}">${RRcard(sig,{mastered:g===5})}</div>`:`<div class="slot"><b>SIG</b>Earned by your graded memo</div>`;
  const f=Object.values(S.cards).filter(c=>c.foil).length,m=Object.values(S.cards).filter(c=>c.m).length;
  return `<h1>Binder</h1><div class="legend"><span>${owned().length}/${set.length} collected</span><span>${f} foil</span><span>${m} mastered</span><span>Capital ${S.capital}</span></div><div class="bgrid">${cells}${sigCell}</div>`;
},
more(){
  return `<h1>More</h1>
  <div class="card-panel"><h3>Redeem a code</h3><p class="muted small">Codes come from your module chat when an exercise is graded or a field mission is logged.</p><input type="text" class="code" id="code" placeholder="RR-XXXXXXXX-XXXX" autocapitalize="characters" autocomplete="off"><div style="margin-top:10px"><button class="btn wide" id="redeem">Redeem</button></div></div>
  <div class="card-panel"><h3>Report for Claude</h3><p class="muted small">Paste this into your module chat at close so your progress file stays in sync.</p><pre class="report" id="report">${esc(report())}</pre><button class="btn ghost wide" id="copyrep">Copy report</button></div>
  <div class="card-panel"><h3>Settings</h3>
  <div class="row" style="justify-content:space-between;margin:8px 0"><span>Sound</span><button class="btn ghost" id="snd">${S.settings.sound?'On':'Off'}</button></div>
  <div class="row" style="justify-content:space-between;margin:8px 0"><span>Tilt foil with phone motion</span><button class="btn ghost" id="mot">${S.settings.motion?'On':'Off'}</button></div></div>
  <div class="card-panel"><h3>Backup</h3><p class="muted small">Your collection lives on this phone. Copy a backup now and then; paste it back to restore.</p><div class="row"><button class="btn ghost" id="bak">Copy backup</button><button class="btn ghost" id="res">Restore</button></div></div>
  <div class="card-panel odds"><h3>Pack odds</h3><ul class="small"><li>${RR.ODDS.slots}</li><li>Any card can be foil: ${Math.round(RR.ODDS.foil*100)}%.</li><li>${RR.ODDS.premium}</li><li>Legendary guaranteed by your ${RR.ODDS.legendaryPity}th pack without one.</li><li>No duplicates of a rarity until you own every card of that rarity. Duplicates turn into Capital (C 5, U 10, R 25, L 100; double if foil).</li><li>All-foil pack: ${Math.round(RR.ODDS.godPack*100)}%.</li></ul></div>`;
}};

function packHTML(kind){
  return `<div class="pack ${kind}"><div class="pk-crimp t"></div><div class="pk-top"></div><div class="pk-art">${RRart('laser')}</div><div class="pk-foil"></div><div class="pk-title">${kind==='prem'?'PREMIUM':'GROUNDBREAKING'}<small>RIVER + RAIL · SET 1</small></div><div class="pk-crimp b"></div></div>`;
}

function report(){
  const r=STUDY.readings.filter(r=>S.cp[r.id]).map(r=>r.title);
  const notes=Object.entries(S.notes).map(([k,v])=>`- ${STUDY.readings.find(r=>r.id===k)?.title}: ${v}`).join('\n');
  return `River + Rail app report (${new Date().toISOString().slice(0,10)})
${MOD} checkpoints: ${cpDone()}/${STUDY.readings.length}
${MOD} quiz: best ${S.quiz.best==null?'not taken':S.quiz.best+'/10'}, attempts ${S.quiz.attempts}
Missed on best attempt:
${S.quiz.missed.length?S.quiz.missed.map(m=>'- '+m).join('\n'):'- none'}
Cards: ${owned().length}/${RR.SETS[MOD].size}, mastered ${Object.values(S.cards).filter(c=>c.m).length}, packs opened ${S.opened}
Signature: ${S.sig[MOD]?S.sig[MOD]+'/5':'not yet'}
${notes?'Reflections:\n'+notes:''}`;
}

function bindView(v){
  v.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  v.querySelectorAll('[data-cp]').forEach(b=>b.onclick=()=>checkpoint(b.dataset.cp));
  v.querySelectorAll('[data-quiz]').forEach(b=>b.onclick=()=>quiz());
  v.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openPack(b.dataset.open));
  v.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>detail(b.dataset.card));
  const R=v.querySelector('#redeem');if(R)R.onclick=async()=>{const r=await redeem($('#code').value);if(r.err){SFX.bad();toast(r.err)}else{SFX.good();toast(r.ok);render()}};
  const C=v.querySelector('#copyrep');if(C)C.onclick=()=>copy(report(),'Report copied');
  const sn=v.querySelector('#snd');if(sn)sn.onclick=()=>{S.settings.sound=!S.settings.sound;save();render()};
  const mo=v.querySelector('#mot');if(mo)mo.onclick=async()=>{if(!S.settings.motion&&window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission){try{const p=await DeviceOrientationEvent.requestPermission();if(p!=='granted'){toast('Motion not allowed');return}}catch(e){toast('Motion not available');return}}S.settings.motion=!S.settings.motion;save();render()};
  const bk=v.querySelector('#bak');if(bk)bk.onclick=()=>copy(btoa(unescape(encodeURIComponent(JSON.stringify(S)))),'Backup copied');
  const rs=v.querySelector('#res');if(rs)rs.onclick=()=>restore();
}
function copy(t,msg){navigator.clipboard.writeText(t).then(()=>toast(msg),()=>toast('Copy blocked. Select the text and copy it.'))}

// ---------- overlays ----------
function overlay(html,cls=''){const L=$('#layer');L.innerHTML=`<div class="ov ${cls}"><button class="close" aria-label="Close">✕</button>${html}</div>`;L.querySelector('.close').onclick=closeOv;document.body.style.overflow='hidden';return L.firstElementChild}
function closeOv(){$('#layer').innerHTML='';document.body.style.overflow='';stopMotion();render()}

function restore(){
  const o=overlay(`<h2>Restore backup</h2><p class="muted">Paste a backup you copied earlier. This replaces your current collection.</p><textarea id="bk"></textarea><div style="margin-top:12px;width:100%"><button class="btn wide" id="go">Restore</button></div>`);
  o.querySelector('#go').onclick=()=>{try{const d=JSON.parse(decodeURIComponent(escape(atob(o.querySelector('#bk').value.trim()))));if(!d||d.v!==1)throw 0;S=d;save();toast('Restored');closeOv()}catch(e){toast('That backup didn\'t read. Copy it again.')}};
}

// Checkpoint: all questions right to pass; reflect checkpoints need a written takeaway.
function checkpoint(id){
  const r=STUDY.readings.find(x=>x.id===id);
  if(r.reflect){
    const o=overlay(`<div class="quiz"><p class="eyebrow">Reflection checkpoint</p><h2 style="text-align:left">${esc(r.title)}</h2><p>In a sentence or two: what from this chapter will you use for River + Rail?</p><textarea id="note" placeholder="Write it in your own words"></textarea><p class="muted small">At least 60 characters. It goes into your report for Claude.</p><button class="btn wide" id="go">Submit</button></div>`);
    o.querySelector('#go').onclick=()=>{const t=o.querySelector('#note').value.trim();if(t.length<60){SFX.bad();toast('A bit more, please (60+ characters)');return}S.notes[id]=t;S.cp[id]=true;S.packs.std++;save();SFX.good();toast('Checkpoint passed. +1 pack');closeOv()};
    return;
  }
  runQuestions(r.qs,`Checkpoint`,r.title,(score,total)=>{
    if(score===total){S.cp[id]=true;S.packs.std++;save();return {msg:'All correct. +1 pack.',ok:true}}
    return {msg:`${score}/${total}. You need all ${total}. Skim the chapter again and retry.`,ok:false};
  });
}

function quiz(){
  const qs=[...STUDY.quiz].sort(()=>Math.random()-.5).slice(0,10);
  runQuestions(qs,'Module 1 quiz','10 questions',(score,total,missed)=>{
    S.quiz.attempts++;
    let msg=`${score}/${total}.`;
    if(S.quiz.best==null||score>S.quiz.best){S.quiz.best=score;S.quiz.missed=missed}
    if(score>=7&&!S.quiz.passed){S.quiz.passed=true;S.packs.std++;msg+=' Passed: +1 pack.'}
    if(score===10&&!S.quiz.perfect){S.quiz.perfect=true;S.packs.prem++;msg+=' Perfect: +1 Premium pack.'}
    if(score<7)msg+=' You need 7 to pass. Retake any time.';
    save();return {msg,ok:score>=7};
  });
}

function runQuestions(qs,label,title,done){
  let i=0,score=0;const res=[],missed=[];
  const o=overlay(`<div class="quiz" id="qz"></div>`);
  const box=o.querySelector('#qz');
  const show=()=>{
    if(i>=qs.length){const r=done(score,qs.length,missed);box.innerHTML=`<p class="eyebrow">${esc(label)}</p><h2 style="text-align:left">${r.ok?'Nice work':'Not yet'}</h2><p class="feedback">${esc(r.msg)}</p><button class="btn wide" id="fin">${r.ok&&(S.packs.std+S.packs.prem)?'Open packs':'Done'}</button>`;(r.ok?SFX.good:SFX.bad)();box.querySelector('#fin').onclick=()=>{const has=r.ok&&(S.packs.std+S.packs.prem);closeOv();if(has)go('packs')};return}
    const [q,opts,ans]=qs[i];
    box.innerHTML=`<p class="eyebrow">${esc(label)} · ${esc(title)}</p><div class="qprog">${qs.map((_,k)=>`<i class="${k<i?(res[k]?'ok':'no'):k===i?'cur':''}"></i>`).join('')}</div><div class="qtext">${esc(q)}</div>${opts.map((t,k)=>`<button class="opt" data-k="${k}">${esc(t)}</button>`).join('')}<div class="feedback" id="fb"></div>`;
    box.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
      if(box.dataset.lock)return;box.dataset.lock=1;
      const k=+b.dataset.k,ok=k===ans;res[i]=ok;if(ok){score++;SFX.good()}else{SFX.bad();missed.push(q+' (answer: '+opts[ans]+')')}
      box.querySelectorAll('.opt')[ans].classList.add('right');if(!ok)b.classList.add('wrong');
      box.querySelector('#fb').innerHTML=`${ok?'<b>Right.</b>':'<b>Not quite.</b> The answer is: '+esc(opts[ans])}<div style="margin-top:12px"><button class="btn wide" id="nx">${i+1<qs.length?'Next':'Finish'}</button></div>`;
      box.querySelector('#nx').onclick=()=>{delete box.dataset.lock;i++;show()};
    });
  };
  show();
}

// Card detail: big card, meaning, upgrades.
let motionH=null;
function startMotion(el){if(!S.settings.motion)return;motionH=e=>{const x=Math.max(0,Math.min(1,.5+(e.gamma||0)/50)),y=Math.max(0,Math.min(1,.5+((e.beta||0)-45)/50));el.classList.add('live');el.style.setProperty('--mx',x*100+'%');el.style.setProperty('--my',y*100+'%');el.style.setProperty('--ry',(x-.5)*20+'deg');el.style.setProperty('--rx',(.5-y)*16+'deg')};window.addEventListener('deviceorientation',motionH)}
function stopMotion(){if(motionH)window.removeEventListener('deviceorientation',motionH);motionH=null}
function detail(id){
  const sig=Object.values(RR.SIGNATURES).find(s=>s.id===id);
  const c=sig||byId[id],o=sig?{foil:false,m:S.sig[MOD]===5}:S.cards[id];
  if(!sig){S.seen[id]=true;save()}
  const R=RR.RARITY[c.rarity];
  const up=sig?'':`<div class="row" style="margin-top:12px">${o.foil?'':`<button class="btn gold" id="foil" ${S.capital<R.foilCost?'disabled':''}>Foil it · ${R.foilCost}</button>`}${o.m?'':`<button class="btn" id="mast">Master it</button>`}</div>`;
  const ov=overlay(`<div class="detail">${RRcard(c,{foil:o.foil,mastered:o.m||(sig&&S.sig[MOD]===5)})}</div><div class="learn card-panel"><span class="eyebrow">${R.name}${o.foil?' · Foil':''}${o.m?' · Mastered':''}</span><h3 style="margin-top:4px">What it means</h3><p>${esc(c.learn)}</p>${sig?`<p class="muted small">Grade ${S.sig[MOD]}/5. A 5/5 adds the mastered rim.</p>`:''}${up}</div>`);
  RRtilt(ov);const el=ov.querySelector('.tcg');startMotion(el);
  const F=ov.querySelector('#foil');if(F)F.onclick=()=>{if(S.capital<R.foilCost)return;S.capital-=R.foilCost;o.foil=true;save();SFX.rare();closeOv();detail(id)};
  const M=ov.querySelector('#mast');if(M)M.onclick=()=>{
    const [q,opts,ans]=c.q;const box=ov.querySelector('.learn');
    box.innerHTML=`<span class="eyebrow">Mastery question</span><div class="qtext" style="margin-top:6px">${esc(q)}</div>${opts.map((t,k)=>`<button class="opt" data-k="${k}">${esc(t)}</button>`).join('')}`;
    box.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const ok=+b.dataset.k===ans;box.querySelectorAll('.opt')[ans].classList.add('right');if(ok){o.m=true;S.capital+=5;save();SFX.legend();toast('Mastered. +5 Capital');setTimeout(()=>{closeOv();detail(id)},700)}else{b.classList.add('wrong');SFX.bad();toast('Not yet. Read the card and try again later.')}});
  };
}

// ---------- pack opening ----------
function openPack(kind){
  if(!S.packs[kind])return;
  const ov=overlay(`<h2>${kind==='prem'?'Premium pack':'Set 1: Groundbreaking'}</h2><div class="stage" id="stg"><div class="tear-hint">Swipe across the top to tear it open</div><div class="packwrap" id="pk">${packHTML(kind)}<div class="tearline" id="tl"></div></div></div><div class="rarity-label" id="rl"></div><div class="tapnote" id="tn"></div>`);
  ov.querySelector('.close').onclick=()=>{closeOv()};
  const pk=ov.querySelector('#pk'),tl=ov.querySelector('#tl');let sx=null,torn=false;
  const doTear=()=>{if(torn)return;torn=true;S.packs[kind]--;const res=pull(kind);save();SFX.tear();pk.querySelector('.pack').classList.add('torn');pk.classList.add('torn');ov.querySelector('.tear-hint').remove();setTimeout(()=>reveal(ov,res,kind),900)};
  pk.addEventListener('pointerdown',e=>{const r=pk.getBoundingClientRect();if(e.clientY-r.top<r.height*.35){sx=e.clientX;pk.setPointerCapture(e.pointerId)}});
  pk.addEventListener('pointermove',e=>{if(sx==null||torn)return;const r=pk.getBoundingClientRect(),d=Math.abs(e.clientX-sx);tl.style.width=Math.min(100,d/r.width*100)+'%';tl.style.left=(Math.min(e.clientX,sx)-r.left)+'px';if(d>r.width*.55)doTear()});
  pk.addEventListener('pointerup',()=>{sx=null;if(!torn)tl.style.width=0});
  setTimeout(()=>{const n=ov.querySelector('#tn');if(n&&!torn){n.innerHTML='<button class="btn ghost" id="tap">Or tap here to tear</button>';n.querySelector('#tap').onclick=doTear}},4000);
}

function reveal(ov,res,kind){
  const stg=ov.querySelector('#stg'),rl=ov.querySelector('#rl'),tn=ov.querySelector('#tn');
  const cards=res.cards;
  stg.innerHTML=`<div class="stack" id="st"></div>`;
  const st=stg.querySelector('#st');
  // build back-to-front so card 0 is on top
  cards.slice().reverse().forEach((o,ri)=>{const i=cards.length-1-ri;const hint=o.c.rarity==='L'?'L':o.c.rarity==='R'?'R':'';
    st.insertAdjacentHTML('beforeend',`<div class="fc rise" data-i="${i}" style="animation-delay:${ri*60}ms"><div class="burst ${o.c.rarity}"></div><div class="rays"></div><div class="side back-s">${RRback(i===cards.length-1?hint:'')}</div><div class="side front">${RRcard(o.c,{foil:o.foil,mastered:S.cards[o.c.id].m})}</div></div>`)});
  RRtilt(st);
  let i=0,flipped=false;
  tn.textContent=res.god?'ALL-FOIL PACK! Tap to reveal':'Tap to reveal';
  const label=o=>{const r=o.c.rarity;rl.className='rarity-label '+(r==='L'?'L':r==='R'?'R':o.foil?'F':'');rl.textContent=(r==='L'?'LEGENDARY':r==='R'?'RARE':'')+(o.foil?(r==='L'||r==='R'?' · FOIL':'FOIL'):'')+(o.isNew?'  NEW':o.cap?`  +${o.cap} Capital`:'')};
  st.onclick=()=>{
    const el=st.querySelector(`.fc[data-i="${i}"]`);if(!el)return;
    const o=cards[i];
    if(!flipped){flipped=true;el.classList.remove('rise');el.classList.add('half');SFX.flip();setTimeout(()=>{el.classList.add('shown');el.classList.remove('half')},170);label(o);
      if(o.c.rarity==='L'){el.querySelector('.burst').classList.add('go');el.querySelector('.rays').classList.add('go');SFX.legend()}
      else if(o.c.rarity==='R'||o.foil){el.querySelector('.burst').classList.add('go');SFX.rare()}
      tn.textContent=i<cards.length-1?'Tap for the next card':'Tap to see your pull';return}
    flipped=false;el.classList.add('gone');i++;rl.textContent='';
    if(i>=cards.length){setTimeout(()=>summary(ov,res,kind),300)} else tn.textContent='Tap to reveal';
  };
}

function summary(ov,res,kind){
  const more=S.packs.std+S.packs.prem;
  ov.innerHTML=`<button class="close" aria-label="Close">✕</button><h2>Your pull</h2><div class="summary">${res.cards.map(o=>`<div class="item" data-card="${o.c.id}">${RRcard(o.c,{foil:o.foil})}<span class="tag ${o.isNew?'new':o.newFoil?'foil':'dup'}">${o.isNew?'NEW':o.newFoil?'NEW FOIL':'+'+o.cap}</span></div>`).join('')}</div>
  <p class="muted small" style="text-align:center">${owned().length}/${RR.SETS[MOD].size} collected · Capital ${S.capital}</p>
  <div class="row" style="width:100%;max-width:420px">${more?`<button class="btn wide" id="again">Open another (${more} left)</button>`:''}<button class="btn ghost wide" id="bind">See binder</button></div>`;
  RRtilt(ov);
  ov.querySelector('.close').onclick=closeOv;
  const a=ov.querySelector('#again');if(a)a.onclick=()=>{closeOv();openPack(S.packs.prem?'prem':'std')};
  ov.querySelector('#bind').onclick=()=>{closeOv();go('binder')};
}

// ---------- boot ----------
go('home');
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
})();
