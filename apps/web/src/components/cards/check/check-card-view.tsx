'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, CreditCard } from 'lucide-react'
import { visitsApi } from '@/lib/api/visits'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DEMO_TENANT_ID } from '@/constants'

function VisitsTableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

export function CheckCardView() {
  const [cardId, setCardId] = useState('')
  const [submittedCardId, setSubmittedCardId] = useState<string | null>(null)

  const {
    data: visits,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['visits', 'card', submittedCardId],
    queryFn: () => visitsApi.getByCardId(submittedCardId!, DEMO_TENANT_ID),
    // Only fetch when we have a submitted card ID
    enabled: Boolean(submittedCardId),
    staleTime: 30_000,
    retry: 1,
  })

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = cardId.trim()
    if (!trimmed) return
    setSubmittedCardId(trimmed)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Check Card</h1>
        <p className="text-sm text-zinc-400">
          Enter a loyalty card ID to view its visit history and points balance.
        </p>
      </div>

      {/* Search form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4 text-emerald-500" />
            Card Lookup
          </CardTitle>
          <CardDescription>Enter the loyalty card number or client phone number</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="card-check-form" onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="card-id-input">Card number or phone number</Label>
              <Input
                id="card-id-input"
                type="text"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                placeholder="e.g. a1b2c3d4-e5f6-..."
                className="font-mono"
                autoComplete="off"
              />
            </div>
            <div className="flex items-end">
              <Button id="card-check-submit" type="submit" disabled={!cardId.trim() || isLoading}>
                <Search className="h-4 w-4" />
                Look up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {submittedCardId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visit History</CardTitle>
            <CardDescription className="font-mono text-xs">{submittedCardId}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <VisitsTableSkeleton />}

            {isError && (
              <div className="rounded-lg border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm text-red-400">
                Failed to load visits: {error instanceof Error ? error.message : 'Unknown error'}
              </div>
            )}

            {visits && visits.length === 0 && (
              <p className="py-8 text-center text-sm text-zinc-500">
                No visits found for this card.
              </p>
            )}

            {visits && visits.length > 0 && (
              <>
                {/* Summary row */}
                <div className="mb-4 flex items-center gap-4">
                  <Badge variant="default">
                    {visits.reduce((sum, v) => sum + v.pointsEarned, 0).toLocaleString()} pts total
                  </Badge>
                  <span className="text-xs text-zinc-500">{visits.length} visits</span>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Points Earned</TableHead>
                      <TableHead>Promotion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visits.map((visit) => (
                      <TableRow key={visit.id}>
                        <TableCell className="text-zinc-300">
                          {new Date(visit.occurredAt).toLocaleString('en-GB')}
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {(visit.amountSpent / 100).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{visit.currency}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-emerald-400">
                          +{visit.pointsEarned}
                        </TableCell>
                        <TableCell className="text-xs text-zinc-500">
                          {visit.appliedRuleSnapshot.name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
