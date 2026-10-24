import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args:["--no-sandbox","--hide-scrollbars"] });
async function cap(name, w, h) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  await page.goto("http://127.0.0.1:3100/", { waitUntil:"networkidle2", timeout:60000 });
  await new Promise(r=>setTimeout(r,1200));
  const overflow = await page.evaluate(()=>document.documentElement.scrollWidth - innerWidth);
  await page.evaluate(()=>{const el=document.querySelector("#passport"); if(el) scrollTo(0, el.getBoundingClientRect().top+scrollY-90);});
  await new Promise(r=>setTimeout(r,1400));
  await page.screenshot({ path: `../screenshots/final2/${name}.png` });
  console.log(name, "overflowX=", overflow);
  await page.close();
}
await cap("passport-carousel2", 1440, 1000);
await cap("m-carousel2", 390, 844);
await browser.close();
