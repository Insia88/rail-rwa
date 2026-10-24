import puppeteer from "puppeteer-core";
import fs from "node:fs";
const OUT="../screenshots/v6"; fs.mkdirSync(OUT,{recursive:true});
const browser = await puppeteer.launch({ executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe", headless:true, args:["--no-sandbox","--hide-scrollbars"] });
const BASE="http://127.0.0.1:3100";
async function shot(name,path,w=1440,h=1000,action=null,wait=1200){
  const p=await browser.newPage(); await p.setViewport({width:w,height:h});
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,110))); p.on("console",m=>{if(m.type()==="error")errs.push(m.text().slice(0,110));});
  await p.goto(BASE+path,{waitUntil:"networkidle2",timeout:60000});
  await new Promise(r=>setTimeout(r,1000));
  if(action) await action(p);
  await new Promise(r=>setTimeout(r,wait));
  await p.screenshot({path:`${OUT}/${name}.png`});
  const m=await p.evaluate(()=>({path:location.pathname,overflowX:document.documentElement.scrollWidth-innerWidth,lang:document.documentElement.lang,bar:!!document.querySelector('[aria-label="Language"]')}));
  console.log(name,JSON.stringify(m),"errors",errs.length,errs.slice(0,2).join(" | "));
  await p.close();
}
await shot("nitro-hero","/nitro",1440,1000);
await shot("feedback-hero","/feedback",1440,1000);
await shot("log-top","/log",1440,1000);
await shot("ko-demo-path","/",1440,1000,async(p)=>{await p.evaluate(()=>scrollTo(0,760));},900);
await shot("en-start-here","/en",1440,1000,async(p)=>{await p.evaluate(()=>scrollTo(0,700));},900);
await shot("en-underwriter","/en/underwrite",1440,1000);
await shot("en-run","/en/underwrite/hanbit",1440,1000,async(p)=>{await new Promise(r=>setTimeout(r,2600));},800);
await shot("en-passport","/en/passport/hanbit",1440,1000);
await shot("en-market","/en/market",1440,1000);
await shot("ko-run-regression","/underwrite/hanbit",1440,1000);
await shot("m-nitro","/nitro",390,844);
await shot("m-en-underwrite","/en/underwrite",390,844);
// language switch context check
const p=await browser.newPage(); await p.setViewport({width:1440,height:900});
await p.goto(BASE+"/en/passport/hanbit",{waitUntil:"networkidle2"});
const links=await p.evaluate(()=>[...document.querySelectorAll('a[aria-label="Language"] a,.flex.h-9 a')].filter(a=>/KO|EN/.test(a.innerText)).map(a=>({t:a.innerText,href:a.getAttribute("href")})));
console.log("langswitch(en/passport):",JSON.stringify(links));
await browser.close();
