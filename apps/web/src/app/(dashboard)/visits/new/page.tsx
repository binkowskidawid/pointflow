import type { Metadata } from 'next'
import { RegisterVisitView } from '../../../../components/visits/new/register-visit-view'

export const metadata: Metadata = {
  title: 'Register Visit',
  description: 'Register a new customer visit and award loyalty points.',
}

export default function RegisterVisitPage() {
  return <RegisterVisitView />
}
