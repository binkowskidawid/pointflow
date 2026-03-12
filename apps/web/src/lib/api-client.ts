import axios, { type AxiosError } from 'axios'

const loyaltyEngineClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOYALTY_ENGINE_URL ?? 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

// Centralise API error logging — avoids duplicate try/catch in every api function
loyaltyEngineClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', error.config?.url, error.response?.status, error.message)
    }
    return Promise.reject(error)
  },
)

// TODO Stage 2: add request interceptor here to attach JWT from auth context
// loyaltyEngineClient.interceptors.request.use((config) => {
//   const token = getToken() // from auth store
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

export { loyaltyEngineClient }
