import { Injectable } from '@nestjs/common'
import { InjectDatabase } from '../database/database.decorator'
import type * as schema from '@pointflow/drizzle-schemas'
import { InsertUser, users } from '@pointflow/drizzle-schemas'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type { User } from '@pointflow/types'
import { and, eq } from 'drizzle-orm'

@Injectable()
export class AuthRepository {
  constructor(@InjectDatabase() private readonly db: PostgresJsDatabase<typeof schema>) {}

  async register(data: InsertUser): Promise<User> {
    const [registeredUser] = await this.db.insert(users).values(data).returning()

    return registeredUser as unknown as User
  }

  async findByEmail({
    email,
    tenantId,
  }: {
    email: string
    tenantId: string
  }): Promise<User | null> {
    const [found] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.tenantId, tenantId)))
    return found as unknown as User
  }

  async findById(id: string): Promise<User | null> {
    const [found] = await this.db.select().from(users).where(eq(users.id, id))
    return found as unknown as User
  }
}
