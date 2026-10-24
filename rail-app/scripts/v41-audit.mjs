import puppeteer from "puppeteer-core";
import fs from "node:fs";
const OUT = "../screenshots/v5"; fs.mkdirSync(OUT,{recursive:true});
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args:["--no-sandbox","--hide-scrollbars"] });
const BASE = "http://127.0.0.1:3100";
async function measure(path, w=1440, h=900) {
  const p = await browser.newPage(); await p.setViewport({width:w,height:h});
  await p.goto(BASE+path,{waitUntil:"networkidle2",timeout:60000});
  await new Promise(r=>setTimeout(r,1400));
  const m = await p.evaluate(() => {
    const H1 = document.body.scrollHeight;
    const secs=[...document.querySelectorAll("section[id]")].map(s=>s.id);
    const links=[...document.querySelectorAll("a")];
    const actions=links.filter(l=>/심사|여권|시작|만들기|보기|요약|Demo|Run|Passport|Case|Proof|One-pager/i.test(l.innerText));
    return { path: location.pathname, height:H1, viewports:+(H1/900).toFixed(1), sections:secs, actionLinks:actions.length, overflowX:document.documentElement.scrollWidth-innerWidth, lang:document.documentElement.lang, canonical:document.querySelector('link[rel="canonical"]')?.href||null };
  });
  console.log("MEASURE", JSON.stringify(m));
  await p.close();
}
await measure("/");
await measure("/en");
// screenshots
async function cap(name, path, w=1440, h=1000, action=null, wait=1400) {
  const p = await browser.newPage(); await p.setViewport({width:w,height:h});
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,100))); p.on("console",m=>{if(m.type()==="error")errs.push(m.text().slice(0,100));});
  await p.goto(BASE+path,{waitUntil:"networkidle2",timeout:60000});
  await new Promise(r=>setTimeout(r,1200));
  if (action) await action(p);
  await new Promise(r=>setTimeout(r,wait));
  await p.screenshot({path:`${OUT}/${name}.png`});
  console.log("shot",name,"errors",errs.length);
  await p.close();
}
const sec=(id)=>async(p)=>{await p.evaluate((id)=>{const el=document.querySelector(id); if(el) scrollTo(0, el.getBoundingClientRect().top+scrollY-80);}, id); await new Promise(r=>setTimeout(r,400));};
await cap("hero2","/",1440,1000,null,1800);
await cap("case2","/",1440,1000,sec("#case"),1200);
await cap("run-done2","/",1440,1000,async(p)=>{await sec("#run")(p); const btns=await p.$$("button"); for(const b of btns){const t=await b.evaluate(e=>e.innerText||""); if(/심사 실행|실행/.test(t)){await b.click(); break;}} await new Promise(r=>setTimeout(r,3000));},800);
await cap("proof2","/",1440,1000,sec("#proof"),900);
await cap("en-hero","/en",1440,1000,null,1800);
await cap("en-case","/en",1440,1000,sec("#case"),1200);
await cap("m-hero2","/",390,844,null,1600);
await browser.close();
