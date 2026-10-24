import puppeteer from "puppeteer-core";
import fs from "node:fs";
const OUT="../screenshots/v7"; fs.mkdirSync(OUT,{recursive:true});
const browser=await puppeteer.launch({executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true,args:["--no-sandbox","--hide-scrollbars"]});
const BASE="http://127.0.0.1:3100";
async function cap(name,path,w=1440,h=1000,action=null,wait=1200){
  const p=await browser.newPage(); await p.setViewport({width:w,height:h});
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,110))); p.on("console",m=>{if(m.type()==="error")errs.push(m.text().slice(0,110));});
  await p.goto(BASE+path,{waitUntil:"networkidle2",timeout:60000});
  await new Promise(r=>setTimeout(r,1200));
  if(action) await action(p);
  await new Promise(r=>setTimeout(r,wait));
  await p.screenshot({path:`${OUT}/${name}.png`});
  const m=await p.evaluate(()=>({path:location.pathname,w:document.documentElement.scrollWidth-innerWidth,h:document.body.scrollHeight,scroll:scrollY}));
  console.log(name,JSON.stringify(m),"errors",errs.length,errs.slice(0,2).join(" | "));
  await p.close();
}
const sec=(id)=>async(p)=>{await p.evaluate((id)=>{const el=document.querySelector(id); if(el) scrollTo(0,el.getBoundingClientRect().top+scrollY-80);},id); await new Promise(r=>setTimeout(r,400));};
await cap("ko-hero","/");
await cap("en-hero","/en");
await cap("ko-passport","/passport/hanbit");
await cap("en-passport","/en/passport/hanbit");
await cap("ko-run","/underwrite/hanbit",1440,1000,async(p)=>{await new Promise(r=>setTimeout(r,2600));},500);
await cap("ko-proof","/",1440,1000,sec("#proof"));
await cap("nitro-truth","/nitro",1440,1000,async(p)=>{await p.evaluate(()=>scrollTo(0,1350));},700);
await cap("m-menu","/",390,844,async(p)=>{const b=await p.$('button[aria-controls="mobile-menu"]'); if(b) await b.click();},600);
await cap("m-passport","/passport/hanbit",390,844,null,1200);
await browser.close();
