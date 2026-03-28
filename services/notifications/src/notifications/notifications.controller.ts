import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { KAFKA_TOPICS, PointsAwardedEvent, UserCreatedEvent } from '@pointflow/contracts'
import { MailerService } from '@nestjs-modules/mailer'
import { getPointsAwardedEmailHtml, getWelcomeEmailHtml } from '../mails'
import { UsersRepository } from '../users/users.repository'
import { CustomersRepository } from '../customers/customers.repository'

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name)

  constructor(
    private readonly mailerService: MailerService,
    private readonly usersRepository: UsersRepository,
    private readonly customersRepository: CustomersRepository,
  ) {}

  @EventPattern(KAFKA_TOPICS.POINTS_AWARDED)
  async handlePointsAwarded(@Payload() data: PointsAwardedEvent) {
    const customer = await this.customersRepository.findById(data.customerId)

    if (!customer?.email) {
      this.logger.warn(
        `Customer ${data.customerId} has no email address. Skipping points awarded notification.`,
      )
      return
    }

    this.mailerService
      .sendMail({
        to: customer.email,
        subject: '🎉 New points on your account!',
        html: getPointsAwardedEmailHtml(data),
      })
      .then(() => {
        this.logger.log(`PointsAwarded email sent to ${customer.email}`)
      })
      .catch((err) => this.logger.error(`Error sending email to ${customer.email}:`, err))
  }

  @EventPattern(KAFKA_TOPICS.USER_CREATED)
  async handleUserCreated(@Payload() data: UserCreatedEvent) {
    this.logger.log(`Handling USER_CREATED for: ${data.email} (ID: ${data.id})`)

    const user = await this.usersRepository.upsert({
      id: data.id,
      email: data.email,
      name: data.name,
      phoneNumber: data.phoneNumber,
      tenantId: data.tenantId,
      role: data.role,
      passwordHash: data.passwordHash,
      twoFactorSecret: data.twoFactorSecret,
      twoFactorEnabled: data.twoFactorEnabled,
      updatedAt: new Date(),
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
