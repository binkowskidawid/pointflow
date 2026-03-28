import type { CreateUserDto, LoginDto, LoginResponseDto } from '@pointflow/contracts'
import type { User } from '@pointflow/types'
import { apiClient } from '@/lib/api-client'
import { API_ROUTES } from '@/lib/api-routes'
import { logoutSession, setSession } from '@/lib/auth/session'

type PublicLoginResponse = Omit<LoginResponseDto, 'refreshToken'>

export const authApi = {
  createStaff: async (dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> => {
    const { data } = await apiClient.post<Omit<User, 'passwordHash'>>(
      API_ROUTES.AUTH.CREATE_STAFF,
      dto,
    )
    return data
  },

  login: async (dto: LoginDto): Promise<PublicLoginResponse> => {
    const { data } = await apiClient.post<PublicLoginResponse>(API_ROUTES.AUTH.LOGIN, dto)
    setSession(data.accessToken, data.user)
    return data
  },

  logout: async (): Promise<void> => {
    await logoutSession()
  },

  me: async (): Promise<LoginResponseDto['user']> => {
    const { data } = await apiClient.get<LoginResponseDto['user']>(API_ROUTES.AUTH.ME)
    return data
  },

  pingAuthService: async (): Promise<string> => {
    const { data } = await apiClient.get<string>(API_ROUTES.AUTH.PING)
    return data
  },
}
