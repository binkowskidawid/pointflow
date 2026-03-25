export function parseJwtExpiryToSeconds(value: string): number {
  const trimmedValue = value.trim()

  if (/^\d+$/.test(trimmedValue)) {
    return Number.parseInt(trimmedValue, 10)
  }

  const match = /^(\d+)([smhd])$/.exec(trimmedValue)

  if (!match) {
    throw new Error(`Invalid JWT expiry value: ${value}`)
  }

  const amount = Number.parseInt(match[1]!, 10)
  const unit = match[2]!

  switch (unit) {
    case 's':
      return amount
    case 'm':
      return amount * 60
    case 'h':
      return amount * 60 * 60
    case 'd':
      return amount * 60 * 60 * 24
    default:
      throw new Error(`Invalid JWT expiry unit: ${unit}`)
  }
}

export function getRequiredEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} is not configured`)
  }

  return value
}

export function getJwtRefreshExpirySeconds(value: string | undefined): number {
  return parseJwtExpiryToSeconds(value ?? '7d')
}

export function getJwtAccessExpirySeconds(value: string | undefined): number {
  return parseJwtExpiryToSeconds(value ?? '15m')
}
