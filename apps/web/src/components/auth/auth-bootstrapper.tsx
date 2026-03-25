'use client'

import { useEffect } from 'react'
import { bootstrapSession } from '@/lib/auth/session'

export function AuthBootstrapper() {
  useEffect(() => {
    void bootstrapSession()
  }, [])

  return null
}
