import { CardTier } from '../enums'

export type CreateLoyaltyCardDto = {
  userId: string
  tenantId: string
  pointsBalance?: number
  code?: string
  tier?: CardTier
  createdAt?: Date
  updatedAt?: Date
}
