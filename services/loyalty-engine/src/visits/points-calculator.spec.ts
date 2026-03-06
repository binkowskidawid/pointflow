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
      expect(calculator.calculate(100, basePromotion)).toBe(100)
    })

    it('applies multiplier — 2pts per 10 PLN (multiplier 0.2) for 156 PLN gives 31 pts', () => {
      const promo: PromotionSnapshot = { ...basePromotion, multiplier: 0.2 }
      expect(calculator.calculate(156, promo)).toBe(31)
    })

    it('floors fractional points — never rounds up', () => {
      const promo: PromotionSnapshot = { ...basePromotion, multiplier: 0.3 }
      // 10 * 0.3 = 3.0 — exact
      expect(calculator.calculate(10, promo)).toBe(3)
      // 11 * 0.3 = 3.3 — floor to 3
      expect(calculator.calculate(11, promo)).toBe(3)
    })

    it('returns 0 for zero amount', () => {
      expect(calculator.calculate(0, basePromotion)).toBe(0)
    })

    it('throws for negative amount', () => {
      expect(() => calculator.calculate(-10, basePromotion)).toThrow(
        'receiptAmount must be non-negative',
      )
    })

    it('throws for zero multiplier — invalid promotion config', () => {
      const brokenPromo: PromotionSnapshot = { ...basePromotion, multiplier: 0 }
      expect(() => calculator.calculate(100, brokenPromo)).toThrow(
        'promotion multiplier must be greater than 0',
      )
    })
  })
})
