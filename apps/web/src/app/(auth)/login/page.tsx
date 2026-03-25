'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi } from '@/lib/api/auth'
import { DEMO_TENANT_ID } from '@/constants'
import { useAuthSession } from '@/lib/auth/session'

export default function LoginPage() {
  const router = useRouter()
  const { status } = useAuthSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tenantId, setTenantId] = useState(DEMO_TENANT_ID)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/')
    }
  }, [router, status])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await authApi.login({ email, password, tenantId })
      toast.success('Signed in successfully')
      router.replace('/')
    } catch {
      toast.error('Login failed. Check email, password and tenant ID.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/80 shadow-2xl shadow-black/20 backdrop-blur">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Sign in to PointFlow</CardTitle>
        <CardDescription>
          Refresh token lives in an HttpOnly cookie, access token stays in memory only.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenantId">Tenant ID</Label>
            <Input
              id="tenantId"
              value={tenantId}
              onChange={(event) => setTenantId(event.target.value)}
              placeholder="Tenant UUID"
              autoComplete="organization"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting || status === 'checking'}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            Sign in
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
