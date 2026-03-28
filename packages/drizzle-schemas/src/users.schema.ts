import { pgTable, uuid, varchar, timestamp, uniqueIndex, boolean } from 'drizzle-orm/pg-core'
import { UserRole } from '@pointflow/contracts'
import { tenants } from './tenants.schema'

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    phoneNumber: varchar('phone_number', { length: 20 }),
    name: varchar('name', { length: 255 }).notNull(),
    role: varchar('role', { length: 50 }).notNull().default(UserRole.RECEPTIONIST),
    twoFactorSecret: varchar('two_factor_secret', { length: 255 }),
    twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => {
    return [uniqueIndex('user_email_tenant_idx').on(table.email, table.tenantId)]
  },
)

export type SelectUser = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert
