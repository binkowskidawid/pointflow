'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppSidebar } from '@/components/layout/app-sidebar'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="flex h-16 items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-4 md:hidden">
        <Image
          src="/icon.png"
          alt="PointFlow Logo"
          width={28}
          height={28}
          className="rounded-lg shadow-lg shadow-zinc-800/90"
        />
        <span className="font-semibold text-zinc-100">PointFlow</span>
        <Button
          id="mobile-nav-toggle"
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Overlay + slide-in drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 md:hidden">
            <AppSidebar />
          </div>
        </>
      )}
    </>
  )
}
