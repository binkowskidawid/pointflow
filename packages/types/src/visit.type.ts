import type { Currency } from '@pointflow/contracts'

export interface PromotionSnapshot {
  promotionId: string
  name: string
  multiplier: number
}

export interface Visit {
  id: string
  userId: string
  tenantId: string
  cardId: string
  cardCode: string
  amountSpent: number
  currency: Currency
  pointsEarned: number
  appliedRuleSnapshot: PromotionSnapshot
  occurredAt: Date
  createdAt: Date
  updatedAt: Date
}
