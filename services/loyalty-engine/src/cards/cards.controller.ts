import { Controller } from '@nestjs/common'
import type { LoyaltyCard } from '@pointflow/types'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CardsService } from './cards.service'
import { CreateLoyaltyCardDto, LOYALTY_MESSAGES } from '@pointflow/contracts'

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @MessagePattern(LOYALTY_MESSAGES.CARD.CREATE)
  async createCard(@Payload() data: CreateLoyaltyCardDto): Promise<LoyaltyCard> {
    return this.cardsService.createCard(data)
  }

  @MessagePattern(LOYALTY_MESSAGES.CARD.GET_BY_ID)
  async getByCardId(@Payload() data: { cardId: string }): Promise<LoyaltyCard | null> {
    return this.cardsService.getByCardId(data)
  }

  @MessagePattern(LOYALTY_MESSAGES.CARD.GET_ALL)
  async getAll(@Payload() data: { tenantId: string }): Promise<LoyaltyCard[]> {
    return this.cardsService.getAll(data)
  }

  @MessagePattern(LOYALTY_MESSAGES.CARD.RESOLVE)
  async resolveCard(
    @Payload() data: { identifier: string; tenantId: string },
  ): Promise<LoyaltyCard> {
    return this.cardsService.resolveCard(data.identifier, data.tenantId)
  }
}
