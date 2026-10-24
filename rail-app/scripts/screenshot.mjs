import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE_URL || "http://127.0.0.1:3100";
const OUT = path.resolve("..", "screenshots");
fs.mkdirSync(OUT, { recursive: true });

const targets = [
  { name: "home-desktop", path: "/", width: 1440, height: 1000, wait: 1500 },
  { name: "home-mobile", path: "/", width: 390, height: 844, wait: 1200 },
  { name: "market-desktop", path: "/market", width: 1440, height: 1000, wait: 1200 },
  { name: "agents-desktop", path: "/agents", width: 1440, height: 1000, wait: 800 },
  { name: "underwrite-desktop", path: "/underwrite", width: 1440, height: 1000, wait: 800 },
  { name: "run-hanbit-desktop", path: "/underwrite/hanbit", width: 1440, height: 1000, wait: 7500 },
  { name: "run-hanbit-mobile", path: "/underwrite/hanbit", width: 390, height: 844, wait: 7500 },
  { name: "passport-hanbit-desktop", path: "/passport/hanbit", width: 1440, height: 1000, wait: 1200 },
  { name: "passport-hanbit-mobile", path: "/passport/hanbit", width: 390, height: 844, wait: 1200 },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars", "--disable-dev-shm-usage"],
});

const problems = [];
for (const t of targets) {
  const page = await browser.newPage();
  await page.setViewport({ width: t.width, height: t.height, deviceScaleFactor: 1 });
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 300));
  });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + String(e).slice(0, 300)));
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (!u.includes("favicon")) errors.push("REQFAIL: " + u.slice(0, 120));
  });
  try {
    const res = await page.goto(BASE + t.path, { waitUntil: "networkidle2", timeout: 45000 });
    await new Promise((r) => setTimeout(r, t.wait));
    const file = path.join(OUT, `${t.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const h = await page.evaluate(() => document.body.scrollHeight);
    console.log(`OK ${t.name} status=${res?.status()} height=${h}px errors=${errors.length}`);
    if (errors.length) problems.push({ name: t.name, errors: [...new Set(errors)].slice(0, 6) });
  } catch (e) {
    console.log(`FAIL ${t.name}: ${String(e).slice(0, 300)}`);
    problems.push({ name: t.name, errors: [String(e).slice(0, 300)] });
  }
  await page.close();
}
await browser.close();

if (problems.length) {
  console.log("\n== problems ==");
  for (const p of problems) {
    console.log(`\n[${p.name}]`);
    for (const e of p.errors) console.log(" - " + e);
  }
} else {
  console.log("\nNo console/request errors.");
}
