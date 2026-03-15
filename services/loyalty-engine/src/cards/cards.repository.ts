import { Injectable } from '@nestjs/common'
import { InjectDatabase } from '../database/database.decorator'
import { InsertLoyaltyCard, loyaltyCards, users } from '@pointflow/drizzle-schemas'
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

    const [user] = await this.db
      .select()
      .from(users)
      .where(or(eq(users.email, phoneOrEmail), sql`RIGHT(${users.phoneNumber}, 9) = ${normalized}`))

    if (!user) {
      return null
    }

    const [card] = await this.db
      .select()
      .from(loyaltyCards)
      .where(and(eq(loyaltyCards.userId, user.id), eq(loyaltyCards.tenantId, tenantId)))

    return (card as unknown as LoyaltyCard) || null
  }

  async updatePoints({
    id,
    pointsDelta,
  }: {
    id: string
    pointsDelta: number
  }): Promise<LoyaltyCard> {
    const [updated] = await this.db
      .update(loyaltyCards)
      .set({
        pointsBalance: sql`${loyaltyCards.pointsBalance} + ${pointsDelta}`,
        updatedAt: new Date(),
      })
      .where(eq(loyaltyCards.id, id))
      .returning()
    return updated as unknown as LoyaltyCard
  }
}
