import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your loyalty program settings.',
}

export default async function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Settings</h1>
        <p className="text-sm text-zinc-400">Manage your loyalty program settings</p>
      </div>
    </div>
  )
}
