import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe", headless:true, args:["--no-sandbox","--hide-scrollbars"] });
async function cap(name,path,scroll=0,w=1440,h=1000){
  const p=await browser.newPage(); await p.setViewport({width:w,height:h});
  await p.goto("http://127.0.0.1:3100"+path,{waitUntil:"networkidle2",timeout:60000});
  await new Promise(r=>setTimeout(r,1200));
  if(scroll) { await p.evaluate((y)=>scrollTo(0,y),scroll); await new Promise(r=>setTimeout(r,800)); }
  await p.screenshot({path:`../screenshots/v6/${name}.png`});
  await p.close(); console.log("cap",name);
}
await cap("nitro-hero2","/nitro");
await cap("ko-demo-path2","/",760);
await cap("log-top2","/log");
await browser.close();
