import { Controller } from '@nestjs/common'
import { VisitsService } from './visits.service'
import { CreateVisitDto, LOYALTY_MESSAGES } from '@pointflow/contracts'
import type { Visit } from '@pointflow/types'
import { MessagePattern, Payload } from '@nestjs/microservices'

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @MessagePattern(LOYALTY_MESSAGES.VISIT.CREATE)
  async create(@Payload() data: CreateVisitDto): Promise<Visit> {
    return this.visitsService.recordVisit(data)
  }

  @MessagePattern(LOYALTY_MESSAGES.VISIT.GET_ALL)
  async getAll(@Payload() data: { tenantId: string }): Promise<Visit[]> {
    return this.visitsService.getAll(data)
  }

  @MessagePattern(LOYALTY_MESSAGES.INTERNAL.PING)
  handlePing(@Payload() data: { message: string }) {
    console.log('Received ping from API Gateway!', data)
    return 'Pong from Loyalty Engine!'
  }
}
