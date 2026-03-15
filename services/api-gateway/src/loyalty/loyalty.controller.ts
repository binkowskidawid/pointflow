import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common'
import { LoyaltyService } from './loyalty.service'
import { firstValueFrom, Observable } from 'rxjs'
import { CreateVisitDto } from '@pointflow/contracts'
import type { Visit } from '@pointflow/types'

@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Post('visits')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateVisitDto): Promise<Visit> {
    return await firstValueFrom(this.loyaltyService.createVisit(dto))
  }

  @Get('visits')
  async getAllVisits(@Query() query: { tenantId: string }): Promise<Visit[]> {
    return await firstValueFrom(this.loyaltyService.getAllVisits(query.tenantId))
  }

  @Get('cards/:cardId/visits')
  async getVisitsByCardId(
    @Param('cardId') cardId: string,
    @Query('tenantId') tenantId: string,
  ): Promise<Visit[]> {
    return await firstValueFrom(this.loyaltyService.getVisitsByCardId(cardId, tenantId))
  }

  @Get('ping')
  pingLoyaltyService(): Observable<string> {
    return this.loyaltyService.pingLoyalty()
  }
}
