import { describe, expect, it } from 'vitest'
import { PointsCalculator } from './points-calculator'
import type { PromotionSnapshot } from '@pointflow/types'

describe('PointsCalculator', () => {
  const calculator = new PointsCalculator()

  const basePromotion: PromotionSnapshot = {
    promotionId: 'promo-1',
    name: 'Standard',
    multiplier: 1,
  }

  describe('calculate()', () => {
    it('awards 1 point per 1 PLN with multiplier 1', () => {
      expect(calculator.calculate(10000, basePromotion)).toBe(100)
    })

    it('applies multiplier — 2pts per 10 PLN (multiplier 0.2) for 156 PLN gives 31 pts', () => {
      const promo: PromotionSnapshot = { ...basePromotion, multiplier: 0.2 }
      expect(calculator.calculate(15600, promo)).toBe(31)
    })

    it('floors fractional points — never rounds up', () => {
      const promo: PromotionSnapshot = { ...basePromotion, multiplier: 0.3 }
      // 10 * 0.3 = 3.0 — exact
      expect(calculator.calculate(1000, promo)).toBe(3)
      // 11 * 0.3 = 3.3 — floor to 3
      expect(calculator.calculate(1100, promo)).toBe(3)
      // 150.55 * 0.3 = 45.165 — floor to 45
      expect(calculator.calculate(15055, promo)).toBe(45)
    })

    it('returns 0 for zero amount', () => {
      expect(calculator.calculate(0, basePromotion)).toBe(0)
    })

    it('throws for negative amount', () => {
      expect(() => calculator.calculate(-1000, basePromotion)).toThrow(
        'receiptAmountCents must be non-negative',
      )
    })

    it('throws for zero multiplier — invalid promotion config', () => {
      const brokenPromo: PromotionSnapshot = { ...basePromotion, multiplier: 0 }
      expect(() => calculator.calculate(10000, brokenPromo)).toThrow(
        'promotion multiplier must be greater than 0',
      )
    })
  })
})
