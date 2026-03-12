export interface DiscountTier {
  pointsThreshold: number
  discountPercent: number
}

export interface LoyaltySetting {
  id: string
  tenantId: string
  amountPerPoint: number
  isActive: boolean
  discountTiers: DiscountTier[]
  createdAt: Date
  updatedAt: Date
}
