/* Function library (FN): math, stats, text, date, lookup, financial */
/* formulas */
const fl=a=>a.flat(Infinity),nums=a=>fl(a).filter(x=>typeof x=='number');
const FN={SUM:(...a)=>nums(a).reduce((x,y)=>x+y,0),AVERAGE:(...a)=>{const n=nums(a);if(!n.length)throw'#DIV/0!';return n.reduce((x,y)=>x+y,0)/n.length},
MIN:(...a)=>Math.min(...nums(a)),MAX:(...a)=>Math.max(...nums(a)),COUNT:(...a)=>nums(a).length,COUNTA:(...a)=>fl(a).filter(x=>x!==null&&x!=='').length,
IF:(c,a,b=false)=>c?a:b,ROUND:(x,n=0)=>Math.round(x*10**n)/10**n,ABS:Math.abs,SQRT:Math.sqrt,POWER:Math.pow,MOD:(a,b)=>a%b,INT:Math.floor,PI:()=>Math.PI,
AND:(...a)=>fl(a).every(Boolean),OR:(...a)=>fl(a).some(Boolean),NOT:x=>!x,CONCAT:(...a)=>fl(a).join(''),LEN:s=>String(s).length,UPPER:s=>String(s).toUpperCase(),LOWER:s=>String(s).toLowerCase(),TRUE:true,FALSE:false};
const RU={СУММ:'SUM',СРЗНАЧ:'AVERAGE',МИН:'MIN',МАКС:'MAX',СЧЁТ:'COUNT',СЧЁТЗ:'COUNTA',ЕСЛИ:'IF',ОКРУГЛ:'ROUND',КОРЕНЬ:'SQRT',СТЕПЕНЬ:'POWER',ОСТАТ:'MOD',ЦЕЛОЕ:'INT',И:'AND',ИЛИ:'OR',НЕ:'NOT',СЦЕПИТЬ:'CONCAT',ДЛСТР:'LEN',ПРОПИСН:'UPPER',СТРОЧН:'LOWER',ИСТИНА:'TRUE',ЛОЖЬ:'FALSE'};
const mt=(v,c)=>{const m=/^(>=|<=|<>|>|<|=)?(.*)$/.exec(String(c)),op=m[1]||'=',x=isNaN(m[2])||m[2]===''?m[2].toLowerCase():+m[2],y=typeof v=='string'?v.toLowerCase():v;return op=='='?y==x:op=='<>'?y!=x:op=='>'?y>x:op=='<'?y<x:op=='>='?y>=x:y<=x};
Object.assign(FN,{MEDIAN:(...a)=>{const n=nums(a).sort((x,y)=>x-y),m=n.length>>1;return n.length%2?n[m]:(n[m-1]+n[m])/2},COUNTIF:(r,c)=>r.filter(v=>mt(v,c)).length,SUMIF:(r,c,t=r)=>r.reduce((a,v,i)=>mt(v,c)&&typeof t[i]=='number'?a+t[i]:a,0),
ROUNDUP:(x,n=0)=>Math.ceil(x*10**n)/10**n,ROUNDDOWN:(x,n=0)=>Math.floor(x*10**n)/10**n,LEFT:(s,n=1)=>String(s).slice(0,n),RIGHT:(s,n=1)=>String(s).slice(-n),MID:(s,a,n)=>String(s).substr(a-1,n),TRIM:s=>String(s).trim(),
TODAY:()=>new Date().toISOString().slice(0,10),NOW:()=>new Date().toLocaleString(),RAND:Math.random,SIN:Math.sin,COS:Math.cos,LN:Math.log,EXP:Math.exp,LOG10:Math.log10,CONCATENATE:FN.CONCAT});

