import { NextResponse } from "next/server";
import { redis } from "../../../lib/redis";

export const runtime = "nodejs";

export async function GET() {
  const raw = await redis.get("items_returned_total");
  const counter = raw ? Number(raw) : 0;

  return NextResponse.json({ counter });
}
