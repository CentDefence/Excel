/* Core helpers, global state, toast */
const $=s=>document.querySelector(s);
const L=n=>{let s='';n++;while(n>0){const m=(n-1)%26;s=String.fromCharCode(65+m)+s;n=Math.floor((n-1)/26)}return s};
const PC=a=>{const m=/^\$?([A-Z]+)\$?(\d+)$/.exec(a);let c=0;for(const ch of m[1])c=c*26+ch.charCodeAt(0)-64;return[m[2]-1,c-1]};
const cl=(v,n)=>Math.max(0,Math.min(n-1,v));
const esc=t=>String(t).replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
let S=[{n:'Sheet1',d:{}}],cur=0,NR=100,NC=26,sel={r:0,c:0,r2:0,c2:0},ed=null,und=[],red=[],memo={},grid=[],cH=[],rH=[],drag=false,fname='Book1';
const PEND={};let cw=[],rs=null,showF=false,zm=1;
const rng=()=>({r1:Math.min(sel.r,sel.r2),r2:Math.max(sel.r,sel.r2),c1:Math.min(sel.c,sel.c2),c2:Math.max(sel.c,sel.c2)});
const forSel=fn=>{const g=rng();for(let r=g.r1;r<=g.r2;r++)for(let c=g.c1;c<=g.c2;c++)fn(r,c)};
const getRaw=(r,c)=>(S[cur].d[r+','+c]||{}).v||'';
const cell=(r,c)=>S[cur].d[r+','+c]=S[cur].d[r+','+c]||{};
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.display='none',2600)}
