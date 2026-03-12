'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast bg-zinc-900 border border-zinc-700 text-zinc-100 shadow-lg rounded-xl',
          description: 'text-zinc-400',
          actionButton: 'bg-emerald-600 text-white',
          cancelButton: 'bg-zinc-800 text-zinc-400',
          success: '!border-emerald-600/40',
          error: '!border-red-600/40',
        },
      }}
    />
  )
}
