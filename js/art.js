// Procedural SVG card art. Each scene = backdrop + subject + light effects.
// art(key, opts) returns an <svg> string. opts.tall for full-art cards, opts.layer 'bg' | 'fg' | 'all'.
(function(){
let N = 0;
const W = 300;

function defs(u){
  return `<defs>
  <filter id="${u}g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="${u}G" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="10"/></filter>
  <filter id="${u}n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .35 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <filter id="${u}r" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="4" seed="3"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .25  0 0 0 0 .08  0 0 0 1.4 -.45"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <linearGradient id="${u}steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa7b1"/><stop offset=".5" stop-color="#5d6a74"/><stop offset="1" stop-color="#2c353c"/></linearGradient>
  <linearGradient id="${u}cy" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7ff6ff" stop-opacity="0"/><stop offset=".2" stop-color="#7ff6ff"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
  <radialGradient id="${u}warm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>
  <radialGradient id="${u}cool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#8ff7ff" stop-opacity=".95"/><stop offset="1" stop-color="#18c6d9" stop-opacity="0"/></radialGradient>
  <radialGradient id="${u}red" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff5a4a" stop-opacity=".9"/><stop offset="1" stop-color="#7a0b0b" stop-opacity="0"/></radialGradient>
  <radialGradient id="${u}gold" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2b0"/><stop offset=".5" stop-color="#ffcf4a" stop-opacity=".7"/><stop offset="1" stop-color="#c98a12" stop-opacity="0"/></radialGradient>
  </defs>`;
}

// ---------- backdrops ----------
function sky(u,H,top,mid,bot){
  return `<linearGradient id="${u}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset=".6" stop-color="${mid}"/><stop offset="1" stop-color="${bot}"/></linearGradient><rect width="${W}" height="${H}" fill="url(#${u}sky)"/>`;
}
function river(u,H){
  const h = H*.62;
  let s = sky(u,H,'#0b1f3a','#c4532a','#f6a04d');
  s += `<circle cx="210" cy="${h-22}" r="30" fill="#ffd9a0" opacity=".9"/><circle cx="210" cy="${h-22}" r="70" fill="url(#${u}warm)" opacity=".6"/>`;
  // skyline + bridge (Jacksonville-ish, generic)
  s += `<g fill="#14202c">`;
  [[18,40],[40,62],[64,34],[84,78],[104,50],[122,92],[140,58],[160,40],[248,46],[266,70],[284,38]].forEach(([x,hh])=>s+=`<rect x="${x}" y="${h-hh}" width="18" height="${hh}"/>`);
  s += `</g><path d="M0 ${h-18} Q75 ${h-58} 150 ${h-18} T300 ${h-18}" stroke="#1d2b38" stroke-width="5" fill="none"/>`;
  for(let x=10;x<300;x+=22) s+=`<line x1="${x}" y1="${h-18}" x2="${x}" y2="${h-18-Math.max(0,38-Math.abs(150-((x%150)*2))/4)}" stroke="#1d2b38" stroke-width="2"/>`;
  s += `<rect y="${h}" width="${W}" height="${H-h}" fill="#0e2a3a"/>`;
  for(let i=0;i<9;i++){const y=h+6+i*((H-h)/9);s+=`<rect x="${180+Math.sin(i)*14}" y="${y}" width="${60-i*4}" height="2" fill="#ffc77a" opacity="${.7-i*.06}"/>`}
  return s;
}
function shop(u,H){
  let s = sky(u,H,'#1a1410','#2a1d14','#120d0a');
  s += `<rect x="0" y="0" width="${W}" height="${H*.18}" fill="#0d0a08"/>`;
  for(let x=0;x<W;x+=60) s+=`<rect x="${x}" y="0" width="8" height="${H}" fill="#0f0c0a" opacity=".7"/>`;
  s += `<rect x="20" y="${H*.08}" width="120" height="${H*.3}" fill="#3b4a55" opacity=".35"/><rect x="24" y="${H*.08}" width="112" height="${H*.3}" fill="url(#${u}cool)" opacity=".15"/>`;
  s += `<ellipse cx="150" cy="${H*.2}" rx="160" ry="${H*.25}" fill="url(#${u}warm)" opacity=".35"/>`;
  s += `<rect y="${H*.8}" width="${W}" height="${H*.2}" fill="#0b0907"/><rect y="${H*.8}" width="${W}" height="3" fill="#4a3a2a" opacity=".6"/>`;
  return s;
}
function voidbg(u,H,c1,c2){
  let s = sky(u,H,c1,c2,'#05070a');
  s += `<g stroke="${c2}" stroke-opacity=".18">`;
  for(let x=0;x<=W;x+=25) s+=`<line x1="${x}" y1="${H*.55}" x2="${150+(x-150)*3}" y2="${H}"/>`;
  for(let i=0;i<6;i++){const y=H*.55+Math.pow(i/6,1.6)*H*.45;s+=`<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`}
  s += `</g>`;
  for(let i=0;i<26;i++){s+=`<circle cx="${(i*97)%W}" cy="${(i*53)%(H*.5)}" r="${(i%3)*.6+.4}" fill="#fff" opacity="${.2+(i%4)*.15}"/>`}
  return s;
}
function storm(u,H){
  let s = sky(u,H,'#0a0607','#3a0d10','#12080a');
  s += `<ellipse cx="150" cy="${H*.45}" rx="170" ry="${H*.35}" fill="url(#${u}red)" opacity=".55"/>`;
  for(let i=0;i<7;i++){s+=`<ellipse cx="${i*55-10}" cy="${20+(i%3)*14}" rx="70" ry="26" fill="#150a0c" opacity=".85"/>`}
  s += `<path d="M230 20 L214 70 L228 70 L206 130" stroke="#ffb3a0" stroke-width="2.5" fill="none" filter="url(#${u}g)"/>`;
  s += `<rect y="${H*.82}" width="${W}" height="${H*.18}" fill="#080405"/>`;
  return s;
}
function rail(u,H){
  let s = sky(u,H,'#0d1b2a','#3b5a7a','#d98a52');
  const hz=H*.5;
  s += `<rect y="${hz}" width="${W}" height="${H-hz}" fill="#1b1d20"/>`;
  s += `<path d="M150 ${hz} L40 ${H} M150 ${hz} L110 ${H} M150 ${hz} L190 ${H} M150 ${hz} L260 ${H}" stroke="#8a8f96" stroke-width="3"/>`;
  for(let i=1;i<10;i++){const t=Math.pow(i/10,1.7),y=hz+t*(H-hz),hw=t*120;s+=`<line x1="${150-hw}" y1="${y}" x2="${150+hw}" y2="${y}" stroke="#3a2d22" stroke-width="${1+t*6}"/>`}
  s += `<g fill="#151a20"><rect x="30" y="${hz-70}" width="14" height="70"/><rect x="250" y="${hz-70}" width="14" height="70"/><rect x="24" y="${hz-78}" width="246" height="12"/></g>`;
  return s;
}

// ---------- subject helpers ----------
const person = (x,y,s,fill,extra='') => `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}">${extra}<circle cx="0" cy="-58" r="13"/><path d="M-26 0 L-22 -36 Q-20 -44 -10 -45 L10 -45 Q20 -44 22 -36 L26 0 Z"/><rect x="-18" y="-2" width="14" height="40"/><rect x="4" y="-2" width="14" height="40"/></g>`;
function sparks(u,x,y,n,color,spread,len){
  let s=`<g stroke="${color}" stroke-linecap="round" filter="url(#${u}g)">`;
  for(let i=0;i<n;i++){const a=(-spread/2+spread*i/n)*Math.PI/180 + Math.sin(i*7)*.2;const l=len*(.5+((i*37)%50)/100);s+=`<line x1="${x}" y1="${y}" x2="${x+Math.cos(a)*l}" y2="${y+Math.sin(a)*l}" stroke-width="${1+(i%3)*.5}" opacity="${.6+(i%4)*.1}"/>`}
  return s+'</g>';
}
function rustPlate(u,x,y,w,h,cleanFrac){
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#7d4a2a"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#b5652e" filter="url(#${u}r)"/>
  <rect x="${x}" y="${y}" width="${w*cleanFrac}" height="${h}" fill="url(#${u}steel)"/><rect x="${x}" y="${y}" width="${w*cleanFrac}" height="${h}" fill="#fff" opacity=".08"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#000" stroke-opacity=".5"/>`;
}
function coin(u,x,y,r){
  return `<g transform="translate(${x} ${y})"><ellipse rx="${r}" ry="${r*.32}" cy="${r*.14}" fill="#8a5a0e"/><ellipse rx="${r}" ry="${r*.32}" fill="#ffcf4a"/><ellipse rx="${r*.7}" ry="${r*.2}" fill="none" stroke="#c98a12" stroke-width="1.5"/></g>`;
}

// ---------- scenes ----------
const S = {
  demand(u,H){ let s=voidbg(u,H,'#06222b','#18c6d9');
    s+=`<circle cx="150" cy="${H*.32}" r="60" fill="url(#${u}cool)" opacity=".7"/>`+coin(u,150,H*.32,30)+`<text x="150" y="${H*.32+8}" font-size="26" font-weight="800" text-anchor="middle" fill="#8a5a0e" font-family="Georgia">$</text>`;
    [[60,.95],[105,1.1],[150,1.2],[195,1.1],[240,.95]].forEach(([x,sc],i)=>{s+=person(x,H*.98,sc,'#0a1418');s+=`<line x1="${x+12*sc}" y1="${H*.98-50*sc}" x2="${x+20*sc}" y2="${H*.98-90*sc}" stroke="#0a1418" stroke-width="${8*sc}" stroke-linecap="round"/>`});
    return s; },
  size(u,H){ let s=river(u,H); const h=H*.62;
    for(let i=0;i<14;i++){const x=10+i*21,y=h+12+(i%3)*12;s+=`<path d="M${x} ${y} l18 0 l-4 6 l-10 0 z" fill="#0a141c"/><line x1="${x+9}" y1="${y}" x2="${x+9}" y2="${y-14}" stroke="#0a141c" stroke-width="1.5"/>`}
    return s; },
  margins(u,H){ let s=shop(u,H);
    s+=`<path d="M70 ${H*.82} L230 ${H*.82} L215 ${H*.68} L85 ${H*.68} Z" fill="#2b2f33"/><rect x="100" y="${H*.6}" width="100" height="${H*.08}" fill="#3a4046"/>`;
    for(let i=0;i<7;i++) s+=coin(u,150,H*.58-i*9,24);
    s+=`<path d="M60 ${H*.5} L110 ${H*.38} L140 ${H*.44} L220 ${H*.18}" stroke="#7dffb0" stroke-width="5" fill="none" filter="url(#${u}g)"/><path d="M220 ${H*.18} l-18 2 l12 13 z" fill="#7dffb0"/>`;
    return s; },
  pain(u,H){ let s=voidbg(u,H,'#2a0808','#ff5a4a');
    for(let i=1;i<5;i++) s+=`<circle cx="150" cy="${H*.48}" r="${i*24}" fill="none" stroke="#ff5a4a" stroke-opacity="${.5-i*.1}" stroke-width="3"/>`;
    s+=rustPlate(u,95,H*.3,110,H*.36,0)+`<circle cx="150" cy="${H*.48}" r="18" fill="#5a3218"/><path d="M150 ${H*.48} l-30 -20 M150 ${H*.48} l26 24 M150 ${H*.48} l34 -12" stroke="#1a0a05" stroke-width="2"/>`;
    return s; },
  secondary(u,H){ let s=voidbg(u,H,'#0a1530','#5a8cff');
    const c=['#c94b3a','#2f6db5','#d9a521','#3a8f6a','#7a4bb5'];
    c.forEach((col,i)=>{s+=`<rect x="${70+i*8}" y="${H*.78-i*22}" width="150" height="20" rx="2" fill="${col}"/><rect x="${70+i*8}" y="${H*.78-i*22}" width="150" height="4" fill="#fff" opacity=".2"/>`});
    s+=`<g transform="translate(180 ${H*.12})"><rect width="90" height="70" fill="#f4f2ec" rx="3"/><rect x="10" y="40" width="12" height="22" fill="#2f6db5"/><rect x="28" y="28" width="12" height="34" fill="#2f6db5"/><rect x="46" y="18" width="12" height="44" fill="#2f6db5"/><rect x="64" y="34" width="12" height="28" fill="#2f6db5"/></g>`;
    return s; },
  side(u,H){ let s=sky(u,H,'#050a18','#101c3a','#1c2240');
    for(let i=0;i<30;i++) s+=`<circle cx="${(i*71)%W}" cy="${(i*37)%(H*.5)}" r=".9" fill="#fff" opacity=".7"/>`;
    s+=`<circle cx="240" cy="${H*.2}" r="18" fill="#f4f0d8"/><circle cx="248" cy="${H*.18}" r="16" fill="#101c3a"/>`;
    s+=`<path d="M30 ${H*.62} L110 ${H*.36} L190 ${H*.62} Z" fill="#0b1020"/><rect x="45" y="${H*.62}" width="130" height="${H*.3}" fill="#0f1528"/>`;
    s+=`<rect x="160" y="${H*.55}" width="110" height="${H*.37}" fill="#0b1020"/><rect x="172" y="${H*.64}" width="86" height="${H*.28}" fill="#ffcf7a"/><rect x="172" y="${H*.64}" width="86" height="${H*.28}" fill="url(#${u}cool)" opacity=".6"/>`;
    s+=`<rect x="70" y="${H*.68}" width="22" height="18" fill="#ffd98a"/>`;
    s+=person(215,H*.92,.6,'#0b1020')+sparks(u,232,H*.8,10,'#9ff7ff',140,22);
    return s; },
  welder(u,H){ let s=shop(u,H);
    s+=`<circle cx="190" cy="${H*.62}" r="80" fill="url(#${u}cool)" opacity=".8"/>`;
    s+=`<rect x="110" y="${H*.7}" width="170" height="10" fill="#4a535b"/><rect x="150" y="${H*.56}" width="120" height="${H*.14}" fill="url(#${u}steel)"/>`;
    s+=`<g transform="translate(110 ${H*.98}) scale(1.6)" fill="#0c0a09"><path d="M-14 -70 h28 v24 h-28z"/><rect x="-10" y="-62" width="20" height="6" fill="#18c6d9" opacity=".8"/><path d="M-26 0 L-22 -36 Q-20 -44 -10 -45 L10 -45 Q20 -44 22 -36 L26 0 Z"/><path d="M18 -38 L52 -30 L54 -24 L20 -28 Z"/></g>`;
    s+=sparks(u,196,H*.62,26,'#fff3c4',360,46)+`<circle cx="196" cy="${H*.62}" r="7" fill="#fff" filter="url(#${u}g)"/>`;
    return s; },
  wirewheel(u,H){ let s=shop(u,H);
    s+=rustPlate(u,40,H*.62,220,H*.18,.25);
    s+=`<g transform="translate(150 ${H*.42}) rotate(-20)"><rect x="-70" y="-14" width="110" height="28" rx="10" fill="#2a6db5"/><rect x="-70" y="-14" width="110" height="8" rx="4" fill="#fff" opacity=".2"/><rect x="40" y="-10" width="18" height="20" fill="#333"/><circle cx="62" cy="22" r="26" fill="#6b6b6b"/>`;
    for(let i=0;i<36;i++){const a=i*10*Math.PI/180;s+=`<line x1="62" y1="22" x2="${62+Math.cos(a)*30}" y2="${22+Math.sin(a)*30}" stroke="#aaa" stroke-width=".8"/>`}
    s+=`</g>`+sparks(u,190,H*.62,30,'#ffb347',120,70);
    return s; },
  primary(u,H){ let s=shop(u,H);
    s+=person(90,H*.95,1.3,'#0c0a09')+person(215,H*.95,1.25,'#14100c');
    s+=`<g filter="url(#${u}g)"><rect x="40" y="${H*.12}" width="100" height="44" rx="12" fill="#18c6d9"/><path d="M70 ${H*.12+44} l8 14 l10 -14z" fill="#18c6d9"/><rect x="165" y="${H*.2}" width="100" height="44" rx="12" fill="#f4f2ec"/><path d="M230 ${H*.2+44} l-6 14 l-10 -14z" fill="#f4f2ec"/></g>`;
    s+=`<g fill="#05222a"><rect x="54" y="${H*.12+12}" width="70" height="5"/><rect x="54" y="${H*.12+24}" width="50" height="5"/></g><g fill="#3a3a3a"><rect x="179" y="${H*.2+12}" width="72" height="5"/><rect x="179" y="${H*.2+24}" width="44" height="5"/></g>`;
    return s; },
  destruction(u,H){ let s=storm(u,H);
    s+=`<g transform="translate(150 ${H*.55})"><rect x="-70" y="-60" width="140" height="110" fill="#5a5f63"/><rect x="-55" y="-45" width="110" height="50" fill="#2a2f33"/><circle cx="-25" cy="25" r="10" fill="#111"/><circle cx="25" cy="25" r="10" fill="#111"/></g>`;
    s+=`<path d="M150 ${H*.15} L138 ${H*.45} L160 ${H*.5} L140 ${H*.9}" stroke="#9ff7ff" stroke-width="5" fill="none" filter="url(#${u}g)"/>`;
    for(let i=0;i<10;i++){s+=`<path d="M${150+Math.cos(i)*40} ${H*.5+Math.sin(i*2)*30} l${Math.cos(i*3)*30} ${Math.sin(i*5)*30} l8 4z" fill="#8a9096" opacity=".9"/>`}
    s+=`<circle cx="150" cy="${H*.5}" r="50" fill="url(#${u}cool)"/>`;
    return s; },
  boatyard(u,H){ let s=river(u,H);
    s+=`<rect x="0" y="${H*.78}" width="${W}" height="${H*.22}" fill="#3a3530"/>`;
    s+=`<path d="M50 ${H*.62} Q150 ${H*.86} 260 ${H*.62} L240 ${H*.5} L70 ${H*.5} Z" fill="#e8e4da"/><path d="M50 ${H*.62} Q150 ${H*.86} 260 ${H*.62} L254 ${H*.6} Q150 ${H*.8} 56 ${H*.6} Z" fill="#b5652e"/><rect x="70" y="${H*.5}" width="170" height="6" fill="#1d4f8f"/>`;
    s+=`<g stroke="#2a2520" stroke-width="5"><line x1="100" y1="${H*.7}" x2="90" y2="${H*.8}"/><line x1="200" y1="${H*.7}" x2="210" y2="${H*.8}"/></g>`;
    s+=person(40,H*.98,.9,'#0d0b09');
    return s; },
  lowsales(u,H){ let s=storm(u,H);
    s+=`<g transform="translate(150 ${H*.52})"><rect x="-44" y="-70" width="88" height="150" rx="14" fill="#14161a" stroke="#555" stroke-width="3"/><rect x="-36" y="-56" width="72" height="110" fill="#1d2b38"/>`;
    s+=`<path d="M-30 20 L-12 20 L-6 -10 L4 40 L10 20 L30 20" stroke="#ff5a4a" stroke-width="3" fill="none" filter="url(#${u}g)"/><text x="0" y="-22" font-size="28" text-anchor="middle" fill="#ff5a4a" font-family="Arial" font-weight="700">0</text></g>`;
    return s; },
  capital(u,H){ let s=storm(u,H);
    s+=`<g transform="translate(150 ${H*.5})"><circle r="56" fill="#8a5a0e"/><circle r="50" fill="#d9a521"/><circle r="38" fill="none" stroke="#8a5a0e" stroke-width="3"/><path d="M-10 -56 L6 -18 L-8 4 L10 30 L-2 56" stroke="#120808" stroke-width="5" fill="none"/></g>`;
    for(let i=0;i<5;i++) s+=coin(u,40+i*55,H*.88+(i%2)*6,10);
    return s; },
  triad(u,H){ let s=voidbg(u,H,'#06222b','#18c6d9');
    const cy=H*.46,r=56;
    [[118,cy-18,'#18c6d9'],[182,cy-18,'#ffcf4a'],[150,cy+34,'#ff6b6b']].forEach(([x,y,c])=>s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" fill-opacity=".22" stroke="${c}" stroke-width="3" filter="url(#${u}g)"/>`);
    s+=`<circle cx="150" cy="${cy}" r="16" fill="#fff" filter="url(#${u}g)"/><circle cx="150" cy="${cy}" r="44" fill="url(#${u}gold)"/>`;
    return s; },
  laser(u,H){ let s=shop(u,H);
    s+=rustPlate(u,150,H*.25,140,H*.56,.48);
    s+=`<g transform="translate(40 ${H*.62}) rotate(-12)"><rect x="0" y="-16" width="90" height="32" rx="8" fill="#22272c"/><rect x="0" y="-16" width="90" height="8" rx="4" fill="#fff" opacity=".15"/><rect x="88" y="-8" width="24" height="16" fill="#3a4046"/><rect x="20" y="14" width="20" height="40" rx="4" fill="#1a1d20"/><rect x="10" y="-4" width="40" height="4" fill="#18c6d9"/></g>`;
    s+=`<line x1="150" y1="${H*.54}" x2="217" y2="${H*.5}" stroke="url(#${u}cy)" stroke-width="5" filter="url(#${u}g)"/><circle cx="217" cy="${H*.5}" r="30" fill="url(#${u}cool)"/><circle cx="217" cy="${H*.5}" r="6" fill="#fff"/>`;
    s+=sparks(u,217,H*.5,22,'#e6ffff',360,30);
    return s; },
  rushed(u,H){ let s=storm(u,H);
    s+=`<g transform="translate(150 ${H*.46})"><circle r="62" fill="#e8e4da" stroke="#222" stroke-width="6"/>`;
    for(let i=0;i<12;i++){const a=i*30*Math.PI/180;s+=`<line x1="${Math.cos(a)*50}" y1="${Math.sin(a)*50}" x2="${Math.cos(a)*58}" y2="${Math.sin(a)*58}" stroke="#222" stroke-width="3"/>`}
    s+=`<line x1="0" y1="0" x2="0" y2="-44" stroke="#c0392b" stroke-width="5"/><line x1="0" y1="0" x2="30" y2="10" stroke="#222" stroke-width="5"/><path d="M-60 -20 L-10 4 L-24 30 L40 58" stroke="#222" stroke-width="3" fill="none"/></g>`;
    s+=`<g transform="translate(150 ${H*.86})"><rect x="-40" y="-14" width="80" height="28" fill="#8a6a3a"/><path d="M-40 -14 L-50 -30 L-10 -30 L0 -14 M40 -14 L50 -30 L10 -30 L0 -14" fill="#a07c46"/></g>`;
    return s; },
  insider(u,H){ let s=shop(u,H);
    s+=`<rect x="0" y="${H*.62}" width="${W}" height="${H*.1}" fill="#3a2a1c"/><rect x="0" y="${H*.62}" width="${W}" height="4" fill="#6a4a2a"/>`;
    s+=`<circle cx="150" cy="${H*.4}" r="80" fill="url(#${u}warm)" opacity=".8"/>`;
    s+=person(150,H*.66,1.7,'#0c0a09');
    s+=`<g transform="translate(70 ${H*.56})"><rect width="160" height="10" fill="#d9c9a8" transform="skewX(-20)"/></g>`;
    s+=`<g fill="#ffcf4a" opacity=".9">`+[40,80,220,260].map(x=>`<circle cx="${x}" cy="${H*.2}" r="3"/>`).join('')+`</g>`;
    return s; },
  founder(u,H,layer){
    if(layer==='fg'){
      let s=`<g filter="url(#${u}g)"><line x1="206" y1="${H*.4}" x2="300" y2="-40" stroke="url(#${u}cy)" stroke-width="6"/></g>`;
      s+=`<g transform="translate(120 ${H*.66}) scale(2.1)" fill="#071016"><circle cx="0" cy="-58" r="13"/><path d="M-26 0 L-22 -36 Q-20 -44 -10 -45 L10 -45 Q20 -44 22 -36 L26 0 Z"/><rect x="-18" y="-2" width="14" height="40"/><rect x="4" y="-2" width="14" height="40"/><path d="M18 -40 L40 -52 L46 -46 L22 -32 Z"/><path d="M-26 -36 Q-50 -10 -46 30 L-30 30 Q-34 0 -22 -24Z" opacity=".8"/></g>`;
      return s; }
    let s=river(u,H)+`<rect y="${H*.62}" width="${W}" height="${H*.38}" fill="#0e2a3a" opacity=".5"/>`;
    s+=`<ellipse cx="130" cy="${H*.5}" rx="140" ry="${H*.3}" fill="url(#${u}cool)" opacity=".35"/>`;
    return s; },
  memo(u,H,layer){
    if(layer==='fg'){
      return `<g transform="translate(150 ${H*.5}) rotate(-6)"><rect x="-80" y="-105" width="160" height="210" fill="#f4f2ec"/><rect x="-80" y="-105" width="160" height="26" fill="#1a2a3a"/><text x="0" y="-86" font-size="13" text-anchor="middle" fill="#ffcf4a" font-family="Georgia" font-weight="700">OPPORTUNITY MEMO</text>`+
      [0,1,2,3,4,5,6,7,8].map(i=>`<rect x="-64" y="${-62+i*16}" width="${i%3===2?80:128}" height="5" fill="#9a9488"/>`).join('')+
      `<circle cx="44" cy="76" r="20" fill="none" stroke="#c0392b" stroke-width="3"/><text x="44" y="82" font-size="16" text-anchor="middle" fill="#c0392b" font-family="Georgia" font-weight="700">✓</text></g>`; }
    let s=sky(u,H,'#2a1a08','#6a4410','#1a1006');
    s+=`<circle cx="150" cy="${H*.45}" r="150" fill="url(#${u}gold)" opacity=".7"/>`;
    for(let i=0;i<24;i++){const a=i*15*Math.PI/180;s+=`<line x1="150" y1="${H*.45}" x2="${150+Math.cos(a)*400}" y2="${H*.45+Math.sin(a)*400}" stroke="#ffe08a" stroke-opacity=".12" stroke-width="10"/>`}
    return s; }
};

window.RRart = function(key, opts={}){
  const u = 'a'+(++N)+'_';
  const H = opts.tall ? 420 : 210;
  const fn = S[key] || S.demand;
  const layer = opts.layer || 'all';
  let body = '';
  if(layer!=='fg') body += fn(u,H,'bg') + `<rect width="${W}" height="${H}" fill="#fff" filter="url(#${u}n)" opacity=".5"/>`;
  if(layer!=='bg' && (key==='founder'||key==='memo')) body += fn(u,H,'fg');
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${defs(u)}${body}</svg>`;
};
})();
