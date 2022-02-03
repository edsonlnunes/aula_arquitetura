import Redis from "../data/connections/redis";

export class CacheRepository {
  private redis: Redis;

  constructor() {
    this.redis = new Redis();
  }

  async set(key: string, value: any): Promise<boolean> {
    const connectionRedis = await this.redis.getConnection();
    const result = await connectionRedis.set(key, JSON.stringify(value));
    if (!result) return false;
    return true;
  }

  async setExpire(key: string, value: any, ttl: number) {
    const connectionRedis = await this.redis.getConnection();
    const result = await connectionRedis.set(
      key,
      JSON.stringify(value),
      "ex",
      ttl
    );
    // await redis.setex(key, ttl, JSON.stringify(value));
    if (!result) return false;
    return true;
  }

  async get(key: string): Promise<any | undefined> {
    const connectionRedis = await this.redis.getConnection();
    const result = await connectionRedis.get(key);
    if (!result) return undefined;
    return JSON.parse(result);
  }

  async exists(key: string): Promise<boolean> {
    const connectionRedis = await this.redis.getConnection();
    const result = await connectionRedis.exists(key);
    // if(result === 0) return false;
    // return true;
    return result > 0;
  }

  async delete(key: string): Promise<boolean> {
    const connectionRedis = await this.redis.getConnection();
    const result = await connectionRedis.del(key);
    return result > 0;
  }
}
