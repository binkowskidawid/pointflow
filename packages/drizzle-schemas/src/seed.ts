import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { loyaltyCards, visits, users, tenants, loyaltySettings } from './index'
import { CardTier } from '@pointflow/contracts'
import { randomUUID } from 'crypto'
import { generateLoyaltyCardCode } from '@pointflow/utils'

const [USER_ID_1, USER_ID_2, USER_ID_3] = [randomUUID(), randomUUID(), randomUUID()]
const [TENANT_ID_1, TENANT_ID_2, TENANT_ID_3] = [randomUUID(), randomUUID(), randomUUID()]

const connectionString =
  process.env.DATABASE_URL || 'postgres://pointflow_user@localhost:26257/pointflow'
const client = postgres(connectionString)
const db = drizzle(client)

async function seed() {
  console.log('🌱 Seeding database...')

  await db.delete(visits)
  await db.delete(loyaltyCards)
  await db.delete(users)
  await db.delete(tenants)
  await db.delete(loyaltySettings)

  await db
    .insert(users)
    .values([
      {
        id: USER_ID_1,
        email: 'jan@example.com',
        phoneNumber: '+48123456789',
        name: 'Jan Kowalski',
      },
      { id: USER_ID_2, email: 'adam@example.com', phoneNumber: '+48123456788', name: 'Adam Nowak' },
      {
        id: USER_ID_3,
        email: 'kasia@example.com',
        phoneNumber: '+48123456787',
        name: 'Katarzyna Los',
      },
    ])
    .returning()

  await db
    .insert(tenants)
    .values([
      { id: TENANT_ID_1, name: 'Tenant 1', slug: 'tenant-1' },
      { id: TENANT_ID_2, name: 'Tenant 2', slug: 'tenant-2' },
      { id: TENANT_ID_3, name: 'Tenant 3', slug: 'tenant-3' },
    ])
    .returning()

  await db.insert(loyaltySettings).values([
    { tenantId: TENANT_ID_1, amountPerPoint: 1000 }, // 10 PLN = 1 pkt
    { tenantId: TENANT_ID_2, amountPerPoint: 2000 }, // 20 PLN = 1 pkt
    { tenantId: TENANT_ID_3, amountPerPoint: 500 }, // 5 PLN = 1 pkt
  ])

  const insertedCards = await db
    .insert(loyaltyCards)
    .values([
      {
        userId: USER_ID_1,
        code: generateLoyaltyCardCode(TENANT_ID_1),
        tenantId: TENANT_ID_1,
        tier: CardTier.BRONZE,
        pointsBalance: 0,
      },
      {
        userId: USER_ID_2,
        code: generateLoyaltyCardCode(TENANT_ID_2),
        tenantId: TENANT_ID_2,
        tier: CardTier.SILVER,
        pointsBalance: 100,
      },
      {
        userId: USER_ID_3,
        code: generateLoyaltyCardCode(TENANT_ID_3),
        tenantId: TENANT_ID_3,
        tier: CardTier.GOLD,
        pointsBalance: 1000,
      },
    ])
    .returning({ id: loyaltyCards.id })

  const [card1, card2, card3] = insertedCards

  if (!card1 || !card2 || !card3) {
    throw new Error('Failed to create loyalty cards')
  }

  await db.insert(visits).values([
    {
      userId: USER_ID_1,
      tenantId: TENANT_ID_1,
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
      tenantId: TENANT_ID_2,
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
      tenantId: TENANT_ID_3,
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
