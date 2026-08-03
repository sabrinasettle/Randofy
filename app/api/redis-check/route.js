import { NextResponse } from "next/server";
import { getRedis } from "../../../lib/redis";

export const runtime = "nodejs"; // IMPORTANT: normal Redis uses TCP, not Edge

export async function GET() {
  const redis = await getRedis();
  const pong = await redis.ping();
  return NextResponse.json({ ok: pong === "PONG", pong });
}
