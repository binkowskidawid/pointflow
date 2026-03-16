import { pgTable, uuid, varchar, integer, jsonb, timestamp } from 'drizzle-orm/pg-core'
import type { PromotionSnapshot } from '@pointflow/types'
import { tenants } from './tenants.schema'

export const visits = pgTable('visits', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  cardId: uuid('card_id').notNull(),
  cardCode: varchar('card_code', { length: 20 }).notNull(),
  // amountSpent in cents to avoid floating point errors e.g. 10.99 -> 1099
  amountSpent: integer('amount_spent').notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  pointsEarned: integer('points_earned').notNull(),
  // PromotionSnapshot frozen at transaction time — immutable history
  appliedRuleSnapshot: jsonb('applied_rule_snapshot').$type<PromotionSnapshot>().notNull(),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type SelectVisit = typeof visits.$inferSelect
export type InsertVisit = typeof visits.$inferInsert
