import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe", headless:true, args:["--no-sandbox","--hide-scrollbars"] });
const p=await browser.newPage(); await p.setViewport({width:390,height:844});
const bad=[]; p.on("response",r=>{ if(r.status()>=400) bad.push(r.status()+" "+r.url()); });
await p.goto("http://127.0.0.1:3100/nitro",{waitUntil:"networkidle2",timeout:60000});
await new Promise(r=>setTimeout(r,900));
console.log("bad:",JSON.stringify(bad));
// lang switch on EN passport
const p2=await browser.newPage(); await p2.setViewport({width:1440,height:900});
await p2.goto("http://127.0.0.1:3100/en/passport/hanbit",{waitUntil:"domcontentloaded",timeout:60000});
await new Promise(r=>setTimeout(r,1200));
const links=await p2.evaluate(()=>[...document.querySelectorAll("a")].filter(a=>/^(KO|EN)$/.test(a.innerText.trim())).map(a=>({t:a.innerText.trim(),href:a.getAttribute("href")})));
console.log("langswitch:",JSON.stringify(links));
await browser.close();
