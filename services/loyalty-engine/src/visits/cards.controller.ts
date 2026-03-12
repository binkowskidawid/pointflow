import { Controller, Get, Param } from '@nestjs/common'
import { VisitsService } from './visits.service'
import type { Visit } from '@pointflow/types'

@Controller('cards')
export class CardsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get(':cardId/visits')
  async getVisits(@Param('cardId') cardId: string): Promise<Visit[]> {
    return this.visitsService.getByCardId({ cardId })
  }
}
