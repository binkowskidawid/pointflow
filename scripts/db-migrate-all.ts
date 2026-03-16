import { execSync } from 'child_process'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

const services = [
  { name: 'loyalty-engine', path: 'services/loyalty-engine' },
  { name: 'notification-service', path: 'services/notification-service' },
]

async function runMigrations() {
  console.log('🚀 Starting global migration process...\n')

  for (const service of services) {
    const envPath = path.join(process.cwd(), service.path, '.env')

    if (!fs.existsSync(envPath)) {
      console.warn(`⚠️ Skipping ${service.name}: No .env file found at ${envPath}`)
      continue
    }

    console.log(`📦 Migrating database for: ${service.name}...`)

    try {
      // Load env specifically for this execution
      const envConfig = dotenv.parse(fs.readFileSync(envPath))
      const databaseUrl = envConfig['DATABASE_URL']

      if (!databaseUrl) {
        throw new Error(`DATABASE_URL not found in ${envPath}`)
      }

      // Execute migration from drizzle-schemas package with the specific database URL
      execSync('pnpm --filter @pointflow/drizzle-schemas db:migrate', {
        env: { ...process.env, DATABASE_URL: databaseUrl },
        stdio: 'inherit',
      })

      console.log(`✅ ${service.name} migration finished.\n`)
    } catch (error) {
      console.error(
        `❌ Failed to migrate ${service.name}:`,
        error instanceof Error ? error.message : error,
      )
      process.exit(1)
    }
  }

  console.log('🎉 All migrations completed successfully!')
}

runMigrations()
