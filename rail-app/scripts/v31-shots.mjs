import puppeteer from "puppeteer-core";
import fs from "node:fs";
const OUT = "../screenshots/final2"; fs.mkdirSync(OUT,{recursive:true});
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args:["--no-sandbox","--hide-scrollbars"] });
async function cap(name, path, action, w=1440, h=1000, wait=1800) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  const errors=[]; page.on("pageerror",e=>errors.push(String(e).slice(0,120))); page.on("console",m=>{if(m.type()==="error")errors.push(m.text().slice(0,120));});
  await page.goto("http://127.0.0.1:3100"+path, { waitUntil:"load", timeout:60000 });
  await page.evaluate(async()=>{const H=document.body.scrollHeight,s=innerHeight*.8;for(let i=0;i<H;i+=s){scrollTo(0,i);await new Promise(r=>setTimeout(r,90));}scrollTo(0,0);});
  await new Promise(r=>setTimeout(r,1000));
  if (action) await action(page);
  await new Promise(r=>setTimeout(r,wait));
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(name, "errors=", errors.length, errors.slice(0,2).join(" | "));
  await page.close();
}
const scrollToSection = (id) => async (page) => {
  await page.evaluate((id)=>{ const el=document.querySelector(id); if(el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90); }, id);
};
await cap("hero","/", null, 1440, 1000, 2200);
await cap("passport-carousel","/", scrollToSection("#passport"), 1440, 1000, 1500);
await cap("m-carousel","/", scrollToSection("#passport"), 390, 844, 1500);
await cap("m-hero","/", null, 390, 844, 1600);
// font + carousel checks
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
await page.goto("http://127.0.0.1:3100/", { waitUntil:"networkidle2", timeout:60000 });
await new Promise(r=>setTimeout(r,1500));
const info = await page.evaluate(() => ({
  archivo: document.fonts.check("600 16px Archivo"),
  serif: document.fonts.check("italic 16px 'Instrument Serif'"),
  mono: document.fonts.check("400 16px 'IBM Plex Mono'"),
  headings: [...document.querySelectorAll("h1,h2")].slice(0,3).map(h=>getComputedStyle(h).fontFamily),
  bodyBg: getComputedStyle(document.body).backgroundColor,
}));
console.log("fonts:", JSON.stringify(info));
await page.close();
await browser.close();
