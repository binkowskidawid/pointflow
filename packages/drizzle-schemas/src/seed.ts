import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { loyaltyCards, visits, users, tenants, loyaltySettings } from './index'
import { CardTier } from '@pointflow/contracts'
import { randomUUID } from 'crypto'
import { generateLoyaltyCardCode } from '@pointflow/utils'

const [USER_ID_1, USER_ID_2, USER_ID_3] = [
  '08098720-4118-438d-8711-50311d422b76',
  '9e87c038-130b-426d-b926-59195424734b',
  '99041540-550a-416d-9749-59195424734b',
]
const [TENANT_ID_1, TENANT_ID_2, TENANT_ID_3] = [
  '1d6674c7-4966-49a0-a269-4c46a44cc276',
  '7119b956-a0c0-4683-a2ad-69943139a8f5',
  '57317882-659e-4757-824e-7149055e483f',
]

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://pointflow_user@localhost:26257/pf_loyalty?sslmode=disable'
const client = postgres(connectionString)
const db = drizzle(client)

async function seed() {
  const isNotificationDb = connectionString.includes('pf_notifications')
  console.log(`🌱 Seeding database: ${isNotificationDb ? 'NOTIFICATIONS' : 'LOYALTY'}...`)

  // 1. Delete old data (Careful: selective delete)
  if (isNotificationDb) {
    await db.delete(users)
  } else {
    await db.delete(visits)
    await db.delete(loyaltyCards)
    await db.delete(users)
    await db.delete(tenants)
    await db.delete(loyaltySettings)
  }

  // 2. Insert USERS (Common for both)
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

  // 3. Loyalty Specific Data
  if (!isNotificationDb) {
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
          pointsBalance: 100,
        },
        {
          userId: USER_ID_2,
          code: generateLoyaltyCardCode(TENANT_ID_2),
          tenantId: TENANT_ID_2,
          tier: CardTier.BRONZE,
          pointsBalance: 200,
        },
        {
          userId: USER_ID_3,
          code: generateLoyaltyCardCode(TENANT_ID_3),
          tenantId: TENANT_ID_3,
          tier: CardTier.BRONZE,
          pointsBalance: 300,
        },
      ])
      .returning({ id: loyaltyCards.id, code: loyaltyCards.code })

    const [card1, card2, card3] = insertedCards

    if (card1 && card2 && card3) {
      await db.insert(visits).values([
        {
          userId: USER_ID_1,
          tenantId: TENANT_ID_1,
          cardId: card1.id,
          cardCode: card1.code,
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
          cardCode: card2.code,
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
          cardCode: card3.code,
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
    }
  }

  console.log(`✅ ${isNotificationDb ? 'NOTIFICATIONS' : 'LOYALTY'} seeding finished!`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed!')
  console.error(err)
  process.exit(1)
})
