import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args:["--no-sandbox","--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.goto("http://127.0.0.1:3100/", { waitUntil:"networkidle2", timeout:60000 });
await new Promise(r=>setTimeout(r,1200));
await page.evaluate(()=>{ const el=document.querySelector('[aria-label="지원자 신용 여권"]'); if(el) el.scrollIntoView({block:"center"}); });
await new Promise(r=>setTimeout(r,1200));
await page.screenshot({ path: "../screenshots/final2/m-carousel-card.png" });
// autoplay check
const before = await page.evaluate(()=>document.querySelector('[aria-roledescription="carousel"]')?.innerText?.match(/(\d{2}) \/ (\d{2})/)?.[0]);
await new Promise(r=>setTimeout(r,6500));
const after = await page.evaluate(()=>document.querySelector('[aria-roledescription="carousel"]')?.innerText?.match(/(\d{2}) \/ (\d{2})/)?.[0]);
console.log("autoplay:", before, "->", after);
await browser.close();
