// node tests/run.js - loads the engine with a stubbed DOM and checks formulas
const fs=require('fs'),path=require('path');
const order=['state','functions','engine','render','editing','files','input','features'];
const code=order.map(n=>fs.readFileSync(path.join(__dirname,'..','js',n+'.js'),'utf8')).join('\n');
const stub=new Proxy(function(){},{get:(t,p)=>p=='querySelectorAll'?()=>[]:stub,set:()=>true,apply:()=>stub});
global.document={querySelector:()=>stub,querySelectorAll:()=>[],addEventListener(){},documentElement:{}};
const T=`const d=S[0].d;[5,3,8,2].forEach((v,i)=>{d[i+',0']={v:String(v)};d[i+',1']={v:'abcd'[i]}});
const t=f=>{memo={};d['9,5']={v:f};return ev(9,5)};
const cases=[['=SUM(A1:A4)',18],['=IFERROR(1/0,"x")','x'],['=IF(A1>4,"big","small")','big'],['=VLOOKUP(8,A1:B4,2,FALSE)','c'],
['=INDEX(B1:B4,MATCH(8,A1:A4,0))','c'],['=SUMIF(A1:A4,">2")',16],['=MEDIAN(A1:A4)',4],['=COUNTIFS(A1:A4,">2",B1:B4,"<>a")',2],['=A1&"-"&B1','5-a']];
let bad=0;for(const[f,e]of cases){const r=t(f);if(r!==e){bad++;console.log('FAIL',f,r,'expected',e)}}
console.log(bad?bad+' failed':'all '+cases.length+' tests passed');`;
new Function(code+'\n'+T)();
