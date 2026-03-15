'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PlusCircle, CheckCircle2 } from 'lucide-react'
import { Currency } from '@pointflow/contracts'
import { visitsApi } from '@/lib/api/visits'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { DEMO_TENANT_ID } from '@/constants'

type FormState = {
  cardId: string
  receiptAmount: string
  receiptCurrency: Currency
}

const INITIAL_FORM: FormState = {
  cardId: '',
  receiptAmount: '',
  receiptCurrency: Currency.PLN,
}

const CURRENCIES = Object.values(Currency)

export function RegisterVisitView() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<FormState>(INITIAL_FORM)

  const {
    mutate,
    isPending,
    data: lastVisit,
  } = useMutation({
    mutationFn: visitsApi.register,
    onSuccess: (visit) => {
      // Invalidate card visits cache so Check Card page auto-refreshes
      void queryClient.invalidateQueries({ queryKey: ['visits', 'card', visit.cardId] })
      toast.success(`Visit registered — ${visit.pointsEarned} points awarded!`)
      setForm(INITIAL_FORM)
    },
    onError: (error: Error) => {
      toast.error(`Registration failed: ${error.message}`)
    },
  })

  function handleChange(field: keyof FormState) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const amountCents = Math.round(parseFloat(form.receiptAmount) * 100)

    if (isNaN(amountCents) || amountCents <= 0) {
      toast.error('Receipt amount must be a positive number.')
      return
    }

    mutate({
      identifier: form.cardId.trim(),
      tenantId: DEMO_TENANT_ID,
      receiptAmount: amountCents,
      receiptCurrency: form.receiptCurrency,
    })
  }

  const isFormValid = form.cardId.trim() && form.receiptAmount && parseFloat(form.receiptAmount) > 0

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Register Visit</h1>
        <p className="text-sm text-zinc-400">
          Record a customer visit and award loyalty points based on receipt amount.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PlusCircle className="h-4 w-4 text-emerald-500" />
            New Visit
          </CardTitle>
          <CardDescription>
            Fill in the card ID and receipt details. Points are calculated automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="register-visit-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Card ID */}
            <div className="space-y-1.5">
              <Label htmlFor="visit-card-id">Loyalty Card ID</Label>
              <Input
                id="visit-card-id"
                type="text"
                value={form.cardId}
                onChange={handleChange('cardId')}
                placeholder="e.g. a1b2c3d4-e5f6-..."
                className="font-mono"
                autoComplete="off"
                required
              />
            </div>

            {/* Amount + Currency in a row */}
            <div className="flex gap-3">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="visit-amount">Receipt Amount</Label>
                <Input
                  id="visit-amount"
                  type="number"
                  value={form.receiptAmount}
                  onChange={handleChange('receiptAmount')}
                  placeholder="e.g. 49.99"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div className="w-32 space-y-1.5">
                <Label htmlFor="visit-currency">Currency</Label>
                {/* Native select — no external dep needed for a 4-item list */}
                <select
                  id="visit-currency"
                  value={form.receiptCurrency}
                  onChange={handleChange('receiptCurrency')}
                  className="flex h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-100 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              id="register-visit-submit"
              type="submit"
              className="w-full"
              disabled={!isFormValid || isPending}
            >
              {isPending ? 'Registering…' : 'Register Visit'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Last registered visit confirmation */}
      {lastVisit && (
        <Card className="border-emerald-700/40 bg-emerald-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Visit Registered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-zinc-500">Card</p>
                <p className="font-mono text-xs text-zinc-300">{lastVisit.cardId}</p>
              </div>
              <div>
                <p className="text-zinc-500">Date</p>
                <p className="text-zinc-300">
                  {new Date(lastVisit.occurredAt).toLocaleString('en-GB')}
                </p>
              </div>
              <div>
                <p className="text-zinc-500">Amount</p>
                <p className="text-zinc-300">
                  {(lastVisit.amountSpent / 100).toFixed(2)} {lastVisit.currency}
                </p>
              </div>
              <div>
                <p className="text-zinc-500">Points Awarded</p>
                <Badge variant="default" className="mt-1">
                  +{lastVisit.pointsEarned} pts
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
