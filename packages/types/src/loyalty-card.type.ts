import type { CardTier } from '@pointflow/contracts'

export interface LoyaltyCard {
  id: string
  userId: string
  tenantId: string
  pointsBalance: number
  tier: CardTier
  createdAt: Date
  updatedAt: Date
}
