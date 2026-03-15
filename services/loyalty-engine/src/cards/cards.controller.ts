import { Controller } from '@nestjs/common'
import type { LoyaltyCard } from '@pointflow/types'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CardsService } from './cards.service'
import { CreateLoyaltyCardDto } from '@pointflow/contracts'

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @MessagePattern({ cmd: 'create_card' })
  async createCard(@Payload() data: CreateLoyaltyCardDto): Promise<LoyaltyCard> {
    return this.cardsService.createCard(data)
  }

  @MessagePattern({ cmd: 'get_card_by_id' })
  async getByCardId(@Payload() data: { cardId: string }): Promise<LoyaltyCard | null> {
    return this.cardsService.getByCardId(data)
  }

  @MessagePattern({ cmd: 'get_all_cards' })
  async getAll(@Payload() data: { tenantId: string }): Promise<LoyaltyCard[]> {
    return this.cardsService.getAll(data)
  }

  @MessagePattern({ cmd: 'resolve_card' })
  async resolveCard(
    @Payload() data: { identifier: string; tenantId: string },
  ): Promise<LoyaltyCard> {
    return this.cardsService.resolveCard(data.identifier, data.tenantId)
  }
}
