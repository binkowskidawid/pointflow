import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const connectionString =
  process.env['DATABASE_URL'] ??
  'postgresql://pointflow_user@localhost:26257/pointflow?sslmode=disable'

const runMigration = async () => {
  console.log('⏳ Running Drizzle migrations...')
  const sql = postgres(connectionString, { max: 1 })
  const db = drizzle(sql)

  try {
    await migrate(db, { migrationsFolder: './drizzle' })
    console.log('✅ Migrations completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

runMigration()
