import puppeteer from "puppeteer-core";
const browser=await puppeteer.launch({executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true,args:["--no-sandbox","--hide-scrollbars"]});
async function cap(name,path,w=1440,h=1100,action=null){const p=await browser.newPage();await p.setViewport({width:w,height:h});await p.goto("http://127.0.0.1:3100"+path,{waitUntil:"networkidle2",timeout:60000});await new Promise(r=>setTimeout(r,1200));if(action)await action(p);await new Promise(r=>setTimeout(r,900));await p.screenshot({path:`../screenshots/v8/${name}.png`});await p.close();}
await cap("home3","/");
await cap("home-artifact2","/",1440,1100,async(p)=>{await p.evaluate(()=>{const el=document.querySelector("#passport"); if(el) scrollTo(0,el.getBoundingClientRect().top+scrollY-80);});});
await cap("m-home2","/",390,844);
await browser.close();
