import Redis from "ioredis";

let _redis: Redis | null = null;

export function getRedis(): Redis | null {
    return _redis;
}

export function initRedis(): void {
    const url = process.env["REDIS_URL"] ?? "redis://localhost:6379";
    const client = new Redis(url, {
        lazyConnect: true,
        enableOfflineQueue: false,
        maxRetriesPerRequest: null,
        retryStrategy(times) {
            if (times > 3) return null;        // stop retrying after 3 attempts
            return Math.min(times * 500, 2000); // 500ms, 1s, 2s
        },
    });

    let logged = false;
    client.on("connect", () => { logged = false; console.log("Redis connected"); });
    client.on("error", () => {
        if (!logged) { logged = true; console.warn("Redis unavailable — running without cache"); }
        _redis = null;
    });

    client
        .connect()
        .then(() => {
            _redis = client;
        })
        .catch(() => {
            // Already logged via the 'error' event handler above.
        });
}

/**
 * Save tournament leaderboard to Redis sorted set.
 * Key: tournament:<id>:leaderboard  Score: numeric score  Member: userId
 */
export async function cacheLeaderboard(
    tournamentId: string,
    entries: { userId: string; score: number }[]
): Promise<void> {
    if (!_redis) return;
    const key = `tournament:${tournamentId}:leaderboard`;
    const pipeline = _redis.pipeline();
    pipeline.del(key);
    for (const { userId, score } of entries) {
        pipeline.zadd(key, score, userId);
    }
    pipeline.expire(key, 60); // 1-minute TTL
    await pipeline.exec();
}

/**
 * Fetch ranked leaderboard from Redis.
 * Returns array of { userId, score } sorted by score descending, or null if cache miss.
 */
export async function getCachedLeaderboard(
    tournamentId: string
): Promise<{ userId: string; score: number }[] | null> {
    if (!_redis) return null;
    const key = `tournament:${tournamentId}:leaderboard`;
    const data = await _redis.zrevrangebyscore(key, "+inf", "-inf", "WITHSCORES");
    if (!data || data.length === 0) return null;
    const results: { userId: string; score: number }[] = [];
    for (let i = 0; i < data.length; i += 2) {
        results.push({ userId: data[i]!, score: Number(data[i + 1]) });
    }
    return results;
}
