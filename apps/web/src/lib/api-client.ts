import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_ROUTES } from '@/lib/api-routes'
import { clearSession, getAccessToken, refreshSession } from '@/lib/auth/session'

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001'}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10_000,
})

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean
}

const AUTH_ROUTES_THAT_SHOULD_NOT_REFRESH = [
  API_ROUTES.AUTH.REGISTER,
  API_ROUTES.AUTH.LOGIN,
  API_ROUTES.AUTH.REFRESH,
  API_ROUTES.AUTH.LOGOUT,
  API_ROUTES.AUTH.FIND_BY_EMAIL,
  API_ROUTES.AUTH.PING,
] as const

function shouldSkipRefresh(requestUrl: string | undefined): boolean {
  if (!requestUrl) {
    return false
  }

  return AUTH_ROUTES_THAT_SHOULD_NOT_REFRESH.some((route) => requestUrl.includes(route))
}

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (accessToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

// Centralize API error logging — avoids duplicate try/catch in every api function
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', error.config?.url, error.response?.status, error.message)
    }

    const originalRequest = error.config as RetryableRequest | undefined
    const shouldAttemptRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest.url)

    if (shouldAttemptRefresh) {
      originalRequest._retry = true

      const session = await refreshSession()

      if (session?.accessToken) {
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${session.accessToken}`
        return await apiClient.request(originalRequest)
      }

      clearSession()
    }

    return Promise.reject(error)
  },
)

export { apiClient }
