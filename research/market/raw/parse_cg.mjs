import fs from 'node:fs';
const p='C:/Users/User/Documents/deepseek-harness/default-workspace/rwa-nitro/research/market/raw/';
const cats=JSON.parse(fs.readFileSync(p+'coingecko_categories.json','utf8'));
console.log('categories=',cats.length);
const rwa=cats.filter(c=>/rwa|real.world|tokeniz/i.test(c.name)||/rwa|real.world/i.test(c.id));
for(const c of rwa) console.log(`${c.name} | id=${c.id} | mcap=$${(c.market_cap||0).toLocaleString()} | vol24=$${(c.volume_24h||0).toLocaleString()} | chg24=${c.market_cap_change_24h}`);
const top=cats.slice(0,5).map(c=>`${c.name}:$${(c.market_cap/1e9).toFixed(1)}B`); console.log('top5:',top.join(' | '));
