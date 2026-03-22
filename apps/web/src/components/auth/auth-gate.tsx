'use client'

import { type ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuthSession } from '@/lib/auth/session'

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { status } = useAuthSession()

  useEffect(() => {
    if (status === 'anonymous') {
      router.replace('/login')
    }
  }, [router, status])

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (status === 'anonymous') {
    return null
  }

  return <>{children}</>
}
