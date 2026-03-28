import { Injectable } from '@nestjs/common'
import { customers } from '@pointflow/drizzle-schemas'
import { eq } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type * as schema from '@pointflow/drizzle-schemas'
import { InjectDatabase } from '../database/database.decorator'

@Injectable()
export class CustomersRepository {
  constructor(@InjectDatabase() private readonly db: PostgresJsDatabase<typeof schema>) {}

  async findById(id: string) {
    const [customer] = await this.db.select().from(customers).where(eq(customers.id, id))
    return customer || null
  }
}
