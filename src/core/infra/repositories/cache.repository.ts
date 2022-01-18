import Redis from "../data/connections/redis";

export class CacheRepository {
  async set(key: string, value: any): Promise<boolean> {
    const redis = await Redis.getConnection();
    const result = await redis.set(key, JSON.stringify(value));
    if (!result) return false;
    return true;
  }

  async get(key: string): Promise<any | undefined> {
    const redis = await Redis.getConnection();
    const result = await redis.get(key);
    if (!result) return undefined;
    return JSON.parse(result);
  }
}
