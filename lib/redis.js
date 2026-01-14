// src/lib/redis.js
import { createClient } from "redis";

function getRedisUrl() {
  if (process.env.REDIS_URL) return process.env.REDIS_URL;

  const host = process.env.REDIS_HOST;
  const port = process.env.REDIS_PORT || "6379";
  const password = process.env.REDIS_PASSWORD;

  if (!host) {
    throw new Error("Missing REDIS_URL or REDIS_HOST env var.");
  }

  const protocol = process.env.REDIS_TLS === "true" ? "rediss" : "redis";
  const auth = password ? `:${encodeURIComponent(password)}@` : "";
  return `${protocol}://${auth}${host}:${port}`;
}

// Cache the client across hot reloads in dev and across warm invocations in serverless
const globalForRedis = globalThis;

export const redis =
  globalForRedis._redisClient ||
  createClient({
    url: getRedisUrl(),
    // If your provider needs explicit TLS config (rare if you use rediss://):
    // socket: { tls: true }
  });

if (!globalForRedis._redisClient) {
  globalForRedis._redisClient = redis;

  redis.on("error", (err) => {
    console.error("Redis Client Error:", err);
  });

  // Connect once
  redis.connect().catch((err) => {
    console.error("Redis connect() failed:", err);
  });
}
