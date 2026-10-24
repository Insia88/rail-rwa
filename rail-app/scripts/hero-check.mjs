import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args:["--no-sandbox","--hide-scrollbars"] });
for (const [name,path] of [["en-hero2","/en"],["hero3","/"]]) {
  const p = await browser.newPage(); await p.setViewport({width:1440,height:1000});
  await p.goto("http://127.0.0.1:3100"+path,{waitUntil:"networkidle2",timeout:60000});
  await new Promise(r=>setTimeout(r,2000));
  await p.screenshot({path:`../screenshots/v5/${name}.png`});
  const info = await p.evaluate(()=>{const h=document.querySelector("h1"); const r=h?.getBoundingClientRect(); return {h1:h?.innerText.replace(/\n/g," | "), h1Width:r?Math.round(r.width):null, docWidth:document.documentElement.scrollWidth, innerWidth};});
  console.log(name, JSON.stringify(info));
  await p.close();
}
await browser.close();
