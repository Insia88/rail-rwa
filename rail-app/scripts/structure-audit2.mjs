import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args:["--no-sandbox","--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://127.0.0.1:3100/", { waitUntil:"networkidle2", timeout:60000 });
await new Promise(r=>setTimeout(r,1200));
const a = await page.evaluate(() => {
  const H = document.body.scrollHeight;
  const secs = [...document.querySelectorAll("section[id]")].map(s => ({ id: s.id, top: Math.round(s.getBoundingClientRect().top + scrollY), h2: (s.querySelector("h2")?.innerText||"").replace(/\n/g," ").slice(0,50) }));
  const links = [...document.querySelectorAll("a")];
  const primary = links.filter(l => /심사|여권|시작|만들기|보기/.test(l.innerText));
  const buttons = [...document.querySelectorAll("button")].map(b=>b.innerText.trim()).filter(Boolean);
  return { pageHeight: H, viewports: +(H/900).toFixed(1), sections: secs, linkCount: links.length, actionLinks: primary.length, buttons, h1: document.querySelector("h1")?.innerText.replace(/\n/g," ") };
});
console.log(JSON.stringify(a, null, 1));
await browser.close();
