'use client'

import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { UserRole } from '@pointflow/contracts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthSession } from '@/lib/auth/session'

const STAFF_MANAGER_ROLES = new Set<UserRole>([
  UserRole.OWNER,
  UserRole.MANAGER,
  UserRole.SYSTEM_ADMIN,
])

export function StaffAccountsCard() {
  const { status, user } = useAuthSession()

  if (status !== 'authenticated' || !user || !STAFF_MANAGER_ROLES.has(user.role as UserRole)) {
    return null
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/80">
      <CardHeader>
        <CardTitle className="text-base">Staff accounts</CardTitle>
        <CardDescription>Manage team members who have access to the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild size="sm">
          <Link href="/settings/users/new">
            <UserPlus className="h-4 w-4" />
            Add staff member
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
