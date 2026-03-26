'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Separator } from '@/components/ui/separator'
import { navItems } from '@/constants'
import { authApi } from '@/lib/api/auth'
import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
        isActive
          ? 'border border-emerald-600/25 bg-emerald-600/15 text-emerald-400'
          : 'border border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
      )}
    >
      <item.icon
        className={cn(
          'h-4 w-4 shrink-0 transition-colors',
          isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300',
        )}
      />
      {item.label}
    </Link>
  )
}

export function AppSidebar() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await authApi.logout()
      toast.success('Logged out successfully')
      router.replace('/login')
    } catch (error) {
      console.error('Logout failed', error)
      toast.error('Logout failed. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <aside className="flex h-full flex-col border-r border-zinc-800/60 bg-zinc-950">
      <div className="flex h-16 items-center gap-2 px-4">
        <Image
          src="/icon.png"
          alt="PointFlow Logo"
          width={28}
          height={28}
          className="rounded-lg shadow-lg shadow-emerald-800/90"
        />
        <span className="font-semibold tracking-tight text-zinc-100">PointFlow</span>
        <span className="ml-auto rounded-full border border-emerald-600/25 bg-emerald-600/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
          Beta
        </span>
      </div>

      <Separator />

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <Separator />

      <div className="flex flex-col gap-1 px-3 py-4">
        <Button
          size="sm"
          className="w-full cursor-pointer"
          variant="destructive"
          onClick={handleLogout}
          disabled={isLoggingOut}
          type="button"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </aside>
  )
}
