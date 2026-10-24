// Competitor capture: viewport screenshot (1440x1200) + measured design facts.
// Run: node research/design/_capture/capture.mjs
// Evidence only — not a deliverable. Delete _capture/ after research is written.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(
  "C:/Users/User/Documents/deepseek-harness/default-workspace/rwa-nitro/rail-app/package.json",
);
const puppeteer = require("puppeteer-core");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = __dirname;

const sites = [
  ["linear", "https://linear.app/"],
  ["vercel", "https://vercel.com/"],
  ["stripe", "https://stripe.com/"],
  ["ramp", "https://ramp.com/"],
  ["mercury", "https://mercury.com/"],
  ["resend", "https://resend.com/"],
  ["attio", "https://attio.com/"],
  ["raycast", "https://www.raycast.com/"],
  ["framer", "https://www.framer.com/"],
  ["luma", "https://luma.com/"],
  ["arc", "https://arc.tech/"],
  ["family", "https://family.co/"],
  ["higgsfield", "https://higgsfield.ai/"],
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars", "--disable-dev-shm-usage", "--lang=en-US"],
});

const data = {};
for (const [name, url] of sites) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 1 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  );
  try {
    const res = await page.goto(url, { waitUntil: "networkidle2", timeout: 50000 });
    await new Promise((r) => setTimeout(r, 2600));
    const file = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: file });
    const info = await page.evaluate(() => {
      const cs = (el) => (el ? getComputedStyle(el) : null);
      const pick = (el, props) => {
        if (!el) return null;
        const s = getComputedStyle(el);
        const o = {};
        for (const p of props) o[p] = s[p];
        return o;
      };
      const h1 = document.querySelector("h1");
      const h2s = [...document.querySelectorAll("h2")].slice(0, 8).map((e) => e.innerText.trim().replace(/\s+/g, " ").slice(0, 120));
      const header = document.querySelector("header") || document.body;
      const navLinks = [...header.querySelectorAll("a")].slice(0, 12).map((a) => a.innerText.trim().replace(/\s+/g, " ").slice(0, 40)).filter(Boolean);
      const btns = [...document.querySelectorAll("a,button")].slice(0, 400)
        .map((el) => el.innerText.trim().replace(/\s+/g, " "))
        .filter((t) => t && t.length > 1 && t.length < 34 && /(start|get|demo|try|talk|contact|sign|open|book|explore|watch|build|create|download|buy|see)/i.test(t));
      const fontSet = new Set();
      for (const sel of ["h1", "h2", "p", "a", "button"]) {
        for (const el of [...document.querySelectorAll(sel)].slice(0, 25)) {
          fontSet.add(getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim());
        }
      }
      const text = document.body.innerText.replace(/\n{3,}/g, "\n\n");
      const footer = (document.querySelector("footer") || {}).innerText || "";
      const imgs = [...document.images].filter((i) => i.naturalWidth > 60);
      return {
        title: document.title,
        metaDescription: (document.querySelector('meta[name="description"]') || {}).content || "",
        themeColor: (document.querySelector('meta[name="theme-color"]') || {}).content || "",
        bodyBg: cs(document.body).backgroundColor,
        bodyColor: cs(document.body).color,
        bodyFont: cs(document.body).fontFamily,
        h1: h1 ? h1.innerText.replace(/\s+/g, " ").slice(0, 220) : null,
        h1Style: pick(h1, ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color", "textTransform"]),
        h2s,
        navLinks,
        ctaCandidates: [...new Set(btns)].slice(0, 10),
        fonts: [...fontSet].filter(Boolean).slice(0, 8),
        counts: {
          img: imgs.length,
          largeImg: imgs.filter((i) => i.naturalWidth > 900).length,
          video: document.querySelectorAll("video").length,
          canvas: document.querySelectorAll("canvas").length,
          svg: document.querySelectorAll("svg").length,
          sections: document.querySelectorAll("section").length,
          h1: document.querySelectorAll("h1").length,
        },
        firstFold: text.slice(0, 900),
        footerTail: footer.replace(/\s+/g, " ").slice(-500),
        imgAlts: imgs.slice(0, 6).map((i) => (i.alt || "").slice(0, 80)),
        imgSrcs: imgs.slice(0, 6).map((i) => i.currentSrc.slice(0, 130)),
      };
    });
    data[name] = { url, ok: true, status: res?.status(), finalUrl: page.url(), ...info };
    console.log(`OK ${name} status=${res?.status()} h1=${(info.h1 || "").slice(0, 60)}`);
  } catch (e) {
    data[name] = { url, ok: false, error: String(e).slice(0, 300) };
    console.log(`FAIL ${name}: ${String(e).slice(0, 200)}`);
  }
  await page.close();
  fs.writeFileSync(path.join(OUT, "data.json"), JSON.stringify(data, null, 2));
}
await browser.close();
console.log("done");
