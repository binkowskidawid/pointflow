import type { CreateUserDto, LoginDto, LoginResponseDto } from '@pointflow/contracts'
import type { User } from '@pointflow/types'
import { apiClient } from '@/lib/api-client'
import { API_ROUTES } from '@/lib/api-routes'
import { clearSession, logoutSession, setSession } from '@/lib/auth/session'

type PublicLoginResponse = Omit<LoginResponseDto, 'refreshToken'>

export const authApi = {
  /**
   * User: register a new user.
   */
  register: async (dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> => {
    const { data } = await apiClient.post<Omit<User, 'passwordHash'>>(API_ROUTES.AUTH.REGISTER, dto)
    return data
  },

  /**
   * User: find user by email.
   */
  findByEmail: async ({
    email,
    tenantId,
  }: {
    email: string
    tenantId: string
  }): Promise<User | null> => {
    const { data } = await apiClient.get<User | null>(API_ROUTES.AUTH.FIND_BY_EMAIL, {
      params: { email, tenantId },
    })
    return data
  },

  login: async (dto: LoginDto): Promise<PublicLoginResponse> => {
    const { data } = await apiClient.post<PublicLoginResponse>(API_ROUTES.AUTH.LOGIN, dto)
    setSession(data.accessToken)
    return data
  },

  logout: async (): Promise<void> => {
    await logoutSession()
    clearSession()
  },

  /**
   * System: ping auth service.
   */
  pingAuthService: async (): Promise<string> => {
    const { data } = await apiClient.get<string>(API_ROUTES.AUTH.PING)
    return data
  },
}
