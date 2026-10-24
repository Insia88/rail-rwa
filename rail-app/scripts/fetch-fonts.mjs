import fs from "node:fs";
import path from "node:path";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36";
const OUT = "public/fonts";
fs.mkdirSync(OUT, { recursive: true });
const targets = [
  { name: "archivo-var", css: "https://fonts.googleapis.com/css2?family=Archivo:wght@400..900&display=swap", filter: (b) => true },
  { name: "instrument-serif", css: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap", filter: (b) => true },
  { name: "plex-mono-400", css: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=swap", filter: (b) => true },
  { name: "plex-mono-500", css: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=swap", filter: (b) => true },
  { name: "plex-mono-600", css: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@600&display=swap", filter: (b) => true },
];
for (const t of targets) {
  const css = await (await fetch(t.css, { headers: { "User-Agent": UA } })).text();
  // take the last @font-face block (latin subset) and its url
  const blocks = [...css.matchAll(/\/\*\s*latin\s*\*\/\s*@font-face\s*\{([\s\S]*?)\}/g)];
  const body = blocks.length ? blocks[blocks.length - 1][1] : css;
  const url = (body.match(/url\((https:[^)]+\.woff2)\)/) || [])[1];
  if (!url) { console.log("MISS", t.name); continue; }
  const buf = Buffer.from(await (await fetch(url, { headers: { "User-Agent": UA } })).arrayBuffer());
  const file = path.join(OUT, t.name + ".woff2");
  fs.writeFileSync(file, buf);
  console.log(t.name, Math.round(buf.length / 1024) + "KB", url.slice(0, 60));
}
