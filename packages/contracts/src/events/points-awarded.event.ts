import type { Currency } from '../enums/currency.enum'

export interface PointsAwardedEvent {
  eventId: string
  tenantId: string
  userId: string
  cardId: string
  cardCode: string
  visitId: string
  receiptAmount: number
  receiptCurrency: Currency
  pointsAwarded: number
  totalPointsAfter: number
  previousDiscount: number
  currentDiscount: number
  timestamp: string
}
