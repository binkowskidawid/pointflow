import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { CardsService } from './cards.service'
import { CardsRepository } from './cards.repository'
import { CardsController } from './cards.controller'

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          clientId: 'loyalty-engine',
          client: { brokers: ['localhost:9092'] },
          consumer: { groupId: 'nest-consumer' },
        },
      },
    ]),
  ],
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
  exports: [CardsService],
})
export class CardsModule {}
