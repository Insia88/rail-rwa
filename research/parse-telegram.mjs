import fs from "node:fs";
import * as cheerio from "cheerio";

const SRC =
  "C:/Users/User/Downloads/Telegram Desktop/ChatExport_2026-10-22/hased carrot message.html";
const OUT_JSON = new URL("./raw/messages.json", import.meta.url);
const OUT_MD = new URL("./raw/messages.md", import.meta.url);

const html = fs.readFileSync(SRC, "utf8");
const $ = cheerio.load(html);

const messages = [];

function cleanText(el) {
  // collapse <br> to newlines inside a .text node
  const clone = $(el).clone();
  clone.find("br").replaceWith("\n");
  clone.find("a").each((_, a) => {
    const href = $(a).attr("href");
    const label = $(a).text().trim();
    if (href && !label) $(a).replaceWith(href);
    else if (href && label && !label.includes("http")) $(a).replaceWith(`${label} (${href})`);
  });
  let t = clone.text();
  t = t.replace(/\u00a0/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  return t;
}

$(".message").each((_, el) => {
  const $el = $(el);
  const id = $el.attr("id") || "";
  const isService = $el.hasClass("service");
  const dateTitle = $el.find(">.body > .date, >.body .date.details").first().attr("title") || "";
  if (isService) {
    const details = $el.find(".body.details").text().trim();
    if (details) messages.push({ kind: "service", id, date: dateTitle, text: details });
    return;
  }
  const $body = $el.find(">.body").first();
  const date = $body.find(">.date.details").attr("title") || dateTitle;
  const from = $body.find(">.from_name").text().trim();
  const $text = $body.find(">.text").first();
  let text = $text.length ? cleanText($text) : "";
  // caption for media lives in .text under .media_wrap sometimes; fallback
  if (!text) {
    const cap = $body.find(".media_wrap .text").first();
    if (cap.length) text = cleanText(cap);
  }
  const media = [];
  $body.find(".media_wrap a, .media_wrap .photo, .media_wrap .video, .media_wrap .document").each((_, m) => {
    const href = $(m).attr("href");
    if (href) media.push(href);
  });
  $body.find("a").each((_, a) => {
    const href = $(a).attr("href");
    if (href && !href.startsWith("#") && !href.startsWith("http")) media.push(href);
  });
  const fwd = $body.find(">.forwarded .from_name, >.forwarded .text").text().trim();
  const replyTo = $body.find(">.reply_to .text").text().trim();
  const reactions = [];
  $body.find(".reactions .reaction").each((_, r) => {
    const emoji = $(r).find(".emoji").text().trim();
    const count = $(r).find(".count").text().trim();
    if (emoji) reactions.push(`${emoji}${count}`);
  });
  const links = [];
  $body.find(".text a").each((_, a) => {
    const href = $(a).attr("href");
    if (href && /^https?:/.test(href)) links.push(href);
  });
  const grouped = $body.find(".grouped_wrap .message").length > 0;

  if (!text && media.length === 0 && !isService) return; // skip empty
  messages.push({
    kind: "message",
    id,
    date,
    from,
    text,
    media: [...new Set(media)].filter((m) => !/^https?:/.test(m)),
    links: [...new Set(links)],
    reactions,
    ...(fwd ? { forwarded: fwd } : {}),
    ...(replyTo ? { replyTo } : {}),
    ...(grouped ? { grouped: true } : {}),
  });
});

fs.mkdirSync(new URL("./raw/", import.meta.url), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify({ source: SRC, count: messages.length, messages }, null, 2), "utf8");

// Markdown dump
const md = [];
md.push(`# Simon's Rabbit Hole — Telegram export (${messages.filter(m => m.kind === "message").length} msgs)\n`);
let lastDate = "";
for (const m of messages) {
  if (m.kind === "service") {
    md.push(`\n---\n> _${m.text}_ (${m.date})\n`);
    continue;
  }
  const d = m.date || "";
  const dm = d.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  const day = dm ? `${dm[3]}-${dm[2]}-${dm[1]}` : d;
  if (day !== lastDate) {
    md.push(`\n## ${day}\n`);
    lastDate = day;
  }
  const meta = [m.date?.slice(12, 17), m.reactions?.length ? `[${m.reactions.join(" ")}]` : "", m.forwarded ? `FWD:${m.forwarded.slice(0, 40)}` : ""].filter(Boolean).join(" · ");
  md.push(`### ${m.id} · ${meta}\n`);
  if (m.replyTo) md.push(`> REP: ${m.replyTo.replace(/\n/g, " ").slice(0, 160)}\n`);
  if (m.text) md.push(`${m.text}\n`);
  if (m.media?.length) md.push(`_(media: ${m.media.length} files, e.g. ${m.media.slice(0, 3).join(", ")})_\n`);
  if (m.links?.length) md.push(`links: ${m.links.join(" | ")}\n`);
}
fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");

console.log(`parsed: ${messages.length} blocks, ${messages.filter((m) => m.kind === "message").length} messages`);
console.log("date range:", messages.find((m) => m.date)?.date, "→", [...messages].reverse().find((m) => m.date)?.date);
const withText = messages.filter((m) => m.kind === "message" && m.text);
console.log("messages with text:", withText.length, "| total chars:", withText.reduce((a, b) => a + b.text.length, 0));
