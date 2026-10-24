import puppeteer from "puppeteer-core";
import fs from "node:fs";
const OUT = "../screenshots/v4";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-sandbox","--hide-scrollbars","--force-device-scale-factor=1"] });
async function shot(name, y, h=1000) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: h, deviceScaleFactor: 1 });
  const errors=[];
  page.on("pageerror", e=>errors.push(String(e).slice(0,120)));
  page.on("console", m=>{ if(m.type()==="error") errors.push(m.text().slice(0,120)); });
  await page.goto("http://127.0.0.1:3100/", { waitUntil: "load", timeout: 60000 });
  await page.evaluate(async () => {
    const h = document.body.scrollHeight, s = innerHeight*0.8;
    for (let y=0; y<h; y+=s) { scrollTo(0,y); await new Promise(r=>setTimeout(r,160)); }
    scrollTo(0,0); await new Promise(r=>setTimeout(r,600));
  });
  await new Promise(r=>setTimeout(r,1600));
  await page.evaluate(y=>scrollTo(0,y), y);
  await new Promise(r=>setTimeout(r,1400));
  await page.screenshot({ path: `${OUT}/${name}.png` });
  const hh = await page.evaluate(()=>document.body.scrollHeight);
  console.log(name, "total", hh, "errors", errors.length, errors.slice(0,2).join(" | "));
  await page.close();
}
const total = 8100;
await shot("home-hero", 0, 1000);
await shot("home-hero2", 0, 900);
await shot("home-problem", Math.round(total*0.12));
await shot("home-how", Math.round(total*0.26));
await shot("home-passport", Math.round(total*0.4));
await shot("home-ledger", Math.round(total*0.53));
await shot("home-rail", Math.round(total*0.66));
await browser.close();
