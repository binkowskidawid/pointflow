import { Currency } from "../enums";

export type CreateVisitDto = {
  cardId: string;
  userId: string;
  receiptAmount: number;
  receiptCurrency: Currency;
};
