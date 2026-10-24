#!/usr/bin/env node
/**
 * RAIL MCP server — exposes the deterministic credit engine as agent tools.
 *
 * Run:  npx tsx mcp/server.ts
 * Wire: {"mcpServers":{"rail":{"command":"npx","args":["tsx","mcp/server.ts"],"cwd":"<repo>"}}}
 *
 * Transport: stdio, newline-delimited JSON-RPC 2.0 (MCP spec).
 * No external dependencies — intentionally portable.
 */

import { createInterface } from "node:readline";
import { PROFILES, PROFILE_MAP, TYPE_LABEL } from "../lib/profiles";
import { DEFAULT_CONTEXT, underwrite, type EngineContext } from "../lib/engine";
import { engineContextFromMarket, getMarketSnapshot } from "../lib/market";

type RpcId = number | string | null;

interface RpcMessage {
  jsonrpc?: string;
  id?: RpcId;
  method?: string;
  params?: Record<string, unknown>;
}

const SERVER_INFO = { name: "rail-credit", version: "1.0.0" };

const TOOLS = [
  {
    name: "list_applicants",
    description:
      "RAIL 신용 여권 심사 가능한 지원자 목록을 반환합니다 (수출 중소기업/프리랜서/딥테크).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "underwrite_applicant",
    description:
      "지원자 1명의 온체인 증거를 검증하고 신용 여권(점수·등급·한도·금리·리스크 플래그·약정·RWA 증서)을 계산합니다. 결정론적 엔진이라 같은 입력은 항상 같은 결과를 냅니다.",
    inputSchema: {
      type: "object",
      properties: {
        profileId: {
          type: "string",
          enum: PROFILES.map((p) => p.id),
          description: "지원자 ID (list_applicants로 조회)",
        },
        benchmarkApr: {
          type: "number",
          description: "선택: 토큰화 국채 벤치마크 금리(%). 생략 시 기본값 4.15",
        },
        asOf: {
          type: "string",
          description: "선택: 평가 기준일 (YYYY-MM-DD). 생략 시 2026-10-22",
        },
      },
      required: ["profileId"],
      additionalProperties: false,
    },
  },
  {
    name: "get_rwa_market",
    description:
      "실시간 RWA 시장 스냅샷(스테이블코인 시가총액·USD/KRW·토큰화 국채 벤치마크)을 반환합니다. DefiLlama/Frankfurter 공개 API, 30분 캐시.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

function textResult(payload: unknown) {
  return {
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
  };
}

function errorResult(message: string) {
  return { content: [{ type: "text", text: message }], isError: true };
}

async function callTool(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "list_applicants":
      return textResult(
        PROFILES.map((p) => ({
          profileId: p.id,
          company: p.company,
          type: TYPE_LABEL[p.type],
          requestedKrw: p.requestedKrw,
          tenorDays: p.tenorDays,
          bankOutcome: p.bankOutcome,
        })),
      );

    case "underwrite_applicant": {
      const profileId = String(args.profileId ?? "");
      const profile = PROFILE_MAP[profileId];
      if (!profile) return errorResult(`unknown profileId: ${profileId}`);
      const ctx: EngineContext = {
        ...DEFAULT_CONTEXT,
        ...(typeof args.benchmarkApr === "number" ? { benchmarkApr: args.benchmarkApr } : {}),
        ...(typeof args.asOf === "string" ? { asOf: args.asOf } : {}),
      };
      const result = underwrite(profile, ctx);
      return textResult({
        passportId: result.passportId,
        profileId: result.profileId,
        company: result.company,
        decision: result.decision,
        decisionNote: result.decisionNote,
        score: result.score,
        grade: result.grade,
        requestedKrw: result.requestedKrw,
        limitKrw: result.limitKrw,
        apr: result.apr,
        benchmarkApr: result.benchmarkApr,
        spreadPct: result.spreadPct,
        tenorDays: result.tenorDays,
        evidenceCoverage: result.evidenceCoverage,
        components: result.components,
        flags: result.flags,
        covenants: result.covenants,
        funding: result.funding,
        engineVersion: "rail-engine-2026.10",
      });
    }

    case "get_rwa_market": {
      const market = await getMarketSnapshot();
      return textResult({
        asOf: market.asOf,
        usdKrw: market.usdKrw,
        fxSource: market.fxSource,
        stablecoinMcapUsd: market.stablecoinMcapUsd,
        stablecoinChange30dPct: market.stablecoinChange30dPct,
        stablecoins: market.stablecoins,
        benchmark: market.benchmark,
        rwa: market.rwa,
        status: market.status,
      });
    }

    default:
      return errorResult(`unknown tool: ${name}`);
  }
}

async function handle(msg: RpcMessage): Promise<Record<string, unknown> | null> {
  const { id, method, params } = msg;
  if (!method) return null;

  try {
    switch (method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id: id ?? null,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: SERVER_INFO,
            instructions:
              "RAIL Credit MCP. use list_applicants → underwrite_applicant to generate a Credit Passport, and get_rwa_market for live market context.",
          },
        };

      case "notifications/initialized":
        return null;

      case "ping":
        return { jsonrpc: "2.0", id: id ?? null, result: {} };

      case "tools/list":
        return { jsonrpc: "2.0", id: id ?? null, result: { tools: TOOLS } };

      case "resources/list":
        return { jsonrpc: "2.0", id: id ?? null, result: { resources: [] } };

      case "prompts/list":
        return { jsonrpc: "2.0", id: id ?? null, result: { prompts: [] } };

      case "tools/call": {
        const name = String((params?.name as string) ?? "");
        const args = (params?.arguments as Record<string, unknown>) ?? {};
        const result = await callTool(name, args);
        return { jsonrpc: "2.0", id: id ?? null, result };
      }

      default:
        if (id === undefined || id === null) return null; // notification — ignore
        return {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `method not found: ${method}` },
        };
    }
  } catch (err) {
    if (id === undefined || id === null) return null;
    return {
      jsonrpc: "2.0",
      id,
      error: { code: -32603, message: err instanceof Error ? err.message : String(err) },
    };
  }
}

function main() {
  const rl = createInterface({ input: process.stdin, terminal: false });
  rl.on("line", async (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let msg: RpcMessage;
    try {
      msg = JSON.parse(trimmed) as RpcMessage;
    } catch {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: "2.0",
          id: null,
          error: { code: -32700, message: "parse error" },
        }) + "\n",
      );
      return;
    }
    const res = await handle(msg);
    if (res) process.stdout.write(JSON.stringify(res) + "\n");
  });
}

main();
