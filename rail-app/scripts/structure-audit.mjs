import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args:["--no-sandbox","--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://127.0.0.1:3100/", { waitUntil:"networkidle2", timeout:60000 });
await new Promise(r=>setTimeout(r,1500));
const audit = await page.evaluate(() => {
  const h = document.body.scrollHeight;
  const sections = [...document.querySelectorAll("section[id]")].map(s => {
    const r = s.getBoundingClientRect();
    const h2 = s.querySelector("h1,h2")?.innerText?.replace(/\n/g," ").slice(0,60) || "";
    return { id: s.id, topInDoc: Math.round(r.top + scrollY), pctOfPage: +((r.top+scrollY)/h*100).toFixed(1), h2 };
  });
  const cta = [...document.querySelectorAll("a")].filter(a => /심사|여권|시작|보기|만들기/.test(a.innerText)).map(a => ({ text: a.innerText.trim().slice(0,30), href: a.getAttribute("href") }));
  const fold = [...document.querySelectorAll("h1,h2,p,a,button")].filter(el => { const r=el.getBoundingClientRect(); return r.top < 900 && r.bottom > 0; }).map(el=>el.tagName+":"+(el.innerText||"").trim().slice(0,40)).slice(0,20);
  return { pageHeight: h, viewports: +(h/900).toFixed(1), sectionCount: sections.length, sections, ctaCount: cta.length, ctas: cta.slice(0,14), fold };
});
console.log(JSON.stringify(audit, null, 1));
await browser.close();
