import { Injectable } from '@nestjs/common'
import type { PromotionSnapshot } from '@pointflow/types'

@Injectable()
export class PointsCalculator {
  calculate(receiptAmountCents: number, promotion: PromotionSnapshot): number {
    if (receiptAmountCents < 0) {
      throw new Error('receiptAmountCents must be non-negative')
    }

    if (promotion.multiplier <= 0) {
      throw new Error('promotion multiplier must be greater than 0')
    }

    const amountInMainUnit = Math.floor(receiptAmountCents / 100)
    return Math.floor(amountInMainUnit * promotion.multiplier)
  }
}
