import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** RAIL 60s demo recorder — CDP screencast → ffmpeg. */
const BASE = process.env.BASE_URL || "https://rail-rwa.vercel.app";
const OUT = path.resolve(__dirname, "../../demo");
const FRAMES = path.join(OUT, "frames");
fs.rmSync(FRAMES, { recursive: true, force: true });
fs.mkdirSync(FRAMES, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const W = 1440, H = 900;
const frames = []; // {file, ts}

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars", "--disable-dev-shm-usage", `--window-size=${W},${H}`],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
const client = await page.createCDPSession();
await client.send("Page.enable");

const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 140)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 140)); });
page.on("requestfailed", (r) => { if (!r.url().includes("favicon")) errors.push("REQFAIL " + r.url().slice(0, 100)); });

let i = 0;
client.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
  const file = `f${String(i).padStart(5, "0")}.jpg`;
  fs.writeFileSync(path.join(FRAMES, file), Buffer.from(data, "base64"));
  frames.push({ file, ts: metadata.timestamp });
  i++;
  try { await client.send("Page.screencastFrameAck", { sessionId }); } catch {}
});

await client.send("Page.startScreencast", {
  format: "jpeg",
  quality: 80,
  maxWidth: W,
  maxHeight: H,
  everyNthFrame: 1,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CAPTION_CSS = `
  position:fixed;left:36px;bottom:30px;z-index:99999;display:flex;align-items:stretch;gap:0;
  font-family:"Pretendard Variable",Pretendard,"Malgun Gothic",sans-serif;
  background:rgba(7,9,8,.86);border:1px solid rgba(242,237,226,.16);
  backdrop-filter:blur(8px);color:#F2EDE2;pointer-events:none;
`;
async function caption(n, kicker, title, sub) {
  await page.evaluate(
    ({ css, n, kicker, title, sub }) => {
      let el = document.getElementById("rail-caption");
      if (!el) {
        el = document.createElement("div");
        el.id = "rail-caption";
        el.setAttribute("style", css);
        document.body.appendChild(el);
      }
      el.innerHTML = `
        <div style="display:flex;flex-direction:column;justify-content:center;padding:14px 18px;border-right:1px solid rgba(242,237,226,.14);min-width:110px">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.22em;color:rgba(242,237,226,.45)">${n}</div>
          <div style="margin-top:4px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.16em;color:#D9FF5C">${kicker}</div>
        </div>
        <div style="display:flex;flex-direction:column;justify-content:center;padding:14px 20px;max-width:640px">
          <div style="font-size:19px;font-weight:700;letter-spacing:-.01em">${title}</div>
          <div style="margin-top:4px;font-size:12.5px;color:rgba(242,237,226,.55)">${sub}</div>
        </div>`;
    },
    { css: CAPTION_CSS, n, kicker, title, sub },
  );
}
async function removeCaption() {
  await page.evaluate(() => document.getElementById("rail-caption")?.remove());
}

async function cursor() {
  await page.evaluate(() => {
    if (document.getElementById("rail-cursor")) return;
    const c = document.createElement("div");
    c.id = "rail-cursor";
    c.style.cssText =
      "position:fixed;left:0;top:0;width:22px;height:22px;z-index:99998;pointer-events:none;transform:translate(720px,520px);transition:transform .7s cubic-bezier(.22,1,.36,1);";
    c.innerHTML =
      '<div style="position:absolute;inset:0;border:1.5px solid rgba(242,237,226,.85);border-radius:50%"></div><div style="position:absolute;left:9px;top:9px;width:4px;height:4px;background:#FF4B1F"></div>';
    document.body.appendChild(c);
  });
}
async function moveCursor(x, y) {
  await page.evaluate(({ x, y }) => {
    const c = document.getElementById("rail-cursor");
    if (c) c.style.transform = `translate(${x}px,${y}px)`;
  }, { x, y });
  await sleep(750);
}
async function clickPulse() {
  await page.evaluate(() => {
    const c = document.getElementById("rail-cursor");
    if (!c) return;
    const ring = document.createElement("div");
    ring.style.cssText =
      "position:absolute;left:-8px;top:-8px;width:38px;height:38px;border:1px solid #FF4B1F;border-radius:50%;opacity:0;transition:all .45s ease-out";
    c.appendChild(ring);
    requestAnimationFrame(() => { ring.style.opacity = "1"; ring.style.transform = "scale(1.4)"; });
    setTimeout(() => ring.remove(), 600);
  });
  await sleep(350);
}
async function smoothScroll(to, duration = 900) {
  await page.evaluate(
    async ({ to, duration }) => {
      const start = window.scrollY;
      const delta = to - start;
      const t0 = performance.now();
      await new Promise((resolve) => {
        function step(t) {
          const p = Math.min(1, (t - t0) / duration);
          const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          window.scrollTo(0, start + delta * e);
          if (p < 1) requestAnimationFrame(step);
          else resolve();
        }
        requestAnimationFrame(step);
      });
    },
    { to, duration },
  );
  await sleep(250);
}
async function goto(url, wait = 2200) {
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => document.fonts?.ready);
  await sleep(wait);
}
async function titleCard(file, hold = 3000) {
  await page.goto("file:///" + path.resolve(__dirname, file).replace(/\\/g, "/"), {
    waitUntil: "load",
    timeout: 30000,
  });
  await page.evaluate(() => document.fonts?.ready);
  await sleep(700);
  await sleep(hold);
}

// ── timeline ─────────────────────────────────────────────────────────
await titleCard("title-intro.html", 3400);

await goto(BASE + "/", 2400);
await cursor();
await moveCursor(980, 640);
await sleep(500);

await caption("01 / 문제", "THE PROBLEM", "은행의 문법은 세 변수로 작동합니다.", "담보 · 업력 · 재무제표 — 은행이 읽지 못하는 매출");
await smoothScroll(900, 1100);
await sleep(1900);

await caption("02 / 작동 방식", "HOW IT WORKS", "네 개의 에이전트가, 은행이 하지 않는 일을 합니다.", "SCOUT → VERIFIER → UNDERWRITER → BROKER");
await smoothScroll(2500, 1200);
await sleep(1900);

await caption("03 / 신용 여권", "CREDIT PASSPORT", "점수는 숨기지 않습니다.", "증거·산식·약정·RWA 증서가 한 장에");
await smoothScroll(4100, 1300);
await sleep(2200);

await caption("04 / RWA 레일", "THE RWA RAIL", "자산과 돈이 같은 거래에서 움직입니다.", "$76.9B RWA · $25.6B 토큰화 사모신용 · $305B 스테이블코인");
await smoothScroll(6100, 1400);
await sleep(2300);

await goto(BASE + "/market", 2200);
await caption("05 / 시장", "MARKET WEATHER", "24시간 열린 시장, 잠들지 않는 신용.", "DefiLlama · ECB · Hyperliquid HIP-3 라이브");
await smoothScroll(520, 900);
await sleep(2300);

await goto(BASE + "/underwrite/hanbit", 7600);
await cursor();
await caption("06 / 심사 런", "AGENT UNDERWRITING", "에이전트가 증거를 모으고, 신용을 판정합니다.", "한빛전자 · 은행 3곳 거절 → RAIL 조건부 승인");
await moveCursor(980, 760);
await sleep(1200);
await smoothScroll(420, 1000);
await sleep(2600);

await goto(BASE + "/passport/hanbit", 2200);
await cursor();
await caption("07 / 여권", "THE ARTIFACT", "왜 이 금리인지, 전부 적혀 있습니다.", "증거 테이블 · 점수 산식 · 리스크 약정 · RWA 증서");
await smoothScroll(620, 1100);
await sleep(2400);
await smoothScroll(1500, 1100);
await sleep(2300);

await goto(BASE + "/", 1800);
await page.evaluate(() => window.scrollTo(0, 0));
await sleep(600);
await page.evaluate(() => window.dispatchEvent(new CustomEvent("rail:open-command")));
await sleep(700);
await page.type("input[aria-label='검색']", "한빛", { delay: 110 });
await caption("08 / ⌘K", "COMMAND PALETTE", "데모가 조작 가능해집니다.", "지원자·페이지·데이터 검색 · 키보드 내비");
await sleep(2000);
await page.keyboard.press("Escape");
await sleep(600);

await removeCaption().catch(() => {});
await titleCard("title-outro.html", 3600);

// stop
await sleep(300);
await client.send("Page.stopScreencast").catch(() => {});
await browser.close();

// ── encode ───────────────────────────────────────────────────────────
const concat = path.join(OUT, "concat.txt");
const lines = [];
for (let k = 0; k < frames.length; k++) {
  const dur = k < frames.length - 1 ? Math.max(0.03, Math.min(6, frames[k + 1].ts - frames[k].ts)) : 0.2;
  lines.push(`file 'frames/${frames[k].file}'`, `duration ${dur.toFixed(3)}`);
}
lines.push(`file 'frames/${frames[frames.length - 1].file}'`);
fs.writeFileSync(concat, lines.join("\n"), "utf8");
fs.writeFileSync(path.join(OUT, "meta.json"), JSON.stringify({ base: BASE, frames: frames.length, errors: [...new Set(errors)].slice(0, 20) }, null, 2));

const outFile = path.join(OUT, "RAIL-demo.mp4");
const ff = spawnSync(
  "ffmpeg",
  ["-y", "-f", "concat", "-safe", "0", "-i", concat, "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-movflags", "+faststart", outFile],
  { encoding: "utf8" },
);
console.log("frames:", frames.length);
console.log("errors:", [...new Set(errors)].slice(0, 6));
if (ff.status !== 0) console.log("ffmpeg stderr tail:", (ff.stderr || "").slice(-1200));
else console.log("video:", outFile, fs.existsSync(outFile) ? Math.round(fs.statSync(outFile).size / 1024) + "KB" : "missing");
