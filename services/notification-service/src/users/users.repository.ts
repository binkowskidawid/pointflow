import { Injectable } from '@nestjs/common'
import { users } from '@pointflow/drizzle-schemas'
import { eq } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type * as schema from '@pointflow/drizzle-schemas'
import { InjectDatabase } from '../database/database.decorator'
import { User } from '@pointflow/types'

@Injectable()
export class UsersRepository {
  constructor(@InjectDatabase() private readonly db: PostgresJsDatabase<typeof schema>) {}

  async upsert(data: User) {
    return await this.db
      .insert(users)
      .values({
        id: data.id,
        email: data.email,
        phoneNumber: data.phoneNumber,
        name: data.name || data.email.split('@')[0] || 'Anonymous',
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: data.email,
          phoneNumber: data.phoneNumber,
          name: data.name || data.email.split('@')[0] || 'Anonymous',
          updatedAt: new Date(),
        },
      })
  }

  async findById(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id))
    return user || null
  }
}
