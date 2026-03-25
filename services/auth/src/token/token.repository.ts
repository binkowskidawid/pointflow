import { Inject, Injectable } from '@nestjs/common'
import { createHash } from 'crypto'
import Redis from 'ioredis'

@Injectable()
export class TokenRepository {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  /**
   * Stores a refresh token with an automatic expiration time (e.g., 7 days)
   */
  async storeRefreshToken(userId: string, token: string, ttlSeconds: number): Promise<void> {
    const key = this.buildKey(userId, token)
    await this.redis.set(key, '1', 'EX', ttlSeconds)
  }

  async exists(userId: string, token: string): Promise<boolean> {
    const key = this.buildKey(userId, token)
    const result = await this.redis.exists(key)
    return result === 1
  }

  async delete(userId: string, token: string): Promise<void> {
    await this.redis.del(this.buildKey(userId, token))
  }

  /**
   * Atomically gets and deletes the token — prevents replay on concurrent refresh requests.
   * Returns true if the token existed (was valid), false if already consumed or never stored.
   */
  async getAndDelete(userId: string, token: string): Promise<boolean> {
    const result = await this.redis.getdel(this.buildKey(userId, token))
    return result !== null
  }

  private buildKey(userId: string, token: string): string {
    const tokenHash = createHash('sha256').update(token).digest('hex')
    return `refresh_token:${userId}:${tokenHash}`
  }
}
