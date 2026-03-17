export function generateLoyaltyCardCode(tenantId?: string): string {
  const prefix = tenantId ? tenantId.slice(-4).padStart(4, '0').toUpperCase() : '0000'
  const random8 = Math.floor(10000000 + Math.random() * 80000000).toString()
  return `${prefix}${random8}`
}
