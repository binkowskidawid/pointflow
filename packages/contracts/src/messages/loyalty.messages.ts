export const LOYALTY_MESSAGES = {
  VISIT: {
    CREATE: 'loyalty.visit.create',
    GET_ALL: 'loyalty.visit.get_all',
    GET_BY_CARD: 'loyalty.visit.get_by_card',
  },
  CARD: {
    CREATE: 'loyalty.card.create',
    GET_BY_ID: 'loyalty.card.get_by_id',
    GET_ALL: 'loyalty.card.get_all',
    RESOLVE: 'loyalty.card.resolve',
  },
  INTERNAL: {
    PING: 'loyalty.internal.ping',
  },
} as const
