import { Kafka } from 'kafkajs'
import { randomUUID } from 'crypto'
import { KAFKA_TOPICS } from '../packages/contracts/src/topics'

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

  const event = {
    id: userId,
    email: email,
    name: 'Simulator Test User',
    phoneNumber: '+48123456666',
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
