import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { Logger } from 'nestjs-pino'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.LOYALTY_ENGINE_HOST || 'localhost',
      port: Number(process.env.LOYALTY_ENGINE_PORT) || 3002,
    },
  })

  app.useLogger(app.get(Logger))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  await app.listen()
  console.log(`Loyalty Engine running on port ${process.env.LOYALTY_ENGINE_PORT || 3002}`)
}
bootstrap()
