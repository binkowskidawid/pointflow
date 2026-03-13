import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
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
  ],
})
export class AppModule {}
