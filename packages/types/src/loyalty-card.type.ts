import type { CardTier } from '@pointflow/contracts'

export interface LoyaltyCard {
  id: string
  customerId: string
  tenantId: string
  code: string
  pointsBalance: number
  tier: CardTier
  createdAt: Date
  updatedAt: Date
}
