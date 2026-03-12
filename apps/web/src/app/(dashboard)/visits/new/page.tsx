import type { Metadata } from 'next'
import { RegisterVisitView } from './register-visit-view'

export const metadata: Metadata = {
  title: 'Register Visit',
  description: 'Register a new customer visit and award loyalty points.',
}

export default function RegisterVisitPage() {
  return <RegisterVisitView />
}
