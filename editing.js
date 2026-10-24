/* Cell editing, undo/redo, styles, AutoSum */
/* edit */
function snap(){und.push(JSON.stringify(S));if(und.length>60)und.shift();red=[]}
function undo(){if(!und.length)return;red.push(JSON.stringify(S));S=JSON.parse(und.pop());cur=Math.min(cur,S.length-1);fit();render()}
function redo(){if(!red.length)return;und.push(JSON.stringify(S));S=JSON.parse(red.pop());cur=Math.min(cur,S.length-1);fit();render()}
function startEdit(r,c,txt){if(ed)commitEd();ed={r,c};const td=grid[r][c];td.className='ed';td.innerHTML='<input>';const i=td.firstChild;i.value=txt;i.focus();
i.onkeydown=e=>{e.stopPropagation();if(e.key=='Enter'){e.preventDefault();commitEd(0,e.shiftKey?-1:1)}else if(e.key=='Tab'){e.preventDefault();commitEd(e.shiftKey?-1:1,0)}else if(e.key=='Escape'){ed=null;render()}};
i.oninput=()=>$('#fx').value=i.value;i.onblur=()=>{if(ed)commitEd()}}
function commitEd(dc=0,dr=0){if(!ed)return;const{r,c}=ed,i=$('#g input');ed=null;const v=i?i.value:getRaw(r,c);
if(v!==getRaw(r,c)){snap();cell(r,c).v=v}
const nr=cl(r+dr,NR),nc=cl(c+dc,NC);sel={r:nr,c:nc,r2:nr,c2:nc};render()}
function clr(){snap();forSel((r,c)=>{const o=S[cur].d[r+','+c];if(o)o.v=''});render()}
function sty(p,v){snap();const a=(S[cur].d[sel.r+','+sel.c]||{}).s||{};const nv=(p=='b'||p=='i'||p=='u'||p=='bd')?!a[p]:v;
forSel((r,c)=>{const o=cell(r,c);o.s={...o.s,[p]:nv}});render()}
function autosum(n="SUM"){snap();const g=rng();
if(g.r1==g.r2&&g.c1==g.c2){let r=g.r1-1;while(r>=0&&typeof ev(r,g.c1)=='number'&&getRaw(r,g.c1)!=='')r--;if(r<g.r1-1)cell(g.r1,g.c1).v=`=${n}(${L(g.c1)}${r+2}:${L(g.c1)}${g.r1})`}
else for(let c=g.c1;c<=g.c2;c++)cell(cl(g.r2+1,NR),c).v=`=${n}(${L(c)}${g.r1+1}:${L(c)}${g.r2+1})`;render()}
