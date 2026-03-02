import { Currency } from "../enums";

export type PointsEarnedEvent = {
  eventId: string;
  userId: string;
  cardId: string;
  receiptAmount: number;
  receiptCurrency: Currency;
  occurredAt: Date;
};
