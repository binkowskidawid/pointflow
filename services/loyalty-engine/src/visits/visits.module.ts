import { Module } from '@nestjs/common'
import { VisitsController } from './visits.controller'
import { VisitsService } from './visits.service'
import { VisitsRepository } from './visits.repository'
import { PointsCalculator } from './points-calculator'
import { DatabaseModule } from '../database/database.module'
import { CardsController } from './cards.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [VisitsController, CardsController],
  providers: [VisitsService, VisitsRepository, PointsCalculator],
})
export class VisitsModule {}
