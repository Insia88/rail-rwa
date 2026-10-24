import puppeteer from "puppeteer-core";
import fs from "node:fs";
const OUT = "../screenshots/v2";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-sandbox","--hide-scrollbars"] });
async function warmup(page){await page.evaluate(async()=>{const h=document.body.scrollHeight,s=innerHeight*.75;for(let y=0;y<h;y+=s){scrollTo(0,y);await new Promise(r=>setTimeout(r,110));}scrollTo(0,0);});await new Promise(r=>setTimeout(r,700));}
for (const [name,path,wait] of [["m-underwrite","/underwrite",1200],["m-run","/underwrite/hanbit",7500],["m-passport","/passport/hanbit",1200],["m-market","/market",1200]]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto("http://127.0.0.1:3100"+path,{waitUntil:"networkidle2",timeout:45000});
  await warmup(page); await new Promise(r=>setTimeout(r,wait));
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("ok",name);
  await page.close();
}
await browser.close();
