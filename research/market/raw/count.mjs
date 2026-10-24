import fs from 'node:fs';
const base='C:/Users/User/Documents/deepseek-harness/default-workspace/rwa-nitro/research/';
for(const f of ['market/landscape.md','market/apis.md','toolkit/oss.md']){
  const s=fs.readFileSync(base+f,'utf8');
  const chars=[...s].length;
  const ko=(s.match(/[\uAC00-\uD7A3]/g)||[]).length;
  const bytes=fs.statSync(base+f).size;
  console.log(`${f}: chars=${chars}, korean=${ko}, bytes=${bytes}`);
}
