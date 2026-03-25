import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthRepository } from './auth.repository'
import { DatabaseModule } from '../database/database.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { JwtModule } from '@nestjs/jwt'
import { RedisModule } from '../redis/redis.module'
import { TokenRepository } from '../token/token.repository'
import { ConfigService } from '@nestjs/config'
import { getJwtAccessExpirySeconds, getJwtRefreshExpirySeconds, getRequiredEnv } from './auth.utils'

@Module({
  imports: [
    DatabaseModule,
    RedisModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: getRequiredEnv('JWT_SECRET', configService.get<string>('JWT_SECRET')),
        signOptions: {
          expiresIn: getJwtAccessExpirySeconds(configService.get<string>('JWT_EXPIRES_IN')),
          algorithm: 'HS256',
          issuer: 'pointflow-auth',
          audience: 'pointflow-api',
        },
        verifyOptions: {
          algorithms: ['HS256'],
          issuer: 'pointflow-auth',
          audience: 'pointflow-api',
        },
      }),
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID_CLIENT || 'auth-client',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID || 'auth-group',
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    TokenRepository,
    {
      provide: 'AUTH_REFRESH_SECRET',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getRequiredEnv('JWT_REFRESH_SECRET', configService.get<string>('JWT_REFRESH_SECRET')),
    },
    {
      provide: 'AUTH_REFRESH_TOKEN_TTL_SECONDS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getJwtRefreshExpirySeconds(configService.get<string>('JWT_REFRESH_EXPIRES_IN')),
    },
  ],
})
export class AuthModule {}
