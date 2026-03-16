import { Injectable } from '@nestjs/common'
import { CardTier, type CreateLoyaltyCardDto } from '@pointflow/contracts'
import type { LoyaltyCard } from '@pointflow/types'
import { randomUUID } from 'crypto'
import { CardsRepository } from './cards.repository'
import { generateLoyaltyCardCode } from '@pointflow/utils'

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  async createCard(dto: CreateLoyaltyCardDto): Promise<LoyaltyCard> {
    return await this.cardsRepository.create({
      id: randomUUID(),
      userId: dto.userId,
      tenantId: dto.tenantId,
      pointsBalance: dto.pointsBalance || 0,
      code: dto.code || generateLoyaltyCardCode(dto.tenantId),
      tier: dto.tier || CardTier.BRONZE,
      createdAt: dto.createdAt || new Date(),
      updatedAt: dto.updatedAt || new Date(),
    })
  }

  async getAll({ tenantId }: { tenantId: string }): Promise<LoyaltyCard[]> {
    return this.cardsRepository.findAll({ tenantId })
  }

  async getByCardId({ cardId }: { cardId: string }): Promise<LoyaltyCard | null> {
    return this.cardsRepository.findById({ cardId })
  }

  async resolveCard(identifier: string, tenantId: string): Promise<LoyaltyCard> {
    const card = await this.cardsRepository.findByCode({ code: identifier, tenantId })
    if (!card) {
      const userCard = await this.cardsRepository.findByUserPhoneOrEmail({
        phoneOrEmail: identifier,
        tenantId,
      })
      if (!userCard) {
        throw new Error('Card not found')
      }
      return userCard
    }
    return card
  }

  async addPoints(cardId: string, points: number): Promise<Pick<LoyaltyCard, 'pointsBalance'>> {
    return await this.cardsRepository.updatePoints({ id: cardId, pointsDelta: points })
  }
}
