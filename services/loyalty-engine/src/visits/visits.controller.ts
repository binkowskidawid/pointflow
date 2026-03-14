import { Controller } from '@nestjs/common'
import { VisitsService } from './visits.service'
import { CreateVisitDto } from '@pointflow/contracts'
import type { Visit } from '@pointflow/types'
import { MessagePattern, Payload } from '@nestjs/microservices'

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @MessagePattern({ cmd: 'create_visit' })
  async create(@Payload() data: CreateVisitDto): Promise<Visit> {
    return this.visitsService.recordVisit(data)
  }

  @MessagePattern({ cmd: 'get_all_visits' })
  async getAll(@Payload() data: { tenantId: string }): Promise<Visit[]> {
    return this.visitsService.getAll(data)
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing(@Payload() data: { message: string }) {
    console.log('Received ping from API Gateway!', data)
    return 'Pong from Loyalty Engine!'
  }
}
