import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args:["--no-sandbox","--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:3100/", { waitUntil:"networkidle2", timeout:60000 });
await new Promise(r=>setTimeout(r,1200));
const info = await page.evaluate(() => {
  const out = { innerWidth, scrollWidth: document.documentElement.scrollWidth, bodyScroll: document.body.scrollWidth, offenders: [] };
  const els = [...document.querySelectorAll("*")];
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width > innerWidth + 2 && r.height > 0) {
      out.offenders.push({ tag: el.tagName, cls: (el.className||"").toString().slice(0,90), w: Math.round(r.width), x: Math.round(r.x) });
      if (out.offenders.length > 14) break;
    }
  }
  return out;
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
