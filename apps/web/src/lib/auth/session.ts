'use client'

import { useSyncExternalStore } from 'react'
import type { LoginDto, LoginResponseDto } from '@pointflow/contracts'
import { API_ROUTES } from '@/lib/api-routes'

export type AuthSession = Omit<LoginResponseDto, 'refreshToken'>
export type AuthStatus = 'checking' | 'authenticated' | 'anonymous'
export type LoginCredentials = Pick<LoginDto, 'identifier' | 'password' | 'tenantId'>

export type AuthUser = LoginResponseDto['user']

type AuthState = {
  accessToken: string | null
  user: AuthUser | null
  status: AuthStatus
}

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001'
const AUTH_BASE_URL = `${API_GATEWAY_URL}/api/v1`

let authState: AuthState = {
  accessToken: null,
  user: null,
  status: 'checking',
}
let refreshPromise: Promise<AuthSession | null> | null = null
const listeners = new Set<() => void>()

function notifyListeners(): void {
  listeners.forEach((listener) => listener())
}

function setAuthState(nextState: AuthState): void {
  authState = nextState
  notifyListeners()
}

export function getAccessToken(): string | null {
  return authState.accessToken
}

export function getAuthStatus(): AuthStatus {
  return authState.status
}

export function setSession(accessToken: string, user?: AuthUser): void {
  setAuthState({ accessToken, user: user ?? authState.user, status: 'authenticated' })
}

export function clearSession(): void {
  setAuthState({ accessToken: null, user: null, status: 'anonymous' })
}

export function subscribeToAuthState(listener: () => void): () => void {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function useAuthSession(): AuthState {
  return useSyncExternalStore(
    subscribeToAuthState,
    () => authState,
    () => authState,
  )
}

async function parseSessionResponse(response: Response): Promise<AuthSession | null> {
  if (!response.ok) {
    clearSession()
    return null
  }

  const session = (await response.json()) as AuthSession
  setSession(session.accessToken, session.user)
  return session
}

async function requestRefreshSession(): Promise<AuthSession | null> {
  const response = await fetch(`${AUTH_BASE_URL}${API_ROUTES.AUTH.REFRESH}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await parseSessionResponse(response)
}

export async function refreshSession(): Promise<AuthSession | null> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = requestRefreshSession().catch(() => {
    clearSession()
    return null
  })

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

export async function bootstrapSession(): Promise<void> {
  if (authState.accessToken) {
    setAuthState({
      accessToken: authState.accessToken,
      user: authState.user,
      status: 'authenticated',
    })
    return
  }

  await refreshSession()
}

export async function logoutSession(): Promise<void> {
  try {
    const response = await fetch(`${AUTH_BASE_URL}${API_ROUTES.AUTH.LOGOUT}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`Logout failed with status ${response.status}`)
    }

    clearSession()
  } catch (error) {
    throw new Error('Failed to logout', { cause: error })
  }
}
