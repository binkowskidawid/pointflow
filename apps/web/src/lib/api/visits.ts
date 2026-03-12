import type { CreateVisitDto } from '@pointflow/contracts'
import type { Visit } from '@pointflow/types'
import { loyaltyEngineClient } from '@/lib/api-client'

export const visitsApi = {
  /**
   * Admin: all visits for a given tenant (receptionist dashboard).
   */
  getByTenant: async (tenantId: string): Promise<Visit[]> => {
    const { data } = await loyaltyEngineClient.get<Visit[]>('/visits', {
      params: { tenantId },
    })
    return data
  },

  /**
   * Receptionist: visit history for a specific loyalty card.
   */
  getByCardId: async (cardId: string): Promise<Visit[]> => {
    const { data } = await loyaltyEngineClient.get<Visit[]>(`/cards/${cardId}/visits`)
    return data
  },

  /**
   * Receptionist: register a new visit.
   */
  register: async (dto: CreateVisitDto): Promise<Visit> => {
    const { data } = await loyaltyEngineClient.post<Visit>('/visits', dto)
    return data
  },
}
