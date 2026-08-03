import { createClient } from "redis";

function getRedisUrl() {
  if (process.env.REDIS_URL) return process.env.REDIS_URL;

  const host = process.env.REDIS_HOST;
  if (!host) return null;

  const port = process.env.REDIS_PORT || "6379";
  const password = process.env.REDIS_PASSWORD;
  const protocol = process.env.REDIS_TLS === "true" ? "rediss" : "redis";
  const auth = password ? `:${encodeURIComponent(password)}@` : "";

  return `${protocol}://${auth}${host}:${port}`;
}

const globalForRedis = globalThis;

export function isRedisConfigured() {
  return getRedisUrl() !== null;
}

export async function getRedis() {
  const url = getRedisUrl();
  if (!url) {
    throw new Error("Missing REDIS_URL or REDIS_HOST env var.");
  }

  if (!globalForRedis._redisClient) {
    const client = createClient({ url });
    client.on("error", (error) => {
      console.error("Redis Client Error:", error);
    });
    globalForRedis._redisClient = client;
  }

  const client = globalForRedis._redisClient;
  if (!client.isOpen) {
    globalForRedis._redisConnectPromise ||= client.connect().finally(() => {
      globalForRedis._redisConnectPromise = null;
    });
    await globalForRedis._redisConnectPromise;
  }

  return client;
}
