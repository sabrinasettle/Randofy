#!/usr/bin/env node

import { writeFile } from "node:fs/promises";

const DEFAULT_URL = "http://randofy.vercel.app/api/random";
const DEFAULT_LIMIT = 50;

function parseArgs(argv) {
  const options = {
    url: DEFAULT_URL,
    limit: DEFAULT_LIMIT,
    output: null,
    pretty: false,
    quiet: false,
  };

  for (const arg of argv) {
    if (arg === "--pretty") {
      options.pretty = true;
      continue;
    }

    if (arg === "--quiet") {
      options.quiet = true;
      continue;
    }

    const [key, value] = arg.split("=");

    switch (key) {
      case "--url":
        options.url = value;
        break;
      case "--limit":
        options.limit = Number(value);
        break;
      case "--output":
        options.output = value;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isInteger(options.limit) || options.limit <= 0) {
    throw new Error("--limit must be a positive integer");
  }

  return options;
}

function getDataLength(data) {
  if (Array.isArray(data)) return data.length;
  if (Array.isArray(data?.recommendedTracks))
    return data.recommendedTracks.length;
  return null;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const url = new URL(options.url);
  url.searchParams.set("limit", String(options.limit));

  const startedAt = performance.now();
  const response = await fetch(url);
  const timeTakenMs = Math.round((performance.now() - startedAt) * 100) / 100;
  const rawBody = await response.text();

  let data;
  try {
    data = JSON.parse(rawBody);
  } catch {
    data = rawBody;
  }

  const result = {
    url: url.toString(),
    status: response.status,
    ok: response.ok,
    timeTakenMs,
    dataLength: getDataLength(data),
    data,
  };
  const resultJson = JSON.stringify(result, null, options.pretty ? 2 : 0);

  if (options.output) {
    await writeFile(options.output, resultJson);
  }

  if (!options.quiet) {
    console.log(resultJson);
  }

  if (!response.ok) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: error.message,
        cause: error.cause
          ? {
              message: error.cause.message,
              code: error.cause.code,
              address: error.cause.address,
              port: error.cause.port,
            }
          : undefined,
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
});
