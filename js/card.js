// Card renderer. RRcard(card, {foil, mastered, count, small}) -> HTML string.
(function(){
const esc = s => String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const gems = n => '<span class="gems">'+Array.from({length:n},()=>'<i></i>').join('')+'</span>';
const raritySym = r => `<b class="rsym r${r}">${RR.RARITY[r].sym}</b>`;
const info = c => `<div class="info"><span>${c.no==='S'?'SIG':String(c.no).padStart(3,'0')+'/'+String(RR.SETS[c.set].size).padStart(3,'0')} · ${c.set}</span><span>River + Rail</span></div>`;
const typeName = {concept:'Concept',person:'Person',asset:'Asset',threat:'Threat',signature:'Signature'};

function concept(c){
  return `<div class="frame">
    <div class="namebar"><span class="nm">${esc(c.name)}</span>${gems(c.cost||0)}</div>
    <div class="artwin">${RRart(c.art)}</div>
    <div class="typeline"><span>${typeName[c.type]} · ${esc(c.sub)}</span>${raritySym(c.rarity)}</div>
    <div class="textbox"><p class="rules">${esc(c.text)}</p><hr><p class="flavor">${esc(c.flavor)}</p></div>
    ${info(c)}</div>`;
}
function person(c){
  const mv = c.moves.map(m=>`<div class="move">${gems(m.cost)}<span class="mn">${esc(m.name)}</span><span class="dmg">${esc(m.dmg)}</span>${m.text?`<p>${esc(m.text)}</p>`:''}</div>`).join('');
  return `<div class="frame">
    <div class="ptop"><span class="ptag">PERSON</span><span class="nm">${esc(c.name)}</span><span class="hp"><small>HP</small>${c.hp}</span></div>
    <div class="artwin">${RRart(c.art)}</div>
    <div class="pstrip">${esc(c.sub)} · ${raritySym(c.rarity)}</div>
    <div class="moves">${mv}</div>
    <div class="pbot"><span><small>weakness</small>${esc(c.weak)}</span><span><small>resists</small>${esc(c.resist)}</span><span><small>retreat</small>${gems(c.retreat)}</span></div>
    <p class="pflavor">${esc(c.flavor)}</p>
    ${info(c)}</div>`;
}
function threat(c){
  const stars = '<span class="lvl">'+Array.from({length:c.pwr},()=>'<i></i>').join('')+'</span>';
  return `<div class="frame">
    <div class="ynamebar"><span class="nm">${esc(c.name)}</span><span class="attr">!</span></div>
    ${stars}
    <div class="artwin">${RRart(c.art)}</div>
    <div class="ytext"><p class="ytype">[ Threat / ${esc(c.sub)} ] ${raritySym(c.rarity)}</p><p>${esc(c.text)}</p><p class="weakto">Weak to: <b>${esc(c.weakTo)}</b></p><div class="ystats"><span>PWR/${c.pwr}</span><span>RES/${c.res}</span></div></div>
    ${info(c)}</div>`;
}
function full(c){
  const tall = {tall:true};
  let panel;
  if(c.type==='person'){
    panel = c.moves.map(m=>`<div class="move">${gems(m.cost)}<span class="mn">${esc(m.name)}</span><span class="dmg">${esc(m.dmg)}</span>${m.text?`<p>${esc(m.text)}</p>`:''}</div>`).join('');
  } else {
    panel = `<p class="rules">${esc(c.learn)}</p>`;
  }
  return `<div class="frame">
    <div class="fa-bg">${RRart(c.art,{tall:true,layer:'bg'})}</div>
    <div class="fa-fg">${RRart(c.art,{tall:true,layer:'fg'})}</div>
    <div class="fa-top"><span class="nm">${esc(c.name)}</span>${c.hp?`<span class="hp"><small>HP</small>${c.hp}</span>`:`<span class="sig">✪</span>`}</div>
    <div class="fa-panel"><div class="fa-type">${typeName[c.type]} · ${esc(c.sub)} ${raritySym(c.rarity)}</div>${panel}<p class="flavor">${esc(c.flavor)}</p></div>
    ${info(c)}</div>`;
}

window.RRcard = function(c, o={}){
  const isFull = c.rarity==='L' || c.rarity==='S';
  const body = isFull ? full(c) : c.type==='person' ? person(c) : c.type==='threat' ? threat(c) : concept(c);
  const cls = ['tcg','t-'+c.type,'r-'+c.rarity, isFull?'fullart':'', o.foil?'foil':'', o.mastered?'mastered':'', o.grade?('g'+o.grade):''].join(' ');
  return `<div class="${cls}" data-id="${c.id}"><div class="tcg-in"><div class="face">${body}<div class="holo"></div><div class="glare"></div>${o.mastered?'<div class="mstamp">MASTERED</div>':''}</div></div></div>`;
};
window.RRback = function(rarity){
  return `<div class="tcg back ${rarity?'hint-'+rarity:''}"><div class="tcg-in"><div class="face"><div class="cb"><div class="cb-ring"></div><div class="cb-logo">RIVER<span>+</span>RAIL</div><div class="cb-sub">TRADING CARD GAME</div></div><div class="glare"></div></div></div></div>`;
};

// Tilt + glare. Pointer anywhere on the card; optional device motion.
window.RRtilt = function(root){
  root.querySelectorAll('.tcg').forEach(el=>{
    if(el._tilt) return; el._tilt = true;
    const set=(x,y)=>{el.style.setProperty('--mx',(x*100).toFixed(1)+'%');el.style.setProperty('--my',(y*100).toFixed(1)+'%');el.style.setProperty('--rx',((.5-y)*18).toFixed(1)+'deg');el.style.setProperty('--ry',((x-.5)*22).toFixed(1)+'deg');el.style.setProperty('--hyp',Math.min(1,Math.hypot(x-.5,y-.5)*2).toFixed(2))};
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.classList.add('live');set((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height)});
    el.addEventListener('pointerleave',()=>{el.classList.remove('live');el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
  });
};
})();
