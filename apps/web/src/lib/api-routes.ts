export const API_ROUTES = {
  LOYALTY: {
    VISITS: '/loyalty/visits',
    CARD_VISITS: (cardId: string) => `/loyalty/cards/${cardId}/visits`,
    TENANT_VISITS: (tenantId: string) => `/loyalty/visits?tenantId=${tenantId}`,
    PING: '/loyalty/ping',
  },
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    PING: '/auth/ping',
  },
} as const
