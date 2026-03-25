import { Injectable } from '@nestjs/common'
import { InjectDatabase } from '../database/database.decorator'
import { InsertVisit, visits } from '@pointflow/drizzle-schemas'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type * as schema from '@pointflow/drizzle-schemas'
import type { Visit } from '@pointflow/types'
import { eq, desc } from 'drizzle-orm'

@Injectable()
export class VisitsRepository {
  constructor(@InjectDatabase() private readonly db: PostgresJsDatabase<typeof schema>) {}

  async create(data: InsertVisit): Promise<Visit> {
    const [created] = await this.db.insert(visits).values(data).returning()
    return created as unknown as Visit
  }

  async findAll({ tenantId }: { tenantId: string }): Promise<Visit[]> {
    const allVisits = await this.db
      .select()
      .from(visits)
      .where(eq(visits.tenantId, tenantId))
      .orderBy(desc(visits.occurredAt))
    return allVisits as unknown as Visit[]
  }

  async findByCardId({ cardId }: { cardId: string }): Promise<Visit[]> {
    const allVisits = await this.db
      .select()
      .from(visits)
      .where(eq(visits.cardId, cardId))
      .orderBy(desc(visits.occurredAt))
    return allVisits as unknown as Visit[]
  }
}
