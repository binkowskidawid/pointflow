import { pgTable, uuid, integer, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { CardTier } from '@pointflow/contracts'
import { tenants } from './tenants.schema'
import { sql } from 'drizzle-orm'

export const loyaltyCards = pgTable(
  'loyalty_cards',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    code: varchar('code', { length: 20 }).notNull(),
    pointsBalance: integer('points_balance').notNull().default(0),
    tier: varchar('tier', { length: 20 }).notNull().default(CardTier.BRONZE),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => {
    return [
      uniqueIndex('user_tenant_idx').on(table.userId, table.tenantId),
      uniqueIndex('code_tenant_idx').on(table.code, table.tenantId),
    ]
  },
)

export type SelectLoyaltyCard = typeof loyaltyCards.$inferSelect
export type InsertLoyaltyCard = typeof loyaltyCards.$inferInsert
