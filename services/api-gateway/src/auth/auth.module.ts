import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_HOST || 'localhost',
          port: Number(process.env.AUTH_PORT) || 3003,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
