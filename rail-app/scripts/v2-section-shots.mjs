import puppeteer from "puppeteer-core";
import fs from "node:fs";
const OUT = "../screenshots/v2";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-sandbox","--hide-scrollbars"] });
async function warmup(page) {
  await page.evaluate(async () => {
    const h = document.body.scrollHeight; const step = window.innerHeight * 0.75;
    for (let y = 0; y < h; y += step) { window.scrollTo(0, y); await new Promise(r=>setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
  await new Promise(r=>setTimeout(r, 900));
}
const pages = [
 ["home", "/", [0, 0.16, 0.33, 0.5, 0.68, 0.85]],
 ["market", "/market", [0, 0.25, 0.5, 0.75]],
 ["agents", "/agents", [0, 0.3, 0.6]],
 ["underwrite", "/underwrite", [0, 0.45]],
];
for (const [name, path, positions] of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:3100"+path, { waitUntil: "networkidle2", timeout: 45000 });
  await warmup(page);
  const total = await page.evaluate(()=>document.body.scrollHeight);
  for (let i=0;i<positions.length;i++) {
    await page.evaluate((y)=>{ window.scrollTo(0, y); }, Math.round(total*positions[i]));
    await new Promise(r=>setTimeout(r, 700));
    await page.screenshot({ path: `${OUT}/${name}-sec${i}.png` });
  }
  console.log(name, "total", total);
  await page.close();
}
// run + passport viewport captures
for (const [name, path, waitMs] of [["run","/underwrite/hanbit",8000],["passport","/passport/hanbit",1500]]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1600, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:3100"+path, { waitUntil: "networkidle2", timeout: 45000 });
  await warmup(page);
  await new Promise(r=>setTimeout(r, waitMs));
  await page.screenshot({ path: `${OUT}/${name}-view.png`, fullPage: true });
  console.log(name, "ok");
  await page.close();
}
await browser.close();
