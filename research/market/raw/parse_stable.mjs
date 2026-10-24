const fs=require('fs');
const sc=JSON.parse(fs.readFileSync('defillama_stablecoins.json','utf8'));
const arr=sc.peggedAssets||[];
let tot=0;
for(const a of arr){ tot += (a.circulating&&a.circulating.peggedUSD)||0; }
arr.sort((a,b)=>((b.circulating&&b.circulating.peggedUSD)||0)-((a.circulating&&a.circulating.peggedUSD)||0));
console.log('STABLECOINS count=',arr.length,'totalUSD=',Math.round(tot).toLocaleString());
console.log('TOP10:',arr.slice(0,10).map(a=>`${a.symbol}:${(((a.circulating&&a.circulating.peggedUSD)||0)/1e9).toFixed(1)}B`).join(', '));
console.log('sample keys:',Object.keys(arr[0]).join(','));
console.log('sample circulating:',JSON.stringify(arr[0].circulating));
const usd=arr.filter(a=>a.circulating&&a.circulating.peggedUSD);
const usdc=usd.find(a=>a.symbol==='USDC'); const usdt=usd.find(a=>a.symbol==='USDT');
console.log('USDT=',usdt&&usdt.circulating.peggedUSD,'USDC=',usdc&&usdc.circulating.peggedUSD);
console.log('total excluding USDT/USDC=',Math.round(tot-((usdt?usdt.circulating.peggedUSD:0)+(usdc?usdc.circulating.peggedUSD:0))).toLocaleString());
