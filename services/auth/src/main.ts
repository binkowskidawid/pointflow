import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { Logger } from 'nestjs-pino'

async function bootstrap() {
  const port = Number(process.env.AUTH_PORT) || 3003
  const httpPort = 3013

  const app = await NestFactory.create(AppModule)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_HOST || '0.0.0.0',
      port: port,
    },
  })

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID_SERVER || 'auth-server',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID || 'auth-group',
      },
    },
  })

  await app.startAllMicroservices()

  app.useLogger(app.get(Logger))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  await app.listen(httpPort)
  console.log(`Auth Service running on port ${httpPort}`)
}
bootstrap()
