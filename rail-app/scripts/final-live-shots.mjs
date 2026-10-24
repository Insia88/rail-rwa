import puppeteer from "puppeteer-core";
import fs from "node:fs";
const OUT = "../screenshots/final"; fs.mkdirSync(OUT,{recursive:true});
const BASE = "https://rail-rwa.vercel.app";
let browser;
try {
  browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-sandbox","--hide-scrollbars"] });
  async function cap(name, path, y=0, w=1440, h=1000, wait=1800) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.goto(BASE+path, { waitUntil: "load", timeout: 60000 });
    await page.evaluate(async()=>{const H=document.body.scrollHeight,s=innerHeight*.85;for(let i=0;i<H;i+=s){scrollTo(0,i);await new Promise(r=>setTimeout(r,100));}scrollTo(0,0);});
    await new Promise(r=>setTimeout(r,900));
    if (y>0) { await page.evaluate(v=>scrollTo(0,v), y); await new Promise(r=>setTimeout(r,800)); }
    await new Promise(r=>setTimeout(r,wait));
    await page.screenshot({ path: `${OUT}/${name}.png` });
    console.log("ok", name);
    await page.close();
  }
  await cap("home-hero","/",0,1440,1000,2200);
  await cap("home-ledger","/",Math.round(9200*0.55),1440,1000,900);
  await cap("run","/underwrite/hanbit",0,1440,1200,8000);
  await cap("passport","/passport/hanbit",0,1440,1200,2000);
  await cap("m-home","/",0,390,844,1800);
  await cap("header","/",0,1440,180,600);
} catch (e) {
  console.log("ERR", String(e).slice(0,200));
} finally {
  if (browser) await browser.close();
}
console.log("done");
