import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { UsersRepository } from './users.repository'
import { UsersController } from './users.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
