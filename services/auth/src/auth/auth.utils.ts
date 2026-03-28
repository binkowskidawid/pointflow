import { getRequiredEnv, parseExpiryToSeconds } from '@pointflow/utils'

export { getRequiredEnv, parseExpiryToSeconds }

export function getJwtRefreshExpirySeconds(value: string | undefined): number {
  return parseExpiryToSeconds(value ?? '7d')
}

export function getJwtAccessExpirySeconds(value: string | undefined): number {
  return parseExpiryToSeconds(value ?? '15m')
}
