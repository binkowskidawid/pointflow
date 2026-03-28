import { Injectable } from '@nestjs/common'
import { InjectDatabase } from '../database/database.decorator'
import { InsertLoyaltyCard, loyaltyCards, customers } from '@pointflow/drizzle-schemas'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type * as schema from '@pointflow/drizzle-schemas'
import type { LoyaltyCard } from '@pointflow/types'
import { eq, sql, and, or } from 'drizzle-orm'

@Injectable()
export class CardsRepository {
  constructor(@InjectDatabase() private readonly db: PostgresJsDatabase<typeof schema>) {}

  async create(data: InsertLoyaltyCard): Promise<LoyaltyCard> {
    const [created] = await this.db.insert(loyaltyCards).values(data).returning()
    return created as unknown as LoyaltyCard
  }

  async findAll({ tenantId }: { tenantId: string }): Promise<LoyaltyCard[]> {
    const allCards = await this.db
      .select()
      .from(loyaltyCards)
      .where(eq(loyaltyCards.tenantId, tenantId))
    return allCards as unknown as LoyaltyCard[]
  }

  async findById({ cardId }: { cardId: string }): Promise<LoyaltyCard | null> {
    const [card] = await this.db.select().from(loyaltyCards).where(eq(loyaltyCards.id, cardId))
    return (card as unknown as LoyaltyCard) || null
  }

  async findByCode({
    code,
    tenantId,
  }: {
    code: string
    tenantId: string
  }): Promise<LoyaltyCard | null> {
    const [card] = await this.db
      .select()
      .from(loyaltyCards)
      .where(and(eq(loyaltyCards.code, code), eq(loyaltyCards.tenantId, tenantId)))

    return (card as unknown as LoyaltyCard) || null
  }

  async findByUserPhoneOrEmail({
    phoneOrEmail,
    tenantId,
  }: {
    phoneOrEmail: string
    tenantId: string
  }): Promise<LoyaltyCard | null> {
    const isPhone = /^\+?[\d\s-]+$/.test(phoneOrEmail)
    const normalized = isPhone ? phoneOrEmail.replace(/\s/g, '').slice(-9) : phoneOrEmail

    const [customer] = await this.db
      .select()
      .from(customers)
      .where(
        and(
          eq(customers.tenantId, tenantId),
          or(
            eq(customers.email, phoneOrEmail),
            sql`RIGHT(${customers.phoneNumber}, 9) = ${normalized}`,
          ),
        ),
      )

    if (!customer) {
      return null
    }

    const [card] = await this.db
      .select()
      .from(loyaltyCards)
      .where(and(eq(loyaltyCards.customerId, customer.id), eq(loyaltyCards.tenantId, tenantId)))

    return (card as unknown as LoyaltyCard) || null
  }

  async updatePoints({
    id,
    pointsDelta,
  }: {
    id: string
    pointsDelta: number
  }): Promise<Pick<LoyaltyCard, 'pointsBalance'>> {
    const [updated] = await this.db
      .update(loyaltyCards)
      .set({
        pointsBalance: sql`${loyaltyCards.pointsBalance} + ${pointsDelta}`,
        updatedAt: new Date(),
      })
      .where(eq(loyaltyCards.id, id))
      .returning({ pointsBalance: loyaltyCards.pointsBalance })
    return updated as unknown as Pick<LoyaltyCard, 'pointsBalance'>
  }
}
