import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedFunction,
  type MockedObject,
  vi,
} from 'vitest'
import { CardsService } from './cards.service'
import { CardsRepository } from './cards.repository'
import { generateLoyaltyCardCode } from '@pointflow/utils'
import { CardTier, CreateLoyaltyCardDto } from '@pointflow/contracts'
import type { LoyaltyCard } from '@pointflow/types'

vi.mock('@pointflow/utils', () => ({
  generateLoyaltyCardCode: vi.fn(),
}))

describe('CardsService', () => {
  let service: CardsService
  let mockRepo: MockedObject<CardsRepository>
  let mockGenerateCode: MockedFunction<typeof generateLoyaltyCardCode>

  const mockCard: LoyaltyCard = {
    id: 'uuid-1234-5678-abcd-efgh',
    customerId: 'customer123',
    tenantId: 'tenant123',
    pointsBalance: 0,
    code: 'T12312345678',
    tier: CardTier.BRONZE,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockRepo = {
      create: vi.fn(),
      findByCode: vi.fn(),
      findByUserPhoneOrEmail: vi.fn(),
    } satisfies Partial<CardsRepository> as MockedObject<CardsRepository>

    mockGenerateCode = vi.mocked(generateLoyaltyCardCode)
    service = new CardsService(mockRepo)
  })

  it('creates card with all defaults (auto UUID, code, tier=Bronze, points=0)', async () => {
    mockGenerateCode.mockReturnValue('T12312345678')
    mockRepo.create.mockResolvedValue(mockCard)

    const dto: CreateLoyaltyCardDto = { customerId: 'customer123', tenantId: 'tenant123' }

    await service.createCard(dto)

    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'customer123',
        tenantId: 'tenant123',
        pointsBalance: 0,
        code: 'T12312345678',
        tier: CardTier.BRONZE,
      }),
    )

    expect(mockGenerateCode).toHaveBeenCalledWith('tenant123')
  })

  it('overrides code, tier, pointsBalance when provided in DTO', async () => {
    mockRepo.create.mockResolvedValue(mockCard)

    const dto: CreateLoyaltyCardDto = {
      customerId: 'customer123',
      tenantId: 'tenant123',
      code: 'CUSTOM123',
      tier: CardTier.GOLD,
      pointsBalance: 100,
    }

    await service.createCard(dto)

    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ...dto,
      }),
    )

    expect(mockGenerateCode).not.toHaveBeenCalled()
  })

  describe('resolveCard', () => {
    it('resolves by code (direct hit)', async () => {
      const mockCodeCard: LoyaltyCard = {
        id: 'uuid-1234-5678-abcd-efgh',
        customerId: 'customer123',
        tenantId: 'tenant123',
        pointsBalance: 0,
        code: 'T12312345678',
        tier: CardTier.BRONZE,
        createdAt: new Date('2026-03-17T11:28:08.692Z'),
        updatedAt: new Date('2026-03-17T11:28:08.692Z'),
      }

      mockRepo.findByCode.mockResolvedValue(mockCodeCard)

      const card = await service.resolveCard('CODE123', 'tenant123')

      expect(mockRepo.findByCode).toHaveBeenCalledWith({ code: 'CODE123', tenantId: 'tenant123' })
      expect(mockRepo.findByUserPhoneOrEmail).not.toHaveBeenCalled()
      expect(card).toBe(mockCodeCard)
    })

    it('fallback: code null → phone/email → success', async () => {
      const mockUserCard: LoyaltyCard = {
        id: 'uuid-1234-5678-abcd-abcd',
        customerId: 'customer321',
        tenantId: 'tenant321',
        pointsBalance: 1000,
        code: 'T32112345678',
        tier: CardTier.GOLD,
        createdAt: new Date('2026-03-17T11:28:08.692Z'),
        updatedAt: new Date('2026-03-17T11:28:08.692Z'),
      }
      mockRepo.findByCode.mockResolvedValue(null)
      mockRepo.findByUserPhoneOrEmail.mockResolvedValue(mockUserCard)

      const card = await service.resolveCard('48123456789', 'tenant321') // phone

      expect(mockRepo.findByCode).toHaveBeenCalledWith({
        code: '48123456789',
        tenantId: 'tenant321',
      })
      expect(mockRepo.findByUserPhoneOrEmail).toHaveBeenCalledWith({
        phoneOrEmail: '48123456789',
        tenantId: 'tenant321',
      })
      expect(card).toBe(mockUserCard)
    })

    it('throws Card not found (code + fallback fail)', async () => {
      mockRepo.findByCode.mockResolvedValue(null)
      mockRepo.findByUserPhoneOrEmail.mockResolvedValue(null)

      await expect(service.resolveCard('NONEXISTENT', 'tenant123')).rejects.toThrow(
        'Card not found',
      )
    })
  })
})
