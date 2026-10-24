import puppeteer from "puppeteer-core";
import fs from "node:fs";
const OUT = "../screenshots/v3"; fs.mkdirSync(OUT,{recursive:true});
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-sandbox","--hide-scrollbars"] });
async function warmup(page){await page.evaluate(async()=>{const h=document.body.scrollHeight,s=innerHeight*.7;for(let y=0;y<h;y+=s){scrollTo(0,y);await new Promise(r=>setTimeout(r,140));}scrollTo(0,0);});await new Promise(r=>setTimeout(r,1200));}
// hero viewport
let page = await browser.newPage();
await page.setViewport({width:1440,height:1000});
await page.goto("http://127.0.0.1:3100/",{waitUntil:"networkidle2",timeout:45000});
await new Promise(r=>setTimeout(r,2000));
await page.screenshot({path:`${OUT}/home-hero.png`});
await page.close();
// sections
for (const [name,pos] of [["problem",0.13],["how",0.3],["passport",0.44],["rail",0.58],["market",0.74],["closing",0.92]]) {
  page = await browser.newPage();
  await page.setViewport({width:1440,height:1000});
  await page.goto("http://127.0.0.1:3100/",{waitUntil:"networkidle2",timeout:45000});
  await warmup(page);
  const total = await page.evaluate(()=>document.body.scrollHeight);
  await page.evaluate(y=>scrollTo(0,y), Math.round(total*pos));
  await new Promise(r=>setTimeout(r,1200));
  await page.screenshot({path:`${OUT}/home-${name}.png`});
  await page.close();
}
// pages
for (const [name,path,wait] of [["market","/market",1000],["agents","/agents",1000],["underwrite","/underwrite",1000],["run","/underwrite/hanbit",8000],["passport","/passport/hanbit",1500]]) {
  page = await browser.newPage();
  await page.setViewport({width:1440,height:1200});
  await page.goto("http://127.0.0.1:3100"+path,{waitUntil:"networkidle2",timeout:45000});
  await warmup(page); await new Promise(r=>setTimeout(r,wait));
  await page.screenshot({path:`${OUT}/${name}.png`, fullPage:true});
  await page.close();
}
// mobile
for (const [name,path,wait] of [["m-home","/",1200],["m-run","/underwrite/hanbit",7500],["m-passport","/passport/hanbit",1200],["m-market","/market",1200]]) {
  page = await browser.newPage();
  await page.setViewport({width:390,height:844,deviceScaleFactor:2});
  await page.goto("http://127.0.0.1:3100"+path,{waitUntil:"networkidle2",timeout:45000});
  await warmup(page); await new Promise(r=>setTimeout(r,wait));
  await page.screenshot({path:`${OUT}/${name}.png`});
  await page.close();
}
console.log("final screenshots done");
await browser.close();
