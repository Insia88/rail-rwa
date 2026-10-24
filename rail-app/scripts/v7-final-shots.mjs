import puppeteer from "puppeteer-core";
const browser=await puppeteer.launch({executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true,args:["--no-sandbox","--hide-scrollbars"]});
async function cap(name,path,w,h,wait=1200,action=null){
  const p=await browser.newPage(); await p.setViewport({width:w,height:h});
  await p.goto("http://127.0.0.1:3100"+path,{waitUntil:"networkidle2",timeout:60000});
  await new Promise(r=>setTimeout(r,1200)); if(action) await action(p); await new Promise(r=>setTimeout(r,wait));
  await p.screenshot({path:`../screenshots/v7/${name}.png`});
  const el=await p.evaluate(()=>{const e=document.querySelector("#cover-limit, [data-testid='limit']"); return e? e.innerText : null;});
  console.log(name,"overflow",await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth));
  await p.close();
}
await cap("ko-passport2","/passport/hanbit",1440,1000);
await cap("m-passport2","/passport/hanbit",390,844);
await cap("en-passport2","/en/passport/hanbit",1440,1000);
await cap("ko-run2","/underwrite/hanbit",1440,1000,1600,async(p)=>{await new Promise(r=>setTimeout(r,7000));});
await browser.close();
