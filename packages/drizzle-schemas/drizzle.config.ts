import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/index.ts',
  out: './drizzle',
  dbCredentials: {
    url:
      process.env['DATABASE_URL'] ??
      'postgresql://pointflow_user@localhost:26257/pointflow?sslmode=disable',
  },
})
