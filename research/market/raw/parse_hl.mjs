import fs from 'node:fs';
const p='C:/Users/User/Documents/deepseek-harness/default-workspace/rwa-nitro/research/market/raw/';
const h=JSON.parse(fs.readFileSync(p+'hyperliquid_info.json','utf8'));
console.log('type=',Array.isArray(h),'len=',h.length);
if(Array.isArray(h)){
  const meta=h[0]; const ctxs=h[1];
  const names=meta.universe.map(u=>u.name);
  console.log('assets=',names.length);
  console.log('names sample=',names.slice(0,40).join(','));
  const rwaish=names.filter(n=>/GOLD|SILVER|OIL|SPX|XYZ|TSLA|AAPL|NVDA|EUR|JPY|KRW|COPPER|NATGAS|BRENT/i.test(n));
  console.log('rwa-ish=',rwaish.join(','));
  const idx=rwaish.slice(0,6).map(n=>{const i=names.indexOf(n); return `${n}: funding=${ctxs[i]?.funding} oi=${ctxs[i]?.openInterest} markPx=${ctxs[i]?.markPx} dayNtlVlm=${ctxs[i]?.dayNtlVlm}`;});
  console.log(idx.join('\n'));
}
