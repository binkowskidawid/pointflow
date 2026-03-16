import { execSync } from 'child_process'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

const services = [
  { name: 'loyalty-engine', path: 'services/loyalty-engine' },
  { name: 'notification-service', path: 'services/notification-service' },
]

async function runSeeds() {
  console.log('🚀 Starting global seeding process...\n')

  for (const service of services) {
    const envPath = path.join(process.cwd(), service.path, '.env')

    if (!fs.existsSync(envPath)) {
      console.warn(`⚠️ Skipping ${service.name}: No .env file found at ${envPath}`)
      continue
    }

    console.log(`🌱 Seeding database for: ${service.name}...`)

    try {
      // Load env specifically for this execution
      const envConfig = dotenv.parse(fs.readFileSync(envPath))
      const databaseUrl = envConfig['DATABASE_URL']

      if (!databaseUrl) {
        throw new Error(`DATABASE_URL not found in ${envPath}`)
      }

      // Execute seed from drizzle-schemas package with the specific database URL
      execSync('pnpm --filter @pointflow/drizzle-schemas db:seed', {
        env: { ...process.env, DATABASE_URL: databaseUrl },
        stdio: 'inherit',
      })

      console.log(`✅ ${service.name} seeding finished.\n`)
    } catch (error) {
      console.error(
        `❌ Failed to seed ${service.name}:`,
        error instanceof Error ? error.message : error,
      )
      process.exit(1)
    }
  }

  console.log('🎉 All seeds completed successfully!')
}

runSeeds()
