import 'reflect-metadata'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { loyaltyCards, visits, users, tenants, loyaltySettings, customers } from './index'
import { CardTier, UserRole } from '@pointflow/contracts'
import { randomUUID } from 'crypto'
import { generateLoyaltyCardCode } from '@pointflow/utils'
import * as bcrypt from 'bcrypt'

// ─── Fixed IDs for reproducible local dev ────────────────────────────────────

const TENANT_ID_1 = '1d6674c7-4966-49a0-a269-4c46a44cc276'
const TENANT_ID_2 = '7119b956-a0c0-4683-a2ad-69943139a8f5'

// Staff: one OWNER + one RECEPTIONIST per tenant
const OWNER_ID_T1 = '22d3723e-301e-4643-9aec-e052e4178b71'
const RECEPTIONIST_ID_T1 = '1f45882d-7b11-403c-92b2-3c19e117d79c'
const OWNER_ID_T2 = '0817ced3-a1f4-4027-a032-7eb1c5dc18ec'

// Customers (separate from staff)
const CUSTOMER_ID_1 = 'da377163-6356-48c3-a52a-134621e5d854'
const CUSTOMER_ID_2 = 'e769010f-b953-4046-8ca4-07148db3fa30'
const CUSTOMER_ID_3 = '6825cfe2-3d69-4b1b-a4d3-056948941e40'

// ─── DB connection ────────────────────────────────────────────────────────────

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://pointflow_user@localhost:26257/pf_loyalty?sslmode=disable'
const client = postgres(connectionString)
const db = drizzle(client)

// ─── Customer data (shared between loyalty and notifications DBs) ─────────────

const CUSTOMER_ROWS = [
  {
    id: CUSTOMER_ID_1,
    tenantId: TENANT_ID_1,
    name: 'Piotr Pacjent',
    phoneNumber: '781781781',
    email: 'piotr@example.com',
  },
  {
    id: CUSTOMER_ID_2,
    tenantId: TENANT_ID_1,
    name: 'Monika Klientka',
    phoneNumber: '782782782',
    email: 'monika@example.com',
  },
  {
    id: CUSTOMER_ID_3,
    tenantId: TENANT_ID_2,
    name: 'Krzysztof Klient',
    phoneNumber: '783783783',
    email: 'krzysiek@example.com',
  },
]

// ─── Seed ────────────────────────────────────────────────────────────────────

