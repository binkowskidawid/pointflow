export interface TierChangedEvent {
  eventId: string
  tenantId: string
  cardId: string
  cardCode: string
  previousDiscount: number
  newDiscount: number
  totalPoints: number
  timestamp: string
}