const mean=n=>n.reduce((x,y)=>x+y,0)/n.length,q1=a=>nums(a),fix=(x,n=0)=>x*10**n;
const toD=v=>new Date(Date.UTC(1899,11,30)+Math.floor(v)*864e5),ser=(y,m,d)=>Math.round((Date.UTC(y,m-1,d)-Date.UTC(1899,11,30))/864e5),tp=()=>{const n=new Date();return ser(n.getFullYear(),n.getMonth()+1,n.getDate())};
const mi=p=>{const o=[];for(let i=0;i<p[0].length;i++){let ok=true;for(let j=0;j<p.length;j+=2)if(!mt(p[j][i],p[j+1])){ok=false;break}if(ok)o.push(i)}return o};
const lin=(y,x)=>{const b=q1([y]),a=q1([x]),ma=mean(a),mb=mean(b);let s=0,d=0;a.forEach((v,i)=>{s+=(v-ma)*(b[i]-mb);d+=(v-ma)**2});const k=s/d;return[k,mb-k*ma]};
const ci=(a,v)=>a.findIndex(x=>String(x).toLowerCase()==String(v).toLowerCase());
const g2=(a,b)=>b?g2(b,a%b):a,NA=()=>{throw'#N/A'};
const TX=(x,f)=>{f=String(f);if(/[ymdh]/i.test(f)&&!/[0#]/.test(f)){const d=toD(x),p=n=>String(n).padStart(2,'0');return f.replace(/yyyy/gi,d.getUTCFullYear()).replace(/yy/gi,String(d.getUTCFullYear()).slice(-2)).replace(/dd/gi,p(d.getUTCDate())).replace(/mm/gi,p(d.getUTCMonth()+1))}
const dec=(f.split('.')[1]||'').replace(/[^0#]/g,'').length,pc=f.includes('%'),v=pc?x*100:x;return v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec,useGrouping:f.includes(',')})+(pc?'%':'')};
Object.assign(FN,{
IF:(c,a,b)=>c()?a():b?b():false,IFS:(...a)=>{for(let i=0;i<a.length;i+=2)if(a[i]())return a[i+1]();NA()},
IFERROR:(a,b)=>{try{const v=a();return (typeof v=='string'&&v[0]=='#')||(typeof v=='number'&&!isFinite(v))?b():v}catch(e){return b()}},
IFNA:(a,b)=>{try{const v=a();return v==='#N/A'?b():v}catch(e){return e==='#N/A'?b():(()=>{throw e})()}},
ISERROR:a=>{try{const v=a();return (typeof v=='string'&&v[0]=='#')||(typeof v=='number'&&!isFinite(v))}catch(e){return true}},ISERR:a=>FN.ISERROR(a),ISNA:a=>{try{return a()==='#N/A'}catch(e){return e==='#N/A'}},
SWITCH:(x,...a)=>{for(let i=0;i+1<a.length;i+=2)if(a[i]==x)return a[i+1];if(a.length%2)return a[a.length-1];NA()},XOR:(...a)=>fl(a).filter(Boolean).length%2==1,
ISNUMBER:x=>typeof x=='number',ISTEXT:x=>typeof x=='string',ISEVEN:n=>n%2==0,ISODD:n=>n%2!=0,N:x=>typeof x=='number'?x:0,NA,
PRODUCT:(...a)=>q1(a).reduce((x,y)=>x*y,1),SUMSQ:(...a)=>q1(a).reduce((x,y)=>x+y*y,0),SUMPRODUCT:(...a)=>a[0].reduce((t,_,i)=>t+a.reduce((p,r)=>p*(typeof r[i]=='number'?r[i]:0),1),0),
QUOTIENT:(a,b)=>Math.trunc(a/b),MOD:(a,b)=>a-b*Math.floor(a/b),FLOOR:(x,s=1)=>Math.floor(x/s)*s,CEILING:(x,s=1)=>Math.ceil(x/s)*s,MROUND:(x,s)=>Math.round(x/s)*s,TRUNC:(x,n=0)=>Math.trunc(x*10**n)/10**n,SIGN:Math.sign,
FACT:n=>{let r=1;for(let i=2;i<=n;i++)r*=i;return r},COMBIN:(n,k)=>FN.FACT(n)/FN.FACT(k)/FN.FACT(n-k),PERMUT:(n,k)=>FN.FACT(n)/FN.FACT(n-k),GCD:(...a)=>fl(a).reduce(g2),LCM:(...a)=>fl(a).reduce((x,y)=>x*y/g2(x,y)),
DEGREES:x=>x*180/Math.PI,RADIANS:x=>x*Math.PI/180,TAN:Math.tan,ASIN:Math.asin,ACOS:Math.acos,ATAN:Math.atan,ATAN2:(x,y)=>Math.atan2(y,x),SINH:Math.sinh,COSH:Math.cosh,TANH:Math.tanh,LOG:(x,b=10)=>Math.log(x)/Math.log(b),RANDBETWEEN:(a,b)=>a+Math.floor(Math.random()*(b-a+1)),
COUNTBLANK:r=>fl([r]).filter(v=>v===null||v==='').length,COUNTIFS:(...p)=>mi(p).length,SUMIFS:(s,...p)=>mi(p).reduce((t,i)=>typeof s[i]=='number'?t+s[i]:t,0),
AVERAGEIFS:(s,...p)=>{const v=mi(p).map(i=>s[i]).filter(x=>typeof x=='number');if(!v.length)throw'#DIV/0!';return mean(v)},AVERAGEIF:(r,c,s=r)=>FN.AVERAGEIFS(s,r,c),
MAXIFS:(s,...p)=>Math.max(...mi(p).map(i=>s[i]).filter(x=>typeof x=='number')),MINIFS:(s,...p)=>Math.min(...mi(p).map(i=>s[i]).filter(x=>typeof x=='number')),
LARGE:(r,k)=>q1([r]).sort((a,b)=>b-a)[k-1],SMALL:(r,k)=>q1([r]).sort((a,b)=>a-b)[k-1],RANK:(x,r,o=0)=>q1([r]).filter(v=>o?v<x:v>x).length+1,
MODE:(...a)=>{const m={};let b,c=0;q1(a).forEach(v=>{m[v]=(m[v]||0)+1;if(m[v]>c){c=m[v];b=v}});if(b===undefined)NA();return b},
VAR_S:(...a)=>{const n=q1(a),m=mean(n);return n.reduce((t,x)=>t+(x-m)**2,0)/(n.length-1)},VAR_P:(...a)=>{const n=q1(a),m=mean(n);return n.reduce((t,x)=>t+(x-m)**2,0)/n.length},
STDEV_S:(...a)=>Math.sqrt(FN.VAR_S(...a)),STDEV_P:(...a)=>Math.sqrt(FN.VAR_P(...a)),GEOMEAN:(...a)=>Math.exp(mean(q1(a).map(Math.log))),
PERCENTILE:(r,p)=>{const n=q1([r]).sort((a,b)=>a-b),i=(n.length-1)*p,lo=Math.floor(i);return n[lo]+(n[Math.ceil(i)]-n[lo])*(i-lo)},QUARTILE:(r,q)=>FN.PERCENTILE(r,q/4),
CORREL:(x,y)=>{const a=q1([x]),b=q1([y]),ma=mean(a),mb=mean(b);let s=0,u=0,w=0;a.forEach((v,i)=>{s+=(v-ma)*(b[i]-mb);u+=(v-ma)**2;w+=(b[i]-mb)**2});return s/Math.sqrt(u*w)},
SLOPE:(y,x)=>lin(y,x)[0],INTERCEPT:(y,x)=>lin(y,x)[1],FORECAST:(x0,y,x)=>{const[k,b]=lin(y,x);return k*x0+b},
SUBTOTAL:(f,...a)=>({1:FN.AVERAGE,2:FN.COUNT,3:FN.COUNTA,4:FN.MAX,5:FN.MIN,9:FN.SUM}[f%100]||FN.SUM)(...a),
TEXTJOIN:(d,ig,...a)=>fl(a).filter(x=>!ig||(x!==null&&x!=='')).join(d),CHAR:n=>String.fromCharCode(n),CODE:s=>String(s).charCodeAt(0),EXACT:(a,b)=>a===b,CLEAN:s=>String(s).replace(/[\x00-\x1f]/g,''),
FIND:(a,b,s=1)=>{const i=String(b).indexOf(a,s-1);if(i<0)throw'#VALUE!';return i+1},SEARCH:(a,b,s=1)=>{const i=String(b).toLowerCase().indexOf(String(a).toLowerCase(),s-1);if(i<0)throw'#VALUE!';return i+1},
SUBSTITUTE:(s,o,n,k)=>String(s).split(o).reduce((a,p,i)=>i?a+((!k||i==k)?n:o)+p:p),REPLACE:(s,st,n,t)=>String(s).slice(0,st-1)+t+String(s).slice(st-1+n),REPT:(s,n)=>String(s).repeat(n),
PROPER:s=>String(s).toLowerCase().replace(/\b\w/g,m=>m.toUpperCase()),VALUE:s=>{const n=Number(s);if(isNaN(n))throw'#VALUE!';return n},TEXT:TX,
DATE:ser,TODAY:tp,NOW:()=>{const n=new Date();return tp()+(n.getHours()*3600+n.getMinutes()*60+n.getSeconds())/86400},YEAR:v=>toD(v).getUTCFullYear(),MONTH:v=>toD(v).getUTCMonth()+1,DAY:v=>toD(v).getUTCDate(),
WEEKDAY:(v,t=1)=>{const w=toD(v).getUTCDay();return t==2?(w+6)%7+1:w+1},EDATE:(v,m)=>{const d=toD(v);return ser(d.getUTCFullYear(),d.getUTCMonth()+1+m,d.getUTCDate())},EOMONTH:(v,m)=>{const d=toD(v);return ser(d.getUTCFullYear(),d.getUTCMonth()+2+m,0)},
DAYS:(e,s)=>Math.floor(e)-Math.floor(s),DATEDIF:(s,e,u)=>{const a=toD(s),b=toD(e),M=(b.getUTCFullYear()-a.getUTCFullYear())*12+b.getUTCMonth()-a.getUTCMonth()-(b.getUTCDate()<a.getUTCDate()?1:0);return u=='D'?Math.floor(e)-Math.floor(s):u=='M'?M:Math.floor(M/12)},
HOUR:v=>Math.floor((v%1*86400+.5)/3600),MINUTE:v=>Math.floor((v%1*86400+.5)/60)%60,SECOND:v=>Math.floor(v%1*86400+.5)%60,DATEVALUE:s=>{const t=Date.parse(s);if(isNaN(t))throw'#VALUE!';return Math.round((t-Date.UTC(1899,11,30))/864e5)},
VLOOKUP:(v,r,c,ex=true)=>{const w=r.w||1,n=r.length/w;let f=-1;for(let i=0;i<n;i++){const k=r[i*w];if(ex===false||ex===0){if(String(k).toLowerCase()==String(v).toLowerCase()){f=i;break}}else if(k!==null&&k<=v)f=i;else if(k!==null)break}if(f<0)NA();return r[f*w+c-1]??''},
HLOOKUP:(v,r,rw,ex=true)=>{const w=r.w||1,i=ex===false||ex===0?ci(r.slice(0,w),v):r.slice(0,w).filter(x=>x!==null&&x<=v).length-1;if(i<0)NA();return r[(rw-1)*w+i]??''},
MATCH:(v,r,t=1)=>{const a=fl([r]);if(t===0){const i=ci(a,v);if(i<0)NA();return i+1}let f=-1;for(let i=0;i<a.length;i++){if(t==1?a[i]<=v:a[i]>=v)f=i;else break}if(f<0)NA();return f+1},
INDEX:(r,i,j)=>(j===undefined?r[i-1]:r[(i-1)*(r.w||1)+j-1])??'',XLOOKUP:(v,l,r,nf)=>{const i=ci(l,v);if(i<0){if(nf!==undefined)return nf;NA()}return r[i]},
LOOKUP:(v,l,r=l)=>{let f=-1;l.forEach((x,i)=>{if(x!==null&&x<=v)f=i});if(f<0)NA();return r[f]},CHOOSE:(i,...a)=>a[i-1],ROWS:r=>r.length/(r.w||1),COLUMNS:r=>r.w||1,
PMT:(r,n,pv,fv=0,t=0)=>r==0?-(pv+fv)/n:-(r*(pv*(1+r)**n+fv))/((1+r*t)*((1+r)**n-1)),FV:(r,n,p,pv=0,t=0)=>r==0?-(pv+p*n):-(pv*(1+r)**n+p*(1+r*t)*((1+r)**n-1)/r),
PV:(r,n,p,fv=0,t=0)=>r==0?-(fv+p*n):-(fv+p*(1+r*t)*((1+r)**n-1)/r)/(1+r)**n,NPER:(r,p,pv,fv=0)=>r==0?-(pv+fv)/p:Math.log((p-fv*r)/(p+pv*r))/Math.log(1+r),
NPV:(r,...a)=>q1(a).reduce((t,v,i)=>t+v/(1+r)**(i+1),0),SLN:(c,s,l)=>(c-s)/l,
IRR:(a,g=.1)=>{const v=q1([a]);let x=g;for(let k=0;k<100;k++){let f=0,d=0;v.forEach((c,i)=>{f+=c/(1+x)**i;d-=i*c/(1+x)**(i+1)});const nx=x-f/d;if(!isFinite(nx))break;if(Math.abs(nx-x)<1e-9)return nx;x=nx}throw'#NUM!'},
DEC2BIN:n=>(n>>>0).toString(2),BIN2DEC:s=>parseInt(s,2),DEC2HEX:n=>(n>>>0).toString(16).toUpperCase(),HEX2DEC:s=>parseInt(s,16),DEC2OCT:n=>(n>>>0).toString(8),OCT2DEC:s=>parseInt(s,8)});
FN.STDEV=FN.STDEV_S;FN.STDEVP=FN.STDEV_P;FN.VAR=FN.VAR_S;FN.VARP=FN.VAR_P;
const LZ=['IFERROR','IFNA','IFS','IF','ISERROR','ISERR','ISNA'];
function lazify(code){const ms=[...code.matchAll(new RegExp('(?<![A-Z0-9_])('+LZ.join('|')+')\\(','g'))];
for(let m=ms.length-1;m>=0;m--){const j=ms[m].index+ms[m][0].length,parts=[];let d=1,q=false,st=j,i=j;
for(;i<code.length;i++){const ch=code[i];if(ch=='"')q=!q;else if(!q){if(ch=='(')d++;else if(ch==')'){if(--d==0)break}else if(ch==','&&d==1){parts.push(code.slice(st,i));st=i+1}}}
parts.push(code.slice(st,i));code=code.slice(0,j)+parts.map(p=>'()=>('+p+')').join(',')+code.slice(i)}return code}
function insFn(n){if(n)startEdit(sel.r,sel.c,'='+n+'(')}
for(const k in RU)FN[k]=FN[RU[k]];
