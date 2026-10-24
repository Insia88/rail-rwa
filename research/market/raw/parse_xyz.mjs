import fs from 'node:fs';
const p='C:/Users/User/Documents/deepseek-harness/default-workspace/rwa-nitro/research/market/raw/';
const h=JSON.parse(fs.readFileSync(p+'hl_xyz.json','utf8'));
const names=h[0].universe.map(u=>u.name); const ctx=h[1];
const want=['xyz:SP500','xyz:GOLD','xyz:SILVER','xyz:BRENTOIL','xyz:KR200','xyz:KRW','xyz:HYUNDAI','xyz:EWY','xyz:SKHX','xyz:TSLA','xyz:NVDA','xyz:COPPER'];
for(const w of want){const i=names.indexOf(w); if(i>=0){const c=ctx[i]||{}; console.log(`${w}: markPx=${c.markPx} oraclePx=${c.oraclePx} funding=${c.funding} oi=${Number(c.openInterest||0).toFixed(0)} dayNtlVlm=$${Number(c.dayNtlVlm||0).toLocaleString()} prevDayPx=${c.prevDayPx}`);} else console.log(w,'not found');}
const totalVol=ctx.reduce((s,c)=>s+Number(c.dayNtlVlm||0),0);
console.log('xyz dex total dayNtlVlm= $'+totalVol.toLocaleString(), 'assets=',names.length);
