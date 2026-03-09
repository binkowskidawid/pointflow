import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { loyaltyCards, visits, users } from './index'
import { CardTier } from '@pointflow/contracts'
import { randomUUID } from 'crypto'

const [USER_ID_1, USER_ID_2, USER_ID_3] = [randomUUID(), randomUUID(), randomUUID()]

const connectionString =
  process.env.DATABASE_URL || 'postgres://pointflow_user@localhost:26257/pointflow'
const client = postgres(connectionString)
const db = drizzle(client)

async function seed() {
  console.log('🌱 Seeding database...')

  await db.delete(visits)
  await db.delete(loyaltyCards)
  await db.delete(users)

  const insertedUsers = await db
    .insert(users)
    .values([
      { id: USER_ID_1, email: 'jan@example.com', name: 'Jan Kowalski' },
      { id: USER_ID_2, email: 'adam@example.com', name: 'Adam Nowak' },
      { id: USER_ID_3, email: 'kasia@example.com', name: 'Katarzyna Los' },
    ])
    .returning()

  const insertedCards = await db
    .insert(loyaltyCards)
    .values([
      { userId: USER_ID_1, tier: CardTier.BRONZE, pointsBalance: 0 },
      { userId: USER_ID_2, tier: CardTier.SILVER, pointsBalance: 100 },
      { userId: USER_ID_3, tier: CardTier.GOLD, pointsBalance: 1000 },
    ])
    .returning({ id: loyaltyCards.id })

  const [card1, card2, card3] = insertedCards

  if (!card1 || !card2 || !card3) {
    throw new Error('Failed to create loyalty cards')
  }

  await db.insert(visits).values([
    {
      userId: USER_ID_1,
      cardId: card1.id,
      amountSpent: 10000,
      currency: 'PLN',
      pointsEarned: 100,
      appliedRuleSnapshot: {
        promotionId: randomUUID(),
        name: 'Standard Welcome Pts',
        multiplier: 1,
      },
      occurredAt: new Date(),
    },
    {
      userId: USER_ID_2,
      cardId: card2.id,
      amountSpent: 20000,
      currency: 'PLN',
      pointsEarned: 200,
      appliedRuleSnapshot: {
        promotionId: randomUUID(),
        name: 'Standard Welcome Pts',
        multiplier: 1,
      },
      occurredAt: new Date(),
    },
    {
      userId: USER_ID_3,
      cardId: card3.id,
      amountSpent: 30000,
      currency: 'PLN',
      pointsEarned: 300,
      appliedRuleSnapshot: {
        promotionId: randomUUID(),
        name: 'Standard Welcome Pts',
        multiplier: 1,
      },
      occurredAt: new Date(),
    },
  ])

  console.log('✅ Seeding finished!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed!')
  console.error(err)
  process.exit(1)
})
