/* Sheets, open/save .xlsx/.csv */
/* sheets & files */
function sw(i){anim();cur=i;fit();sel={r:0,c:0,r2:0,c2:0};render()}
function addS(){snap();S.push({n:'Sheet'+(S.length+1),d:{}});sw(S.length-1)}
function newB(){snap();S=[{n:'Sheet1',d:{}}];fname='Book1';$('#ttl').textContent=fname;sw(0)}
$('#fi').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
if(typeof XLSX=='undefined'){toast('File library failed to load');return}
try{const csv=/\.(csv|tsv|txt)$/i.test(f.name);const wb=csv?XLSX.read(await f.text(),{type:'string'}):XLSX.read(await f.arrayBuffer(),{type:'array'});
snap();S=wb.SheetNames.map(n=>{const ws=wb.Sheets[n],d={};for(const a in ws){if(a[0]=='!')continue;const x=ws[a],p=XLSX.utils.decode_cell(a);d[p.r+','+p.c]={v:x.f?'='+x.f:(x.t=='n'?String(x.v):String(x.w??x.v))}}return{n:n.slice(0,31),d}});
fname=f.name.replace(/\.[^.]+$/,'');$('#ttl').textContent=f.name;sw(0)}catch(err){toast('Could not open file')}};
function toWB(){const wb=XLSX.utils.book_new(),keep=cur;
S.forEach((s,i)=>{cur=i;memo={};const ws={};let mr=0,mc=0;
for(const k in s.d){const v=s.d[k].v;if(v===undefined||v==='')continue;const[r,c]=k.split(',').map(Number);mr=Math.max(mr,r);mc=Math.max(mc,c);const x=ev(r,c),a=XLSX.utils.encode_cell({r,c});
ws[a]=v[0]=='='?{f:enFn(v.slice(1)),t:typeof x=='number'?'n':typeof x=='boolean'?'b':'s',v:x}:typeof x=='number'?{t:'n',v:x}:{t:'s',v}}
ws['!ref']=XLSX.utils.encode_range({s:{r:0,c:0},e:{r:mr,c:mc}});XLSX.utils.book_append_sheet(wb,ws,s.n)});
cur=keep;memo={};return wb}
async function save(kind){let dl=null;try{dl=await window.claude?.use?.('downloads')}catch(e){}
if(!dl)dl={save:async({filename:f,data:d})=>{const a=document.createElement('a');a.href=URL.createObjectURL(d instanceof Blob?d:new Blob([d]));a.download=f;document.body.appendChild(a);a.click();a.remove()}};
try{if(kind=='x'){if(typeof XLSX=='undefined')return toast('xlsx library failed to load');
await dl.save({filename:fname+'.xlsx',data:new Uint8Array(XLSX.write(toWB(),{bookType:'xlsx',type:'array'}))})}
else{memo={};let mr=0,mc=0;for(const k in S[cur].d){if(!getRaw(...k.split(',').map(Number)))continue;const[r,c]=k.split(',');mr=Math.max(mr,+r);mc=Math.max(mc,+c)}
const rows=[];for(let r=0;r<=mr;r++){const row=[];for(let c=0;c<=mc;c++){const t=String(disp(ev(r,c)));row.push(/[",\n]/.test(t)?'"'+t.replace(/"/g,'""')+'"':t)}rows.push(row.join(','))}
await dl.save({filename:fname+'.csv',data:'\ufeff'+rows.join('\r\n')})}toast('File saved')}
catch(e){if(e&&e.code!='declined')toast('Could not save')}}
