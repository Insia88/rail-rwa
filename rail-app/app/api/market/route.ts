import { NextResponse } from "next/server";
import { getMarketSnapshot } from "@/lib/market";

export const revalidate = 1800;

export async function GET() {
  const snapshot = await getMarketSnapshot();
  return NextResponse.json(snapshot, {
    headers: {
      "cache-control": "public, s-maxage=1800, stale-while-revalidate=86400",
    },
  });
}
