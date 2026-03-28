export function parseExpiryToSeconds(value: string): number {
  const trimmed = value.trim()

  if (/^\d+$/.test(trimmed)) {
    const seconds = Number.parseInt(trimmed, 10)
    if (!Number.isFinite(seconds) || seconds <= 0) {
      throw new Error(`Expiry value must be a positive integer, got "${value}"`)
    }
    return seconds
  }

  const match = /^(\d+)([smhd])$/.exec(trimmed)
  if (!match) {
    throw new Error(`Invalid expiry format: "${value}" (expected e.g. "30s", "15m", "1h", "7d")`)
  }

  const amount = Number.parseInt(match[1]!, 10)
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`Expiry amount must be a positive integer, got "${value}"`)
  }

  const units: Record<string, number> = { s: 1, m: 60, h: 3_600, d: 86_400 }
  return amount * (units[match[2]!] ?? 1)
}
