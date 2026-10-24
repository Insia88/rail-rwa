import puppeteer from "puppeteer-core";
import fs from "node:fs";
const OUT = "../screenshots";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-sandbox","--hide-scrollbars"] });
const pages = [["home-mobile-vp","/",1200],["run-mobile-vp","/underwrite/hanbit",7000],["passport-mobile-vp","/passport/hanbit",1200]];
for (const [name,path,wait] of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto("http://127.0.0.1:3100"+path, { waitUntil: "networkidle2", timeout: 45000 });
  await new Promise(r=>setTimeout(r,wait));
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await page.evaluate(()=>window.scrollTo(0, Math.round(document.body.scrollHeight*0.42)));
  await new Promise(r=>setTimeout(r,600));
  await page.screenshot({ path: `${OUT}/${name}-mid.png` });
  console.log("ok", name);
  await page.close();
}
await browser.close();
