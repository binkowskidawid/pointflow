import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { KAFKA_TOPICS, PointsAwardedEvent, UserCreatedEvent } from '@pointflow/contracts'
import { MailerService } from '@nestjs-modules/mailer'
import { getPointsAwardedEmailHtml, getWelcomeEmailHtml } from '../mails'
import { UsersRepository } from '../users/users.repository'

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name)

  constructor(
    private readonly mailerService: MailerService,
    private readonly usersRepository: UsersRepository,
  ) {}

  @EventPattern(KAFKA_TOPICS.POINTS_AWARDED)
  async handlePointsAwarded(@Payload() data: PointsAwardedEvent) {
    const user = await this.usersRepository.findById(data.userId)

    if (!user || !user.email) {
      this.logger.warn(`User ${data.userId} not found yet. Retrying via Kafka mechanism...`)
      throw new Error(`User ${data.userId} not found for notification`)
    }

    this.mailerService
      .sendMail({
        to: user.email,
        subject: '🎉 New points on your account!',
        html: getPointsAwardedEmailHtml(data),
      })
      .then(() => {
        this.logger.log(`PointsAwarded email sent to ${user.email}`)
      })
      .catch((err) => this.logger.error(`Error sending email to ${user.email}:`, err))
  }

  @EventPattern(KAFKA_TOPICS.USER_CREATED)
  async handleUserCreated(@Payload() data: UserCreatedEvent) {
    this.logger.log(`Handling USER_CREATED for: ${data.email} (ID: ${data.id})`)

    const user = await this.usersRepository.upsert({
      id: data.id,
      email: data.email,
      name: data.name,
      phoneNumber: data.phoneNumber,
    })

    if (!user || !user.email) {
      this.logger.error(`Failed to persist user ${data.id} or email missing.`)
      return
    }

    this.mailerService
      .sendMail({
        to: user.email,
        subject: '🎉 Welcome to PointFlow!',
        html: getWelcomeEmailHtml(data),
      })
      .then(() => {
        this.logger.log(`Welcome email sent to ${user.email}`)
      })
      .catch((err) => this.logger.error(`Error sending email to ${user.email}:`, err))
  }
}
