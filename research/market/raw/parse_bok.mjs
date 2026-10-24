import fs from 'node:fs';
const p='C:/Users/User/Documents/deepseek-harness/default-workspace/rwa-nitro/research/market/raw/';
const j=JSON.parse(fs.readFileSync(p+'bok_base_rate_latest.json','utf8'));
const rows=j.StatisticSearch?.row||[];
for(const r of rows) console.log(r.TIME, r.ITEM_CODE1, r.DATA_VALUE);
