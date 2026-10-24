#!/usr/bin/env node
/**
 * RAIL art MCP server — a real stdio MCP server for the local art pipeline.
 *
 * Why this exists: the RAIL v2 design needed cinematic imagery. Higgsfield and Adobe
 * MCPs require a paid account/OAuth (see research/design/mcp-image.md) and are not
 * connected in this environment, so the art pipeline is local (numpy/Pillow +
 * headless Chrome). This MCP server exposes that pipeline to any agent.
 *
 * Run:  node mcp/art-server.mjs
 * Wire: {"mcpServers":{"rail-art":{"command":"node","args":["mcp/art-server.mjs"],
 *        "cwd":"<repo>/rail-app"}}}
 *
 * Tools:
 *  - list_art_assets      : list generated assets + sizes
 *  - art_pipeline_status  : local generator / Higgsfield / Adobe configuration state
 *  - regenerate_art       : re-run scripts/art/gen_art.py (optional target)
 *  - regenerate_og        : re-render the share card (scripts/art/og_v2.mjs)
 *
 * No external dependencies. Newline-delimited JSON-RPC 2.0 over stdio.
 */

import { createInterface } from "node:readline";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..");
const ART_DIR = path.join(REPO, "public", "art");
const PYTHON =
  process.env.RAIL_PYTHON ||
  "C:\\Users\\User\\.dsh\\dsh-runtimes\\dsh-primary-runtime\\dependencies\\python\\python.exe";

const SERVER_INFO = { name: "rail-art", version: "1.0.0" };

const TOOLS = [
  {
    name: "list_art_assets",
    description: "RAIL v2 아트 자산 목록(파일명/크기/수정시각)을 반환합니다.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "art_pipeline_status",
    description:
      "아트 파이프라인 상태를 반환합니다. 로컬 생성기 준비 여부, Higgsfield/Adobe 자격증명 감지 여부, 각 자산 경로.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "regenerate_art",
    description:
      "로컬 생성기(scripts/art/gen_art.py)를 실행해 아트 자산을 재생성합니다. target을 주면 해당 자산만 생성 시도합니다.",
    inputSchema: {
      type: "object",
      properties: {
        target: {
          type: "string",
          enum: [
            "hero-rail",
            "passport-chrome",
            "orange-band",
            "chrome-ribbon",
            "halftone-grid",
            "grain",
            "agents-scan",
            "all",
          ],
          description: "재생성할 자산 (기본 all)",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "regenerate_og",
    description: "공유 카드(public/art/og-v2.png)를 HTML→Chrome 렌더로 다시 생성합니다.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

function text(payload) {
  return { content: [{ type: "text", text: typeof payload === "string" ? payload : JSON.stringify(payload, null, 2) }] };
}
function fail(message) {
  return { content: [{ type: "text", text: message }], isError: true };
}

function run(cmd, args) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd: REPO, shell: false });
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => (out += d.toString()));
    child.stderr.on("data", (d) => (err += d.toString()));
    child.on("close", (code) => resolve({ code, out: out.slice(-4000), err: err.slice(-2000) }));
    child.on("error", (e) => resolve({ code: -1, out: "", err: String(e) }));
  });
}

function listAssets() {
  if (!fs.existsSync(ART_DIR)) return [];
  return fs
    .readdirSync(ART_DIR)
    .filter((f) => /\.(webp|png|jpg|jpeg)$/i.test(f))
    .map((f) => {
      const p = path.join(ART_DIR, f);
      const st = fs.statSync(p);
      return { file: `public/art/${f}`, bytes: st.size, kb: Math.round(st.size / 1024), updatedAt: st.mtime.toISOString() };
    });
}

async function callTool(name, args) {
  switch (name) {
    case "list_art_assets":
      return text({ assets: listAssets(), count: listAssets().length });

    case "art_pipeline_status":
      return text({
        localGenerator: {
          script: "scripts/art/gen_art.py",
          python: PYTHON,
          pythonExists: fs.existsSync(PYTHON),
          ready: fs.existsSync(path.join(REPO, "scripts", "art", "gen_art.py")),
        },
        ogRenderer: {
          script: "scripts/art/og_v2.mjs",
          ready: fs.existsSync(path.join(REPO, "scripts", "art", "og_v2.mjs")),
        },
        providers: {
          higgsfield: process.env.HIGGSFIELD_API_KEY
            ? "API key detected — official MCP exists (https://mcp.higgsfield.ai/mcp) but adapter is not implemented; REST schema marked 확인 필요 in research/design/mcp-image.md"
            : "not configured — requires paid subscription + browser OAuth (MCP) or API key + $5 credit (API)",
          adobe: process.env.ADOBE_FIREFLY_CLIENT_ID
            ? "credentials detected — Firefly/Photoshop APIs require an Enterprise contract; no official Adobe MCP verified"
            : "not configured — Enterprise contract + IMS OAuth required; no official Adobe MCP verified",
        },
        docs: "research/design/mcp-image.md",
        assets: listAssets(),
      });

    case "regenerate_art": {
      const target = typeof args?.target === "string" ? args.target : "all";
      if (!fs.existsSync(PYTHON)) return fail(`python not found: ${PYTHON}`);
      const res = await run(PYTHON, [path.join(REPO, "scripts", "art", "gen_art.py"), "--target", target]);
      if (res.code !== 0) return fail(`gen_art.py failed (${res.code})\n${res.err || res.out}`);
      return text({ ok: true, target, stdoutTail: res.out, assets: listAssets() });
    }

    case "regenerate_og": {
      const res = await run(process.execPath, [path.join(REPO, "scripts", "art", "og_v2.mjs")]);
      if (res.code !== 0) return fail(`og_v2.mjs failed (${res.code})\n${res.err || res.out}`);
      return text({ ok: true, stdoutTail: res.out, assets: listAssets() });
    }

    default:
      return fail(`unknown tool: ${name}`);
  }
}

async function handle(msg) {
  const { id, method, params } = msg;
  if (!method) return null;
  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id: id ?? null,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
        instructions:
          "RAIL art pipeline MCP. list_art_assets / art_pipeline_status / regenerate_art / regenerate_og. Local generation only; Higgsfield/Adobe require accounts we do not have.",
      },
    };
  }
  if (method === "notifications/initialized") return null;
  if (method === "ping") return { jsonrpc: "2.0", id: id ?? null, result: {} };
  if (method === "tools/list") return { jsonrpc: "2.0", id: id ?? null, result: { tools: TOOLS } };
  if (method === "tools/call") {
    try {
      const name = String(params?.name ?? "");
      const args = params?.arguments ?? {};
      const result = await callTool(name, args);
      return { jsonrpc: "2.0", id: id ?? null, result };
    } catch (e) {
      return { jsonrpc: "2.0", id: id ?? null, error: { code: -32603, message: String(e) } };
    }
  }
  if (method === "resources/list") return { jsonrpc: "2.0", id: id ?? null, result: { resources: [] } };
  if (method === "prompts/list") return { jsonrpc: "2.0", id: id ?? null, result: { prompts: [] } };
  if (id === undefined || id === null) return null;
  return { jsonrpc: "2.0", id, error: { code: -32601, message: `method not found: ${method}` } };
}

const rl = createInterface({ input: process.stdin, terminal: false });
rl.on("line", async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "parse error" } }) + "\n");
    return;
  }
  const res = await handle(msg);
  if (res) process.stdout.write(JSON.stringify(res) + "\n");
});
