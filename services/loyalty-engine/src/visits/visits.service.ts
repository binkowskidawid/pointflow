import { Inject, Injectable } from '@nestjs/common'
import { VisitsRepository } from './visits.repository'
import { PointsCalculator } from './points-calculator'
import { KAFKA_TOPICS, type CreateVisitDto } from '@pointflow/contracts'
import type { PromotionSnapshot, Visit } from '@pointflow/types'
import { randomUUID } from 'crypto'
import { ClientKafka } from '@nestjs/microservices'
import { CardsService } from '../cards/cards.service'

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
    private readonly cardsService: CardsService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect()
  }

  async recordVisit(dto: CreateVisitDto): Promise<Visit> {
    const card = await this.cardsService.resolveCard(dto.identifier, dto.tenantId)
    const pointsEarned = this.pointsCalculator.calculate(dto.receiptAmount, DEFAULT_PROMOTION)

    const visit = await this.visitsRepository.create({
      id: randomUUID(),
      userId: card.userId,
      tenantId: card.tenantId,
      cardId: card.id,
      cardCode: card.code,
      amountSpent: dto.receiptAmount,
      currency: dto.receiptCurrency,
      pointsEarned,
      appliedRuleSnapshot: DEFAULT_PROMOTION,
      occurredAt: new Date(),
    })

    const totalPointsAfter = await this.cardsService.addPoints(card.id, pointsEarned)

    this.kafkaClient.emit(KAFKA_TOPICS.POINTS_AWARDED, {
      eventId: randomUUID(),
      tenantId: visit.tenantId,
      userId: visit.userId,
      cardId: visit.cardId,
      cardCode: visit.cardCode,
      visitId: visit.id,
      receiptAmount: visit.amountSpent,
      receiptCurrency: visit.currency,
      pointsAwarded: visit.pointsEarned,
      totalPointsAfter: totalPointsAfter.pointsBalance,
      previousDiscount: 0,
      currentDiscount: 0,
      timestamp: new Date().toISOString(),
    })

    return visit
  }

  async getAll({ tenantId }: { tenantId: string }): Promise<Visit[]> {
    return this.visitsRepository.findAll({ tenantId })
  }

  async getByCardId(data: { cardId: string; tenantId?: string }): Promise<Visit[]> {
    const { cardId, tenantId } = data

    if (!cardId) {
      throw new Error('Card ID is required')
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cardId)

    if (!isUuid && tenantId) {
      const card = await this.cardsService.resolveCard(cardId, tenantId)
      return this.visitsRepository.findByCardId({ cardId: card.id })
    }

    return this.visitsRepository.findByCardId({ cardId })
  }
}
