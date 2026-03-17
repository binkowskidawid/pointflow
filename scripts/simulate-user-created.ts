import { Kafka } from 'kafkajs'
import { randomUUID } from 'crypto'
import { KAFKA_TOPICS } from '../packages/contracts/src/topics'
import * as bcrypt from 'bcrypt'

async function simulate() {
  const kafka = new Kafka({
    clientId: 'simulator',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  })

  const producer = kafka.producer()

  console.log('🔗 Connecting to Kafka...')
  await producer.connect()

  const userId = randomUUID()
  const email = `test-${userId.slice(0, 8)}@example.com`
  const hashedPassword = await bcrypt.hash('password123', 10)

  const event = {
    id: userId,
    email: email,
    name: 'Simulator Test User',
    phoneNumber: '+48123456666',
    tenantId: '1d6674c7-4966-49a0-a269-4c46a44cc276',
    role: 'CUSTOMER',
    passwordHash: hashedPassword,
    twoFactorSecret: null,
    twoFactorEnabled: false,
  }

  console.log(`📤 Emitting USER_CREATED event for: ${email}`)

  await producer.send({
    topic: KAFKA_TOPICS.USER_CREATED,
    messages: [
      {
        value: JSON.stringify(event),
      },
    ],
  })

  console.log('✅ Event sent successfully!')
  await producer.disconnect()
}

simulate().catch(console.error)
