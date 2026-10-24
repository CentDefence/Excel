/* Mouse, keyboard, clipboard handling */
/* input */
const g=$('#g');
g.addEventListener('mousedown',e=>{const t=e.target.closest('td,th');if(!t||e.target.tagName=='INPUT')return;if(t.dataset.h&&t.dataset.h[0]=='c'&&e.offsetX>t.offsetWidth-6){rs={c:+t.dataset.h.slice(1),x:e.clientX,w:cw[+t.dataset.h.slice(1)]||84};e.preventDefault();return}if(ed)commitEd();if(document.activeElement)document.activeElement.blur();e.preventDefault();
if(t.tagName=='TD'){const r=+t.dataset.r,c=+t.dataset.c;if(e.shiftKey){sel.r2=r;sel.c2=c}else sel={r,c,r2:r,c2:c};drag=true}
else if(t.id=='all')sel={r:0,c:0,r2:NR-1,c2:NC-1};
else{const k=t.dataset.h,i=+k.slice(1);sel=k[0]=='c'?{r:0,c:i,r2:NR-1,c2:i}:{r:i,c:0,r2:i,c2:NC-1}}paintSel()});
g.addEventListener('mouseover',e=>{const t=e.target.closest('td');if(drag&&t&&!ed){sel.r2=+t.dataset.r;sel.c2=+t.dataset.c;paintSel()}});
document.addEventListener('mouseup',()=>{drag=false;rs=null});document.addEventListener('mousemove',e=>{if(rs){cw[rs.c]=Math.max(30,rs.w+e.clientX-rs.x);$('#g').querySelectorAll('col')[rs.c+1].style.width=cw[rs.c]+'px'}});
g.addEventListener('dblclick',e=>{const t=e.target.closest('td');if(t&&!ed)startEdit(+t.dataset.r,+t.dataset.c,getRaw(+t.dataset.r,+t.dataset.c))});
$('#rb').addEventListener('mousedown',e=>{if(e.target.closest('button'))e.preventDefault()});
$('#fx').onkeydown=e=>{if(e.key=='Enter'){const v=$('#fx').value;if(v!==getRaw(sel.r,sel.c)){snap();cell(sel.r,sel.c).v=v}const r=cl(sel.r+1,NR);sel={r,c:sel.c,r2:r,c2:sel.c};$('#fx').blur();render()}else if(e.key=='Escape'){$('#fx').value=getRaw(sel.r,sel.c);$('#fx').blur()}};
document.addEventListener('keydown',e=>{if(['INPUT','SELECT'].includes(e.target.tagName))return;const k=e.key,ctl=e.ctrlKey||e.metaKey;
if(ctl){const m={z:undo,y:redo,d:fillD,r:fillR,b:()=>sty('b'),i:()=>sty('i'),u:()=>sty('u')}[k.toLowerCase()];if(m){e.preventDefault();m()}else if(k.toLowerCase()=='a'){e.preventDefault();sel={r:0,c:0,r2:NR-1,c2:NC-1};paintSel()}return}
const mv={ArrowDown:[1,0],ArrowUp:[-1,0],ArrowLeft:[0,-1],ArrowRight:[0,1],Enter:[1,0],Tab:[0,1]}[k];
if(mv){e.preventDefault();let[dr,dc]=mv;const ar=k.startsWith('Arrow');if(e.shiftKey&&!ar){dr=-dr;dc=-dc}
if(e.shiftKey&&ar){sel.r2=cl(sel.r2+dr,NR);sel.c2=cl(sel.c2+dc,NC)}else{const r=cl(sel.r+dr,NR),c=cl(sel.c+dc,NC);sel={r,c,r2:r,c2:c}}
paintSel();grid[e.shiftKey&&ar?sel.r2:sel.r][e.shiftKey&&ar?sel.c2:sel.c].scrollIntoView({block:'nearest',inline:'nearest'});return}
if(k=='Delete'||k=='Backspace'){e.preventDefault();clr()}else if(k=='F2'){e.preventDefault();startEdit(sel.r,sel.c,getRaw(sel.r,sel.c))}
else if(k.length==1&&!e.altKey){e.preventDefault();startEdit(sel.r,sel.c,k)}});
const tsv=()=>{const g=rng(),o=[];for(let r=g.r1;r<=g.r2;r++){const row=[];for(let c=g.c1;c<=g.c2;c++)row.push(getRaw(r,c));o.push(row.join('\t'))}return o.join('\n')};
document.addEventListener('copy',e=>{if(e.target.tagName=='INPUT')return;e.clipboardData.setData('text/plain',tsv());e.preventDefault()});
document.addEventListener('cut',e=>{if(e.target.tagName=='INPUT')return;e.clipboardData.setData('text/plain',tsv());e.preventDefault();clr()});
document.addEventListener('paste',e=>{if(e.target.tagName=='INPUT')return;e.preventDefault();const t=e.clipboardData.getData('text/plain').replace(/\r/g,'').replace(/\n$/,'');if(!t)return;
snap();const g=rng();t.split('\n').forEach((ln,i)=>ln.split('\t').forEach((v,j)=>{const r=g.r1+i,c=g.c1+j;if(r<NR&&c<NC)cell(r,c).v=v}));render()});
