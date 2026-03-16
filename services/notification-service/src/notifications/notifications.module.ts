import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { NotificationsController } from './notifications.controller'
import { UsersRepository } from '../users/users.repository'

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [UsersRepository],
})
export class NotificationsModule {}
