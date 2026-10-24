import puppeteer from "puppeteer-core";
const browser=await puppeteer.launch({executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true,args:["--no-sandbox","--hide-scrollbars"]});
async function cap(name,path,w=1440,h=1100,action=null){const p=await browser.newPage();await p.setViewport({width:w,height:h});const errs=[];p.on("pageerror",e=>errs.push(String(e).slice(0,100)));p.on("console",m=>{if(m.type()==="error")errs.push(m.text().slice(0,100));});await p.goto("http://127.0.0.1:3100"+path,{waitUntil:"networkidle2",timeout:60000});await new Promise(r=>setTimeout(r,1200));if(action)await action(p);await new Promise(r=>setTimeout(r,900));await p.screenshot({path:`../screenshots/v8/${name}.png`});console.log(name,"errors",errs.length,errs.slice(0,1).join(""));await p.close();}
await cap("home2","/");
await cap("passport2","/passport/hanbit");
await cap("m-passport2","/passport/hanbit",390,844);
await browser.close();
