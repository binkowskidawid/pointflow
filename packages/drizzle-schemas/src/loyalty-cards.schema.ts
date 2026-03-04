import { pgTable, uuid, integer, varchar, timestamp } from 'drizzle-orm/pg-core'
import { CardTier } from '@pointflow/contracts'

export const loyaltyCards = pgTable('loyalty_cards', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique(),
  pointsBalance: integer('points_balance').notNull().default(0),
  tier: varchar('tier', { length: 20 }).notNull().default(CardTier.BRONZE),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type SelectLoyaltyCard = typeof loyaltyCards.$inferSelect
export type InsertLoyaltyCard = typeof loyaltyCards.$inferInsert
