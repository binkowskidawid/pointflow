import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class TokenRepository {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  /**
   * Stores a refresh token with an automatic expiration time (e.g., 7 days)
   */
  async storeRefreshToken(userId: string, token: string, ttlSeconds: number): Promise<void> {
    const key = `refresh_token:${userId}:${token}`
    await this.redis.set(key, '1', 'EX', ttlSeconds)
  }

  async exists(userId: string, token: string): Promise<boolean> {
    const key = `refresh_token:${userId}:${token}`
    const result = await this.redis.exists(key)
    return result === 1
  }

  async delete(userId: string, token: string): Promise<void> {
    await this.redis.del(`refresh_token:${userId}:${token}`)
  }
}
