import { Module, Global } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST')
        const portRaw = configService.get<string>('REDIS_PORT')

        if (!host) throw new Error('REDIS_HOST is not configured')
        if (!portRaw) throw new Error('REDIS_PORT is not configured')

        const port = Number(portRaw)
        if (!Number.isInteger(port) || port <= 0) {
          throw new Error(`REDIS_PORT must be a positive integer, got "${portRaw}"`)
        }

        return new Redis({ host, port })
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
