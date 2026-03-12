import { LayoutDashboard, CreditCard, PlusCircle } from 'lucide-react'

export const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Check Card',
    href: '/cards/check',
    icon: CreditCard,
  },
  {
    label: 'Register Visit',
    href: '/visits/new',
    icon: PlusCircle,
  },
] as const
