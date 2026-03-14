import { Controller } from '@nestjs/common'
import { VisitsService } from './visits.service'
import type { Visit } from '@pointflow/types'
import { MessagePattern, Payload } from '@nestjs/microservices'

@Controller('cards')
export class CardsController {
  constructor(private readonly visitsService: VisitsService) {}

  @MessagePattern({ cmd: 'get_visits_by_card_id' })
  async getVisits(@Payload() data: { cardId: string }): Promise<Visit[]> {
    return this.visitsService.getByCardId(data)
  }
}
