import { pgTable, uuid, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { tenants } from './tenants.schema'
import { DiscountTier } from '@pointflow/types'

export const loyaltySettings = pgTable('loyalty_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  amountPerPoint: integer('amount_per_point').notNull().default(1000),
  isActive: boolean('is_active').default(true).notNull(),
  discountTiers: jsonb('discount_tiers').$type<DiscountTier[]>().default([]).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type SelectLoyaltySetting = typeof loyaltySettings.$inferSelect
export type InsertLoyaltySetting = typeof loyaltySettings.$inferInsert
