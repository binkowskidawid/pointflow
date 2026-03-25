'use client'

import { useQuery } from '@tanstack/react-query'
import { Activity, CreditCard, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { visitsApi } from '@/lib/api/visits'
import { DEMO_TENANT_ID } from '@/constants'

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

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20" />
        <Skeleton className="mt-2 h-3 w-32" />
      </CardContent>
    </Card>
  )
}

function RecentVisitSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-4 py-3"
        >
          <div className="space-y-2">
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-3 w-36" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="ml-auto h-4 w-20" />
            <Skeleton className="ml-auto h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DashboardView() {
  const {
    data: visits = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['dashboard', 'tenant-visits', DEMO_TENANT_ID],
    queryFn: () => visitsApi.getByTenant(DEMO_TENANT_ID),
    staleTime: 30_000,
    retry: 1,
  })

  const totalPoints = visits.reduce((sum, v) => sum + v.pointsEarned, 0)
  const totalSpent = visits.reduce((sum, v) => sum + v.amountSpent, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Dashboard</h1>
        <p className="text-sm text-zinc-400">Overview of your loyalty program activity</p>
      </div>

      {isError ? (
        <Card className="border-red-900/40 bg-red-950/20">
          <CardHeader>
            <CardTitle className="text-base text-red-300">Failed to load dashboard</CardTitle>
            <CardDescription className="text-red-200/80">
              {error instanceof Error ? error.message : 'Unknown error'}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Visits</CardTitle>
              <CardDescription>Latest 10 visits across all loyalty cards</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <RecentVisitSkeleton />
              ) : visits.length === 0 ? (
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
                          Card:{' '}
                          <span className="font-mono text-xs text-zinc-400">{visit.cardCode}</span>
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
        </>
      )}
    </div>
  )
}
