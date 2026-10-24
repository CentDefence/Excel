/* Fill, sort, find, insert/delete, charts, ribbon tabs */
const adj=(f,dr,dc)=>f.split(/("[^"]*")/).map((p,i)=>i%2?p:p.replace(/(?<![A-Za-z0-9_.])(\$?)([A-Za-z]{1,3})(\$?)(\d+)(?![A-Za-z0-9_(])/g,(m,a,col,b,row)=>{let c=0;for(const ch of col.toUpperCase())c=c*26+ch.charCodeAt(0)-64;if(!a)c+=dc;return a+L(c-1)+b+(b?row:+row+dr)})).join('');
function fill(d){snap();const g=rng();let r0=g.r1,c0=g.c1;if(d&&g.r1==g.r2&&r0>0)r0--;if(!d&&g.c1==g.c2&&c0>0)c0--;
for(let r=g.r1;r<=g.r2;r++)for(let c=g.c1;c<=g.c2;c++){const sr=d?r0:r,sc=d?c:c0;if(sr==r&&sc==c)continue;const o=S[cur].d[sr+','+sc],v=o&&o.v||'';cell(r,c).v=v[0]=='='?adj(v,r-sr,c-sc):v;if(o&&o.s)cell(r,c).s={...o.s}}render()}
const fillD=()=>fill(1),fillR=()=>fill(0);
function shift(ax,i,d){snap();const o={};for(const k in S[cur].d){let[r,c]=k.split(',').map(Number),p=ax?c:r;if(d<0&&p==i)continue;if(p>=i)p+=d;ax?c=p:r=p;o[r+','+c]=S[cur].d[k]}S[cur].d=o;fit();render()}
function sortR(d){const g=rng();if(g.r1==g.r2)return toast('Select a range with 2+ rows');snap();const rows=[];
for(let r=g.r1;r<=g.r2;r++){const row=[];for(let c=g.c1;c<=g.c2;c++)row.push(S[cur].d[r+','+c]);rows.push({k:ev(r,g.c1),row})}
rows.sort((a,b)=>{const x=a.k,y=b.k,n=typeof x=='number',m=typeof y=='number';return(n&&m?x-y:n?-1:m?1:String(x).localeCompare(String(y)))*d});
rows.forEach((o,i)=>o.row.forEach((x,j)=>{const k=(g.r1+i)+','+(g.c1+j);x?S[cur].d[k]=x:delete S[cur].d[k]}));render()}
function find(){const q=$('#q').value.toLowerCase();if(!q)return;const n=NR*NC,s=sel.r*NC+sel.c;
for(let k=1;k<=n;k++){const i=(s+k)%n,r=Math.floor(i/NC),c=i%NC;if(getRaw(r,c).toLowerCase().includes(q)||String(disp(ev(r,c))).toLowerCase().includes(q)){sel={r,c,r2:r,c2:c};paintSel();grid[r][c].scrollIntoView({block:'center',inline:'center'});return}}toast('Not found')}
function anim(){const t=$('#g');t.style.animation='none';t.offsetWidth;t.style.animation='fi .3s'}
function chart(t){const g=rng(),mc=g.c2>g.c1,labels=[],ser=[];for(let r=g.r1;r<=g.r2;r++)labels.push(mc?disp(ev(r,g.c1)):r+1);
for(let c=mc?g.c1+1:g.c1;c<=g.c2;c++){const a=[];for(let r=g.r1;r<=g.r2;r++){const v=ev(r,c);a.push(typeof v=='number'?v:0)}ser.push(a)}
if(!ser.length)return toast('Select data first');
const W=520,H=300,P=40,mx=Math.max(1,...ser.flat()),cols=['#4472c4','#ed7d31','#a5a5a5','#ffc000','#5b9bd5','#70ad47'];let s='';
if(t=='pie'){const a=ser[0],tot=a.reduce((x,y)=>x+Math.max(0,y),0)||1;let ang=-Math.PI/2;
a.forEach((v,i)=>{const d=Math.max(0,v)/tot*2*Math.PI,x1=260+110*Math.cos(ang),y1=150+110*Math.sin(ang);ang+=d;const x2=260+110*Math.cos(ang),y2=150+110*Math.sin(ang);
s+=`<path class="pa" style="animation-delay:${i*90}ms" d="M260 150L${x1} ${y1}A110 110 0 ${d>Math.PI?1:0} 1 ${x2} ${y2}Z" fill="${cols[i%6]}"><title>${esc(labels[i])}: ${v}</title></path>`})}
else{const n=labels.length,bw=(W-2*P)/n;for(let i=0;i<=4;i++){const y=H-P-(H-2*P)*i/4;s+=`<line x1="${P}" x2="${W-P}" y1="${y}" y2="${y}" stroke="var(--ln)"/><text x="${P-4}" y="${y+4}" text-anchor="end" font-size="10" fill="currentColor">${+(mx*i/4).toPrecision(3)}</text>`}
labels.forEach((l,i)=>s+=`<text x="${P+bw*(i+.5)}" y="${H-P+14}" text-anchor="middle" font-size="10" fill="currentColor">${esc(String(l).slice(0,8))}</text>`);
ser.forEach((a,k)=>{if(t=='bar')a.forEach((v,i)=>{const h=(H-2*P)*v/mx,w=bw*.8/ser.length;s+=`<rect class="an" style="animation-delay:${i*50}ms;transform-origin:0 ${H-P}px" x="${P+bw*i+bw*.1+w*k}" y="${H-P-h}" width="${w}" height="${h}" fill="${cols[k%6]}"/>`});
else s+=`<polyline class="ln" fill="none" stroke="${cols[k%6]}" stroke-width="2.5" pathLength="1" points="${a.map((v,i)=>(P+bw*(i+.5))+','+(H-P-(H-2*P)*v/mx)).join(' ')}"/>`})}
$('#cb').innerHTML=`<svg viewBox="0 0 ${W} ${H}" width="100%">${s}</svg>`;$('#ch').style.display='block'}
$('#p-f').innerHTML='<div class="g"><select onchange="insFn(this.value);this.value=\'\'"><option value="">fx Insert function…</option>'+Object.keys(FN).filter(k=>/^[A-Z][A-Z0-9_]*$/.test(k)).sort().map(k=>`<option>${k.replace('_','.')}</option>`).join('')+'</select></div><div class="g" style="border:0">'+['SUM','AVERAGE','COUNT','MAX','MIN','MEDIAN'].map(f=>`<button onclick="autosum('${f}')">${f}</button>`).join('')+'<button onclick="showF=!showF;render()">Show formulas</button></div>';
$('#p-v').innerHTML='<div class="g" style="border:0"><button onclick="document.body.classList.toggle(\'ng\')">Gridlines</button><button onclick="zm=Math.max(.5,zm-.1);$(\'#g\').style.zoom=zm">Zoom −</button><button onclick="zm=Math.min(2,zm+.1);$(\'#g\').style.zoom=zm">Zoom +</button><button onclick="const d=document.documentElement,k=matchMedia(\'(prefers-color-scheme:dark)\').matches;d.dataset.theme=(d.dataset.theme||(k?\'dark\':\'light\'))==\'dark\'?\'light\':\'dark\'">Dark / Light</button></div>';
document.querySelectorAll('#tb span').forEach(t=>t.onclick=()=>{document.querySelectorAll('#tb span,.p').forEach(x=>x.classList.remove('on'));t.classList.add('on');$('#p-'+t.dataset.t).classList.add('on')});
