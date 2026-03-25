import type { Metadata } from 'next'
import { DashboardView } from './dashboard-view'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of your loyalty program activity.',
}

export default function DashboardPage() {
  return <DashboardView />
}
