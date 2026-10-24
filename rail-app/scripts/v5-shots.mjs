import puppeteer from "puppeteer-core";
import fs from "node:fs";
const OUT = "../screenshots/v4"; fs.mkdirSync(OUT,{recursive:true});
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-sandbox","--hide-scrollbars"] });
async function cap(name, path, y=0, w=1440, h=1000, wait=1500) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  const errs=[]; page.on("pageerror",e=>errs.push(String(e).slice(0,100)));
  await page.goto("http://127.0.0.1:3100"+path,{waitUntil:"load",timeout:60000});
  await page.evaluate(async()=>{const H=document.body.scrollHeight,s=innerHeight*.8;for(let i=0;i<H;i+=s){scrollTo(0,i);await new Promise(r=>setTimeout(r,120));}scrollTo(0,0);});
  await new Promise(r=>setTimeout(r,1200));
  if (y>0) { await page.evaluate(v=>scrollTo(0,v), y); await new Promise(r=>setTimeout(r,900)); }
  await new Promise(r=>setTimeout(r,wait));
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(name, "h=", await page.evaluate(()=>document.body.scrollHeight), "errs=", errs.length);
  await page.close();
}
await cap("home-hero","/",0,1440,1000,2000);
await cap("header","/",0,1440,260,600);
const total = 9200;
for (const [n,p] of [["home-problem",0.12],["home-how",0.26],["home-passport",0.40],["home-ledger",0.53],["home-rail",0.66],["home-closing",0.92]]) await cap(n,"/",Math.round(total*p),1440,1000,900);
await cap("market-hero","/market",0,1440,1000,1600);
await cap("agents-hero","/agents",0,1440,1000,1600);
await cap("run","/underwrite/hanbit",0,1440,1200,8500);
await cap("passport","/passport/hanbit",0,1440,1200,2000);
await cap("m-home","/",0,390,844,1800);
await browser.close();
