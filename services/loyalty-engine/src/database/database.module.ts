import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@pointflow/drizzle-schemas'

@Module({
  providers: [
    {
      provide: 'DB_CONNECTION',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const connectionString = config.get<string>('DATABASE_URL')
        if (!connectionString) {
          throw new Error('DATABASE_URL is not defined')
        }
        const client = postgres(connectionString)
        return drizzle(client, { schema })
      },
    },
  ],
  exports: ['DB_CONNECTION'],
})
export class DatabaseModule {}
