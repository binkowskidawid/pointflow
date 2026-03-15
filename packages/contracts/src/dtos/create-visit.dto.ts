import { Currency } from '../enums'

export type CreateVisitDto = {
  cardId?: string
  userId?: string
  tenantId: string
  identifier: string
  receiptAmount: number
  receiptCurrency: Currency
}
