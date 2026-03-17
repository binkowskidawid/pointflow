import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateLoyaltyCardCode } from '../src'

describe('generateLoyaltyCardCode', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('Generates 12-digit card code with predictable pattern', () => {
    vi.spyOn(global.Math, 'random').mockReturnValue(0.123456)

    const code = generateLoyaltyCardCode()

    expect(code).toHaveLength(12)
    expect(code).toMatch(/^\d{12}$/)
  })

  it('Add prefix from tenantId (last 4 digits)', () => {
    const tenantId = 'tenant123'
    const code = generateLoyaltyCardCode(tenantId)

    expect(code).toHaveLength(12)
    expect(code.startsWith('T123')).toBe(true)
  })

  it('Works with short tenantId (less than 4 characters)', () => {
    const tenantId = 'abc'
    const code = generateLoyaltyCardCode(tenantId)

    expect(code).toHaveLength(12)
    expect(code.startsWith('0ABC')).toBe(true)
  })

  it('Generated code is numeric (after tenantId prefix) only prefix and digits', () => {
    const tenantId = 'tenant123'
    const code = generateLoyaltyCardCode(tenantId)
    const numericPart = code.slice(-8)

    expect(numericPart).toMatch(/^\d{8}$/)
  })

  it('Generates different codes on subsequent calls', () => {
    vi.spyOn(global.Math, 'random').mockReturnValueOnce(0.1).mockReturnValueOnce(0.9)

    const tenantId = 'tenant123'
    const code1 = generateLoyaltyCardCode(tenantId)
    const code2 = generateLoyaltyCardCode(tenantId)

    expect(code1).not.toBe(code2)
  })

  it('Handles empty tenantId', () => {
    expect(generateLoyaltyCardCode('')).toMatch(/^0000\d{8}$/)
  })

  it('Generates valid random range', () => {
    const codes = Array.from({ length: 100 }, () => generateLoyaltyCardCode())
    codes.forEach((code) => expect(code).toMatch(/^\d{12}$/))
  })
})
