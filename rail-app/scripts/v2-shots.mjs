import puppeteer from "puppeteer-core";
const OUT = "../screenshots/v2";
import fs from "node:fs"; fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-sandbox","--hide-scrollbars"] });
const shots = [
 ["home-hero", "/", 1440, 1000, 1800, false],
 ["home-full", "/", 1440, 1000, 1800, true],
 ["market-full", "/market", 1440, 1000, 1400, true],
 ["agents-full", "/agents", 1440, 1000, 1200, true],
 ["underwrite-full", "/underwrite", 1440, 1000, 1200, true],
 ["run-hero", "/underwrite/hanbit", 1440, 1000, 8000, false],
 ["run-full", "/underwrite/hanbit", 1440, 1000, 8000, true],
 ["passport-full", "/passport/hanbit", 1440, 1000, 1500, true],
 ["home-mobile", "/", 390, 844, 1600, false],
];
for (const [name, path, w, h, wait, full] of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  const errors = [];
  page.on("console", m => { if (m.type()==="error") errors.push(m.text().slice(0,160)); });
  page.on("pageerror", e => errors.push("PAGEERR "+String(e).slice(0,160)));
  await page.goto("http://127.0.0.1:3100"+path, { waitUntil: "networkidle2", timeout: 45000 });
  await new Promise(r=>setTimeout(r, wait));
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
  const hh = await page.evaluate(()=>document.body.scrollHeight);
  console.log(`${name} ok h=${hh} errors=${errors.length}${errors.length?" :: "+errors.slice(0,3).join(" | "):""}`);
  await page.close();
}
await browser.close();
