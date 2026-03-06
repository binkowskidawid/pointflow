import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { Logger } from 'nestjs-pino'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })

  app.useLogger(app.get(Logger))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  const port = process.env.PORT ?? 3001
  await app.listen(port)
  console.log(`Loyalty Engine running on port ${port}`)
}

bootstrap()
