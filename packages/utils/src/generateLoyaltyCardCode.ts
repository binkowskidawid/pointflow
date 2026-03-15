export function generateLoyaltyCardCode(tenantId?: string): string {
  const random9 = Math.floor(100000000 + Math.random() * 900000000).toString()
  return tenantId ? `${tenantId.slice(-4)}${random9}` : random9
}
