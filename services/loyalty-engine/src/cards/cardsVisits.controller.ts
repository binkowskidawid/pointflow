import { Controller } from '@nestjs/common'
import { VisitsService } from '../visits/visits.service'
import type { Visit } from '@pointflow/types'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { LOYALTY_MESSAGES } from '@pointflow/contracts'

@Controller('cards')
export class CardsVisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @MessagePattern(LOYALTY_MESSAGES.VISIT.GET_BY_CARD)
  async getVisits(@Payload() data: { cardId: string; tenantId?: string }): Promise<Visit[]> {
    return this.visitsService.getByCardId(data)
  }
}