async function seed() {
  const isAuthDb = connectionString.includes('pf_auth')
  const isNotificationDb = connectionString.includes('pf_notifications')
  const dbType = isAuthDb ? 'AUTH' : isNotificationDb ? 'NOTIFICATIONS' : 'LOYALTY'

  console.log(`🌱 Seeding database: ${dbType}...`)

  // Delete in dependency order (visits → cards → customers → users → tenants)
  if (isNotificationDb) {
    await db.delete(customers)
    await db.delete(users)
    await db.delete(tenants)
  } else if (!isAuthDb) {
    await db.delete(visits)
    await db.delete(loyaltyCards)
    await db.delete(customers)
    await db.delete(loyaltySettings)
    await db.delete(users)
    await db.delete(tenants)
  } else {
    await db.delete(users)
    await db.delete(tenants)
  }

  // ── Tenants ──────────────────────────────────────────────────────────────
  await db.insert(tenants).values([
    { id: TENANT_ID_1, name: 'Dakar Clinic', slug: 'dakar-clinic' },
    { id: TENANT_ID_2, name: 'Coffee Hub', slug: 'coffee-hub' },
  ])

  const hashedPassword = await bcrypt.hash('password123', 10)

  // ── Staff users (no CUSTOMER role here) ──────────────────────────────────
  await db.insert(users).values([
    {
      id: OWNER_ID_T1,
      email: 'owner@dakar-clinic.com',
      phoneNumber: '100000001',
      name: 'Anna Owner',
      passwordHash: hashedPassword,
      tenantId: TENANT_ID_1,
      role: UserRole.OWNER,
    },
    {
      id: RECEPTIONIST_ID_T1,
      email: 'reception@dakar-clinic.com',
      phoneNumber: '100000002',
      name: 'Jan Kowalski',
      passwordHash: hashedPassword,
      tenantId: TENANT_ID_1,
      role: UserRole.RECEPTIONIST,
    },
    {
      id: OWNER_ID_T2,
      email: 'owner@coffeehub.com',
      phoneNumber: '200000001',
      name: 'Maria Owner',
      passwordHash: hashedPassword,
      tenantId: TENANT_ID_2,
      role: UserRole.OWNER,
    },
  ])

  if (isAuthDb) {
    console.log(`✅ ${dbType} seeding finished!`)
    return
  }

  // ── Customers (loyalty program members — needed in both loyalty and notifications) ──
  await db.insert(customers).values(CUSTOMER_ROWS)

  if (isNotificationDb) {
    console.log(`✅ ${dbType} seeding finished!`)
    return
  }

  // ── Loyalty settings ──────────────────────────────────────────────────────
  await db.insert(loyaltySettings).values([
    { tenantId: TENANT_ID_1, amountPerPoint: 1000 }, // 10 PLN = 1 pkt
    { tenantId: TENANT_ID_2, amountPerPoint: 500 }, // 5 PLN = 1 pkt
  ])

  // ── Loyalty cards ─────────────────────────────────────────────────────────
  const insertedCards = await db
    .insert(loyaltyCards)
    .values([
      {
        customerId: CUSTOMER_ID_1,
        code: generateLoyaltyCardCode(TENANT_ID_1),
        tenantId: TENANT_ID_1,
        tier: CardTier.BRONZE,
        pointsBalance: 150,
      },
      {
        customerId: CUSTOMER_ID_2,
        code: generateLoyaltyCardCode(TENANT_ID_1),
        tenantId: TENANT_ID_1,
        tier: CardTier.BRONZE,
        pointsBalance: 80,
      },
      {
        customerId: CUSTOMER_ID_3,
        code: generateLoyaltyCardCode(TENANT_ID_2),
        tenantId: TENANT_ID_2,
        tier: CardTier.BRONZE,
        pointsBalance: 320,
      },
    ])
    .returning({ id: loyaltyCards.id, code: loyaltyCards.code })

  const [card1, card2, card3] = insertedCards

  if (card1 && card2 && card3) {
    await db.insert(visits).values([
      {
        customerId: CUSTOMER_ID_1,
        tenantId: TENANT_ID_1,
        registeredByUserId: OWNER_ID_T1,
        cardId: card1.id,
        cardCode: card1.code,
        amountSpent: 15000,
        currency: 'PLN',
        pointsEarned: 150,
        appliedRuleSnapshot: {
          promotionId: randomUUID(),
          name: 'Standard Welcome Pts',
          multiplier: 1,
        },
        occurredAt: new Date(),
      },
      {
        customerId: CUSTOMER_ID_2,
        tenantId: TENANT_ID_1,
        registeredByUserId: RECEPTIONIST_ID_T1,
        cardId: card2.id,
        cardCode: card2.code,
        amountSpent: 8000,
        currency: 'PLN',
        pointsEarned: 80,
        appliedRuleSnapshot: {
          promotionId: randomUUID(),
          name: 'Standard Welcome Pts',
          multiplier: 1,
        },
        occurredAt: new Date(),
      },
      {
        customerId: CUSTOMER_ID_3,
        tenantId: TENANT_ID_2,
        registeredByUserId: OWNER_ID_T2,
        cardId: card3.id,
        cardCode: card3.code,
        amountSpent: 32000,
        currency: 'PLN',
        pointsEarned: 320,
        appliedRuleSnapshot: {
          promotionId: randomUUID(),
          name: 'Standard Welcome Pts',
          multiplier: 1,
        },
        occurredAt: new Date(),
      },
    ])
  }

  console.log(`✅ ${dbType} seeding finished!`)
  console.log(`
📋 Login credentials (all passwords: password123):
   OWNER    tenant 1 → owner@dakar-clinic.com
   RECEPT.  tenant 1 → reception@dakar-clinic.com
   OWNER    tenant 2 → owner@coffeehub.com
   Tenant 1 ID: ${TENANT_ID_1}
  `)
}

seed()
  .catch((err) => {
    console.error('❌ Seeding failed!')
    console.error(err)
    process.exit(1)
  })
  .then(() => process.exit(0))
