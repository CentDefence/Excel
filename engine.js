/* Formula compiler and evaluator, number formatting */
const enFn=f=>f.replace(/;/g,',').replace(/[А-Яа-яЁё]+(?=\()/g,m=>RU[m.toUpperCase()]||m);
const refRe=/(?<![A-Z0-9_."])(\$?[A-Z]{1,3}\$?\d+)(?::(\$?[A-Z]{1,3}\$?\d+))?(?![A-Z0-9_(])/g;
function C(a){const[r,c]=PC(a),v=ev(r,c);if(typeof v=='string'&&v[0]=='#')throw v;return v===''?0:v}
function R(a,b){const[r1,c1]=PC(a),[r2,c2]=PC(b),o=[];for(let r=Math.min(r1,r2);r<=Math.max(r1,r2);r++)for(let c=Math.min(c1,c2);c<=Math.max(c1,c2);c++){const v=ev(r,c);if(typeof v=='string'&&v[0]=='#')throw v;o.push(v===''?null:v)}o.w=Math.abs(c2-c1)+1;return o}
function run(f){let code=f.split(/("[^"]*")/).map((p,i)=>i%2?p:p.toUpperCase().replace(/([A-Z])\.([A-Z]+\()/g,'$1_$2').replace(refRe,(m,a,b)=>b?`R("${a}","${b}")`:`C("${a}")`).replace(/<>/g,'!=').replace(/(?<![<>!=])=(?!=)/g,'==').replace(/\^/g,'**').replace(/&/g,'+""+').replace(/;/g,',')).join('');
code=lazify(code.replace(/[А-ЯЁ]+(?=\()/g,m=>RU[m]||m));return new Function('C','R','F','with(F){return ('+code+')}')(C,R,FN)}
function ev(r,c){const k=r+','+c;if(k in memo){if(memo[k]===PEND)throw'#REF!';return memo[k]}
memo[k]=PEND;const raw=getRaw(r,c);let res;
try{if(raw[0]=='='&&raw.length>1){res=run(raw.slice(1));if(Array.isArray(res))res='#VALUE!';else if(typeof res=='number'&&!isFinite(res))res=isNaN(res)?'#VALUE!':'#DIV/0!'}
else if(raw.trim()!==''&&!isNaN(raw.replace(',','.')))res=Number(raw.replace(',','.'));else res=raw}
catch(e){res=typeof e=='string'?e:e instanceof ReferenceError?'#NAME?':'#VALUE!'}
return memo[k]=res}
function disp(v,nf){if(v===true)return'TRUE';if(v===false)return'FALSE';if(typeof v!='number')return v;
if(nf=='d')return toD(v).toISOString().slice(0,10);if(nf=='n0')return Math.round(v).toLocaleString('en-US');if(nf=='n2')return v.toFixed(2);if(nf=='p')return(v*100).toFixed(2)+'%';
if(nf=='c')return v.toLocaleString('en-US',{style:'currency',currency:'USD'});return String(parseFloat(v.toPrecision(10)))}
