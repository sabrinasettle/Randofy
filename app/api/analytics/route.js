import { NextResponse } from "next/server";
import { getRedis, isRedisConfigured } from "../../../lib/redis";

export const runtime = "nodejs";

const PARAMS = [
  "popularity",
  "acoustics",
  "energy",
  "vocals",
  "danceability",
  "mood",
];

function emptyAnalytics() {
  return {
    genres: [],
    parameters: Object.fromEntries(
      PARAMS.map((param) => [
        param,
        {
          avg_min: 0,
          avg_max: 0,
          total_queries: 0,
          min_distribution: [],
          max_distribution: [],
        },
      ]),
    ),
    totalQueries: 0,
  };
}

export async function GET() {
  try {
    console.log("GET /api/analytics - Starting...");
    if (!isRedisConfigured()) {
      return NextResponse.json(emptyAnalytics());
    }

    const redis = await getRedis();

    // node-redis v4 syntax: zRangeWithScores with REV option
    const genresData = await redis.zRangeWithScores("analytics:genres", 0, -1, {
      REV: true,
    });

    const genreStats = genresData.map((item) => ({
      genre: item.value,
      count: item.score,
    }));

    // Fetch parameter statistics
    const paramStats = {};

    for (const param of PARAMS) {
      const stats = await redis.hGetAll(`analytics:stats:${param}`);

      // Get distribution of min/max values (top 10)
      const minDist = await redis.zRangeWithScores(
        `analytics:${param}:min`,
        0,
        9,
        { REV: true },
      );
      const maxDist = await redis.zRangeWithScores(
        `analytics:${param}:max`,
        0,
        9,
        { REV: true },
      );

      paramStats[param] = {
        avg_min: parseFloat(stats?.avg_min || 0),
        avg_max: parseFloat(stats?.avg_max || 0),
        total_queries: parseInt(stats?.total_queries || 0),
        min_distribution: minDist.map((item) => ({
          value: parseFloat(item.value),
          count: item.score,
        })),
        max_distribution: maxDist.map((item) => ({
          value: parseFloat(item.value),
          count: item.score,
        })),
      };
    }

    const totalQueries = await redis.get("analytics:total_queries");

    return NextResponse.json({
      genres: genreStats,
      parameters: paramStats,
      totalQueries: parseInt(totalQueries || 0),
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        error: "Failed to fetch analytics",
        message: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { genres, songDetails } = body;

    if (!songDetails) {
      return NextResponse.json(
        { error: "Missing songDetails" },
        { status: 400 },
      );
    }

    if (!isRedisConfigured()) {
      return NextResponse.json({
        message: "Analytics disabled because Redis is not configured",
        skipped: true,
      });
    }

    const redis = await getRedis();

    // Use multi() for transactions in node-redis v4
    const multi = redis.multi();

    // Increment total queries
    multi.incr("analytics:total_queries");

    // Track genres
    if (genres && Array.isArray(genres) && genres.length > 0) {
      genres.forEach((genre) => {
        multi.zIncrBy("analytics:genres", 1, genre);
      });
    } else {
      multi.zIncrBy("analytics:genres", 1, "_no_genre");
    }

    // Track each parameter's min/max values
    for (const param of PARAMS) {
      if (songDetails[param]) {
        const { min, max } = songDetails[param];

        const minRounded = Math.round(min * 100) / 100;
        const maxRounded = Math.round(max * 100) / 100;

        multi.zIncrBy(`analytics:${param}:min`, 1, minRounded.toString());
        multi.zIncrBy(`analytics:${param}:max`, 1, maxRounded.toString());

        const statsKey = `analytics:stats:${param}`;
        multi.hIncrByFloat(statsKey, "sum_min", min);
        multi.hIncrByFloat(statsKey, "sum_max", max);
        multi.hIncrBy(statsKey, "total_queries", 1);
      }
    }

    await multi.exec();

    // Update averages
    for (const param of PARAMS) {
      if (songDetails[param]) {
        const stats = await redis.hGetAll(`analytics:stats:${param}`);
        const totalQueries = parseInt(stats.total_queries || 0);

        if (totalQueries > 0) {
          await redis.hSet(`analytics:stats:${param}`, {
            avg_min: (parseFloat(stats.sum_min) / totalQueries).toString(),
            avg_max: (parseFloat(stats.sum_max) / totalQueries).toString(),
          });
        }
      }
    }

    return NextResponse.json({ message: "Analytics updated successfully" });
  } catch (error) {
    console.error("Analytics POST error:", error);
    return NextResponse.json(
      {
        error: "Failed to update analytics",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
