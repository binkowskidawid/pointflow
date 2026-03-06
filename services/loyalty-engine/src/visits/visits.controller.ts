import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { VisitsService } from './visits.service'
import { CreateVisitDto } from '@pointflow/contracts'
import type { Visit } from '@pointflow/types'

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateVisitDto): Promise<Visit> {
    return this.visitsService.recordVisit(dto)
  }
}
