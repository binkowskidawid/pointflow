export const API_ROUTES = {
  LOYALTY: {
    VISITS: '/loyalty/visits',
    CARD_VISITS: (cardId: string) => `/loyalty/cards/${cardId}/visits`,
    TENANT_VISITS: (tenantId: string) => `/loyalty/visits?tenantId=${tenantId}`,
    PING: '/loyalty/ping',
  },
  // AUTH: { LOGIN: '/auth/login' }
} as const
