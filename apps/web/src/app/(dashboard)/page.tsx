import { Activity, CreditCard, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Visit } from '@pointflow/types'
import { serverFetch } from '@/lib/api-server'
import { API_ROUTES } from '@/lib/api-routes'

export const dynamic = 'force-dynamic'

// TODO: replace hardcoded tenantId with auth context in Stage 2
// const DEMO_TENANT_ID = 'f54f08d9-6a93-4b3f-b75a-4344153f3623'
const DEMO_TENANT_ID = '52f3a599-23e6-4c38-aeae-d56754b7ce01'

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: string | number
  description: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-emerald-500" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-zinc-50">{value}</p>
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </CardContent>
    </Card>
  )
}

export default async function DashboardPage() {
  const visits = await serverFetch<Visit[]>(API_ROUTES.LOYALTY.TENANT_VISITS(DEMO_TENANT_ID))

  const totalPoints = visits.reduce((sum, v) => sum + v.pointsEarned, 0)
  const totalSpent = visits.reduce((sum, v) => sum + v.amountSpent, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Dashboard</h1>
        <p className="text-sm text-zinc-400">Overview of your loyalty program activity</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Visits"
          value={visits.length}
          description="All time registered visits"
          icon={Activity}
        />
        <StatCard
          title="Points Earned"
          value={totalPoints.toLocaleString()}
          description="Total across all cards"
          icon={TrendingUp}
        />
        <StatCard
          title="Revenue Tracked"
          value={`${(totalSpent / 100).toFixed(2)} PLN`}
          description="Total receipt amounts"
          icon={CreditCard}
        />
        <StatCard
          title="Unique Cards"
          value={new Set(visits.map((v) => v.cardId)).size}
          description="Distinct loyalty cards used"
          icon={Users}
        />
      </div>

      {/* Recent visits */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Visits</CardTitle>
          <CardDescription>Latest 10 visits across all loyalty cards</CardDescription>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No visits recorded yet. Start by registering a visit.
            </p>
          ) : (
            <div className="space-y-2">
              {visits.slice(0, 10).map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      Card: <span className="font-mono text-xs text-zinc-400">{visit.cardId}</span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(visit.occurredAt).toLocaleString('en-GB')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-400">
                      +{visit.pointsEarned} pts
                    </p>
                    <p className="text-xs text-zinc-500">
                      {(visit.amountSpent / 100).toFixed(2)} {visit.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
