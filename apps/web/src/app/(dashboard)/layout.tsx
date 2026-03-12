import { AppSidebar } from '@/components/layout/app-sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden w-64 shrink-0 md:block">
        <AppSidebar />
      </div>

      {/* Right side */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header + drawer (only visible on mobile) */}
        <MobileNav />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
