import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379'

const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 5) return null // Stop retrying after 5 attempts
    return Math.min(times * 200, 2000)
  },
  lazyConnect: true,
})

redis.on('error', (err) => {
  console.error('[Redis] Connection error:', err.message)
})

redis.on('connect', () => {
  console.log('[Redis] Connected')
})

/** High-level cache with TTL */
export const cache = {
  /** Get a cached value */
  async get(key: string): Promise<string | null> {
    try {
      return await redis.get(key)
    } catch {
      return null
    }
  },

  /** Set a cached value with TTL in seconds */
  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    try {
      await redis.set(key, value, 'EX', ttlSeconds)
    } catch (err) {
      console.error('[Redis] Set error:', err)
    }
  },

  /** Delete a cached key */
  async del(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (err) {
      console.error('[Redis] Del error:', err)
    }
  },

  /** Cache-aside pattern: get or compute */
  async getOrSet<T>(key: string, ttlSeconds: number, compute: () => Promise<T>): Promise<T> {
    const cached = await this.get(key)
    if (cached) return JSON.parse(cached) as T

    const value = await compute()
    await this.set(key, JSON.stringify(value), ttlSeconds)
    return value
  },
}

/** Connect to Redis (call on startup) */
export async function connectRedis(): Promise<void> {
  try {
    await redis.connect()
  } catch (err) {
    console.warn('[Redis] Failed to connect, caching disabled:', (err as Error).message)
  }
}

/** Disconnect from Redis */
export async function disconnectRedis(): Promise<void> {
  await redis.quit()
}

export default redis
