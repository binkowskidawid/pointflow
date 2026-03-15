import { Module } from '@nestjs/common'
import { VisitsController } from './visits.controller'
import { VisitsService } from './visits.service'
import { VisitsRepository } from './visits.repository'
import { PointsCalculator } from './points-calculator'
import { DatabaseModule } from '../database/database.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { CardsModule } from '../cards/cards.module'
import { CardsVisitsController } from 'src/cards/cardsVisits.controller'

@Module({
  imports: [
    DatabaseModule,
    CardsModule,
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
  controllers: [VisitsController, CardsVisitsController],
  providers: [VisitsService, VisitsRepository, PointsCalculator],
})
export class VisitsModule {}
