export const AUTH_MESSAGES = {
  USER: {
    CREATE: 'auth.user.create',
    GET_BY_ID: 'auth.user.get_by_id',
    GET_ALL: 'auth.user.get_all',
    FIND_BY_EMAIL: 'auth.user.find_by_email',
  },
  INTERNAL: {
    PING: 'auth.internal.ping',
  },
} as const
