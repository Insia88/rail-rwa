import fs from "node:fs";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36";
async function grab(cssUrl, outFile) {
  const css = await (await fetch(cssUrl, { headers: { "User-Agent": UA } })).text();
  const blocks = [...css.matchAll(/\/\*\s*latin\s*\*\/\s*@font-face\s*\{([\s\S]*?)\}/g)];
  const body = blocks.length ? blocks[blocks.length - 1][1] : css;
  const url = (body.match(/url\((https:[^)]+\.woff2)\)/) || [])[1];
  if (!url) { console.log("MISS", outFile); return; }
  const buf = Buffer.from(await (await fetch(url, { headers: { "User-Agent": UA } })).arrayBuffer());
  fs.writeFileSync(outFile, buf);
  console.log(outFile, Math.round(buf.length / 1024) + "KB");
}
await grab("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0&display=swap", "public/fonts/instrument-serif-regular.woff2");
await grab("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&display=swap", "public/fonts/instrument-serif-italic.woff2");
fs.rmSync("public/fonts/instrument-serif.woff2", { force: true });
