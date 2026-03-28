import { pgTable, uuid, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { tenants } from './tenants.schema'

export const customers = pgTable(
  'customers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    // Required — used as identifier for portal login (phone + card code)
    phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
    email: varchar('email', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('customer_phone_tenant_idx').on(table.phoneNumber, table.tenantId)],
)

export type SelectCustomer = typeof customers.$inferSelect
export type InsertCustomer = typeof customers.$inferInsert
