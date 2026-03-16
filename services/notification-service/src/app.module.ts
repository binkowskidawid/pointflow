import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { NotificationsController } from './notification.controller'
import { MailerModule } from '@nestjs-modules/mailer'

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
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 1025,
        ignoreTLS: true,
        secure: false,
      },
      defaults: {
        from: '"PointFlow" <no-reply@pointflow.pl>',
      },
    }),
  ],
  controllers: [NotificationsController],
})
export class AppModule {}
