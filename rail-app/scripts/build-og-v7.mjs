import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, "../../design/og-v7/index.html");
const outPng = path.resolve(__dirname, "../../rail-app/app/opengraph-image.png");
const pubPng = path.resolve(__dirname, "../public/og-v7.png");

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto("file:///" + htmlPath.replace(/\\/g, "/"), {
  waitUntil: "networkidle2",
  timeout: 60000,
});
await page.evaluate(() => document.fonts?.ready);
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: outPng, type: "png" });
fs.copyFileSync(outPng, pubPng);
console.log("og:", outPng, Math.round(fs.statSync(outPng).size / 1024) + "KB");
await browser.close();
