import type { Metadata } from 'next'
import { CheckCardView } from '../../../../components/cards/check/check-card-view'

export const metadata: Metadata = {
  title: 'Check Card',
  description: 'Look up a loyalty card and view its visit history.',
}

export default function CheckCardPage() {
  return <CheckCardView />
}
