import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthRepository } from './auth.repository'
import { DatabaseModule } from '../database/database.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { JwtModule } from '@nestjs/jwt'
import { RedisModule } from '../redis/redis.module'
import { TokenRepository } from '../token/token.repository'

@Module({
  imports: [
    DatabaseModule,
    RedisModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as never },
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
  providers: [AuthService, AuthRepository, TokenRepository],
})
export class AuthModule {}
