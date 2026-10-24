import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe", headless:true, args:["--no-sandbox","--hide-scrollbars"] });
for (const path of ["/nitro","/feedback","/log"]) {
  const p=await browser.newPage(); await p.setViewport({width:390,height:844});
  const bad=[]; p.on("response",r=>{if(r.status()>=400) bad.push(r.status()+" "+r.url());});
  await p.goto("http://127.0.0.1:3100"+path,{waitUntil:"networkidle2",timeout:60000});
  await new Promise(r=>setTimeout(r,900));
  console.log(path,"bad:",JSON.stringify(bad));
  await p.close();
}
const p=await browser.newPage(); await p.setViewport({width:1440,height:900});
await p.goto("http://127.0.0.1:3100/en/underwrite/hanbit",{waitUntil:"networkidle2",timeout:60000});
const links=await p.evaluate(()=>[...document.querySelectorAll("a")].filter(a=>/^(KO|EN)$/.test(a.innerText.trim())).map(a=>({t:a.innerText.trim(),href:a.getAttribute("href")})));
console.log("langswitch(en/run):",JSON.stringify(links));
const p2=await browser.newPage(); await p2.setViewport({width:1440,height:900});
await p2.goto("http://127.0.0.1:3100/underwrite/hanbit",{waitUntil:"networkidle2",timeout:60000});
const l2=await p2.evaluate(()=>[...document.querySelectorAll("a")].filter(a=>/^(KO|EN)$/.test(a.innerText.trim())).map(a=>({t:a.innerText.trim(),href:a.getAttribute("href")})));
console.log("langswitch(ko/run):",JSON.stringify(l2));
await browser.close();
