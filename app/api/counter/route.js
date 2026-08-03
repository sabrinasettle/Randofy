import { NextResponse } from "next/server";
import { getRedis } from "../../../lib/redis";

export const runtime = "nodejs";

export async function GET() {
  const redis = await getRedis();
  const raw = await redis.get("items_returned_total");
  const counter = raw ? Number(raw) : 0;

  return NextResponse.json({ counter });
}
