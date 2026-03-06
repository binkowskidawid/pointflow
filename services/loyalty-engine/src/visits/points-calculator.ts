import { Injectable } from '@nestjs/common'
import type { PromotionSnapshot } from '@pointflow/types'

@Injectable()
export class PointsCalculator {
  calculate(receiptAmount: number, promotion: PromotionSnapshot): number {
    if (receiptAmount < 0) {
      throw new Error('receiptAmount must be non-negative')
    }

    if (promotion.multiplier <= 0) {
      throw new Error('promotion multiplier must be greater than 0')
    }

    return Math.floor(receiptAmount * promotion.multiplier)
  }
}
