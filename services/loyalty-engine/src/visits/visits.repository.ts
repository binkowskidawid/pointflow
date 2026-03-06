import { Injectable } from '@nestjs/common'
import { InjectDatabase } from '../database/database.decorator'
import { visits } from '@pointflow/drizzle-schemas'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type * as schema from '@pointflow/drizzle-schemas'
import type { Visit } from '@pointflow/types'

type NewVisit = typeof visits.$inferInsert

@Injectable()
export class VisitsRepository {
  constructor(@InjectDatabase() private readonly db: PostgresJsDatabase<typeof schema>) {}

  async create(data: NewVisit): Promise<Visit> {
    const [created] = await this.db.insert(visits).values(data).returning()
    return created as unknown as Visit
  }
}
