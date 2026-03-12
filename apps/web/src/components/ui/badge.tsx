import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
        secondary: 'border-transparent bg-zinc-800 text-zinc-300',
        destructive: 'border-transparent bg-red-600/20 text-red-400 border-red-600/30',
        outline: 'border-zinc-700 text-zinc-300',
        gold: 'border-transparent bg-amber-600/20 text-amber-400 border-amber-600/30',
        silver: 'border-transparent bg-slate-600/20 text-slate-300 border-slate-600/30',
        bronze: 'border-transparent bg-orange-600/20 text-orange-400 border-orange-600/30',
        platinum: 'border-transparent bg-cyan-600/20 text-cyan-400 border-cyan-600/30',
        diamond: 'border-transparent bg-purple-600/20 text-purple-400 border-purple-600/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeProps = React.ComponentProps<'div'> & VariantProps<typeof badgeVariants>

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
