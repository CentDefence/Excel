/* Grid rendering and selection painting */
/* render */
function fit(){let mr=0,mc=0;for(const k in S[cur].d){const[r,c]=k.split(',');mr=Math.max(mr,+r);mc=Math.max(mc,+c)}NR=Math.min(500,Math.max(100,mr+21));NC=Math.min(60,Math.max(26,mc+5))}
function render(){memo={};const d=S[cur].d;
let h='<colgroup><col style="width:46px">'+Array.from({length:NC},(_,c)=>`<col style="width:${cw[c]||84}px">`).join('')+'</colgroup><thead><tr><th id="all"></th>';
for(let c=0;c<NC;c++)h+=`<th data-h="c${c}">${L(c)}</th>`;h+='</tr></thead><tbody>';
for(let r=0;r<NR;r++){h+=`<tr><th data-h="r${r}">${r+1}</th>`;
for(let c=0;c<NC;c++){const o=d[r+','+c],s=o&&o.s||{},v=ev(r,c);let st='';
if(s.b)st+='font-weight:700;';if(s.i)st+='font-style:italic;';if(s.u)st+='text-decoration:underline;';if(s.c)st+='color:'+s.c+';';if(s.bg)st+='background:'+s.bg+';';if(s.ff)st+="font-family:'"+s.ff+"';";if(s.fs)st+='font-size:'+s.fs+'px;';if(s.bd)st+='box-shadow:inset 0 0 0 1px #000;';
const al=s.al||(typeof v=='number'?'right':'');if(al)st+='text-align:'+al;
h+=`<td data-r="${r}" data-c="${c}" style="${st}">${esc(showF&&getRaw(r,c)[0]=='='?getRaw(r,c):disp(v,s.nf))}</td>`}h+='</tr>'}
const g=$('#g');g.innerHTML=h+'</tbody>';grid=[];g.querySelectorAll('td').forEach((td,i)=>{(grid[Math.floor(i/NC)]??=[])[i%NC]=td});
cH=[...g.querySelectorAll('th[data-h^=c]')];rH=[...g.querySelectorAll('th[data-h^=r]')];
$('#tabs').innerHTML=S.map((s,i)=>`<button class="tab${i==cur?' on':''}" onclick="sw(${i})">${esc(s.n)}</button>`).join('')+'<button onclick="addS()">+</button>';
paintSel()}
function paintSel(){const g=rng();
for(let r=0;r<NR;r++)for(let c=0;c<NC;c++){const t=grid[r][c];if(t.classList.contains('ed'))continue;const i=r>=g.r1&&r<=g.r2&&c>=g.c1&&c<=g.c2;t.className=i?(r==sel.r&&c==sel.c?'sel act':'sel'):''}
cH.forEach((t,c)=>t.classList.toggle('hs',c>=g.c1&&c<=g.c2));rH.forEach((t,r)=>t.classList.toggle('hs',r>=g.r1&&r<=g.r2));
$('#nb').textContent=(g.r1==g.r2&&g.c1==g.c2)?L(sel.c)+(sel.r+1):L(g.c1)+(g.r1+1)+':'+L(g.c2)+(g.r2+1);
if(document.activeElement!==$('#fx'))$('#fx').value=getRaw(sel.r,sel.c);
const n=[];let cnt=0;forSel((r,c)=>{const v=ev(r,c);if(v!=='')cnt++;if(typeof v=='number')n.push(v)});
const sum=n.reduce((a,b)=>a+b,0);$('#st').textContent=cnt>1?`Average: ${n.length?disp(sum/n.length):'—'}   Count: ${cnt}   Sum: ${disp(sum)}`:''}
