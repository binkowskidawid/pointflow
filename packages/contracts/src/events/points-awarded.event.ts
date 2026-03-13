import type { Currency } from '../enums/currency.enum'

export interface PointsAwardedEvent {
  eventId: string
  tenantId: string
  cardId: string
  cardCode: string
  visitId: number
  receiptAmount: number
  receiptCurrency: Currency
  pointsAwarded: number
  totalPointsAfter: number
  previousDiscount: number
  currentDiscount: number
  timestamp: string
}
