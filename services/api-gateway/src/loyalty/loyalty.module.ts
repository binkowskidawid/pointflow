import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { LoyaltyController } from './loyalty.controller'
import { LoyaltyService } from './loyalty.service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'LOYALTY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.LOYALTY_ENGINE_HOST || 'localhost',
          port: Number(process.env.LOYALTY_ENGINE_PORT) || 3002,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
  controllers: [LoyaltyController],
  providers: [LoyaltyService],
})
export class LoyaltyModule {}
