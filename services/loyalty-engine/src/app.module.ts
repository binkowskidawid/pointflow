import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { VisitsModule } from './visits/visits.module'
import { LoggerModule } from 'nestjs-pino'
import { CardsModule } from './cards/cards.module'
import { UsersModule } from './users/users.module'
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({
          context: 'HTTP',
        }),
        serializers: {
          req: (req) => ({
            method: req.method,
            url: req.url,
            body: process.env.NODE_ENV !== 'production' ? req.raw.body : undefined,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
      },
    }),
    VisitsModule,
    CardsModule,
    UsersModule,
  ],
})
export class AppModule {}
