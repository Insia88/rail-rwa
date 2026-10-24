import puppeteer from "puppeteer-core";
import fs from "node:fs";
const OUT = "../screenshots/v5"; fs.mkdirSync(OUT,{recursive:true});
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args:["--no-sandbox","--hide-scrollbars"] });
const BASE = "http://127.0.0.1:3100";
// structure audit
let page = await browser.newPage();
await page.setViewport({width:1440,height:900});
await page.goto(BASE+"/",{waitUntil:"networkidle2",timeout:60000});
await new Promise(r=>setTimeout(r,1600));
const audit = await page.evaluate(() => {
  const H = document.body.scrollHeight;
  const secs = [...document.querySelectorAll("section[id]")].map(s=>({id:s.id, top:Math.round(s.getBoundingClientRect().top+scrollY), h2:(s.querySelector("h2")?.innerText||"").replace(/\n/g," ").slice(0,56)}));
  const links=[...document.querySelectorAll("a")];
  const actions=links.filter(l=>/심사|여권|시작|만들기|보기|요약|Demo|Passport|Case|Proof/i.test(l.innerText));
  return {height:H, viewports:+(H/900).toFixed(1), sectionCount:secs.length, sections:secs, actionLinks:actions.length, actionTexts:actions.map(a=>a.innerText.trim().slice(0,24)), overflowX: document.documentElement.scrollWidth-innerWidth};
});
console.log("AUDIT", JSON.stringify(audit));
await page.close();
// screenshots
async function cap(name, path, w=1440, h=1000, action=null, wait=1500) {
  const p = await browser.newPage(); await p.setViewport({width:w,height:h});
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,100))); p.on("console",m=>{if(m.type()==="error")errs.push(m.text().slice(0,100));});
  await p.goto(BASE+path,{waitUntil:"networkidle2",timeout:60000});
  await p.evaluate(async()=>{const H=document.body.scrollHeight,s=innerHeight*.85;for(let i=0;i<H;i+=s){scrollTo(0,i);await new Promise(r=>setTimeout(r,80));}scrollTo(0,0);});
  await new Promise(r=>setTimeout(r,1000));
  if (action) await action(p);
  await new Promise(r=>setTimeout(r,wait));
  await p.screenshot({path:`${OUT}/${name}.png`});
  console.log("shot",name,"errors",errs.length);
  await p.close();
}
const sec=(id)=>async(p)=>{await p.evaluate((id)=>{const el=document.querySelector(id); if(el) scrollTo(0, el.getBoundingClientRect().top+scrollY-80);}, id); await new Promise(r=>setTimeout(r,500));};
await cap("hero","/",1440,1000,null,1800);
await cap("case","/",1440,1000,sec("#case"));
await cap("run-idle","/",1440,1000,sec("#run"),900);
await cap("run-done","/",1440,1000,async(p)=>{await sec("#run")(p); const btn=[...await p.$$("button")]; for(const b of btn){const t=await (await b.evaluate(e=>e.innerText||"")).trim(); if(/심사 실행|실행/.test(t)){await b.click(); break;}} await new Promise(r=>setTimeout(r,3200));},1200);
await cap("passport","/",1440,1000,sec("#passport"));
await cap("proof","/",1440,1000,sec("#proof"));
await cap("closing","/",1440,1000,sec("#proof"));
await cap("m-hero","/",390,844,null,1600);
await cap("m-run","/",390,844,sec("#run"),1000);
await cap("en-hero","/en",1440,1000,null,1800);
await cap("en-full","/en",1440,2400,null,1800);
await browser.close();
