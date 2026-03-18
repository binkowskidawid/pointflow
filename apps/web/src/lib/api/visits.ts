import type { CreateVisitDto } from '@pointflow/contracts'
import type { Visit } from '@pointflow/types'
import { apiClient } from '@/lib/api-client'
import { API_ROUTES } from '@/lib/api-routes'

export const visitsApi = {
  /**
   * Admin: all visits for a given tenant (receptionist dashboard).
   */
  getByTenant: async (tenantId: string): Promise<Visit[]> => {
    const { data } = await apiClient.get<Visit[]>(API_ROUTES.LOYALTY.VISITS, {
      params: { tenantId },
    })
    return data
  },

  /**
   * Receptionist: visit history for a specific loyalty card.
   */
  getByCardId: async (cardId: string, tenantId?: string): Promise<Visit[]> => {
    const { data } = await apiClient.get<Visit[]>(API_ROUTES.LOYALTY.CARD_VISITS(cardId), {
      params: { tenantId },
    })
    return data
  },

  /**
   * Receptionist: register a new visit.
   */
  register: async (dto: CreateVisitDto): Promise<Visit> => {
    const { data } = await apiClient.post<Visit>(API_ROUTES.LOYALTY.VISITS, dto)
    return data
  },

  /**
   * System: ping loyalty engine.
   */
  pingLoyaltyEngine: async (): Promise<string> => {
    const { data } = await apiClient.get<string>(API_ROUTES.LOYALTY.PING)
    return data
  },
}
