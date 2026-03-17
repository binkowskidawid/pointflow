import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { KAFKA_TOPICS, UserCreatedEvent } from '@pointflow/contracts'
import { UsersRepository } from './users.repository'

@Controller()
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private readonly usersRepository: UsersRepository) {}

  @EventPattern(KAFKA_TOPICS.USER_CREATED)
  async handleUserCreated(@Payload() data: UserCreatedEvent) {
    this.logger.log(`Syncing user from Kafka: ${data.email} (${data.id})`)

    await this.usersRepository.upsert({
      id: data.id,
      email: data.email,
      name: data.name,
      phoneNumber: data.phoneNumber,
      tenantId: data.tenantId,
      role: data.role,
      passwordHash: data.passwordHash,
      twoFactorSecret: data.twoFactorSecret,
      twoFactorEnabled: data.twoFactorEnabled,
    })

    this.logger.log(`User ${data.email} synced in Loyalty Engine.`)
  }
}
