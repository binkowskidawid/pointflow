import { Injectable } from '@nestjs/common'
import { VisitsRepository } from './visits.repository'
import { PointsCalculator } from './points-calculator'
import type { CreateVisitDto } from '@pointflow/contracts'
import type { PromotionSnapshot, Visit } from '@pointflow/types'
import { randomUUID } from 'crypto'

// Hardcoded until PromotionsService exists
const DEFAULT_PROMOTION: PromotionSnapshot = {
  promotionId: 'default',
  name: 'Standard (1 pt / 1 PLN)',
  multiplier: 1,
}

@Injectable()
export class VisitsService {
  constructor(
    private readonly visitsRepository: VisitsRepository,
    private readonly pointsCalculator: PointsCalculator,
  ) {}

  async recordVisit(dto: CreateVisitDto): Promise<Visit> {
    const promotion = DEFAULT_PROMOTION

    const pointsEarned = this.pointsCalculator.calculate(dto.receiptAmount, promotion)

    return this.visitsRepository.create({
      id: randomUUID(),
      userId: dto.userId,
      cardId: dto.cardId,
      amountSpent: dto.receiptAmount,
      currency: dto.receiptCurrency,
      pointsEarned,
      appliedRuleSnapshot: promotion,
      occurredAt: new Date(),
    })
  }
}
