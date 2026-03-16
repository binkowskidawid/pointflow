import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { KAFKA_TOPICS, PointsAwardedEvent } from '@pointflow/contracts'
import { MailerService } from '@nestjs-modules/mailer'
import { getPointsAwardedEmailHtml } from '../mails'
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
      this.logger.warn(`User ${data.userId} not found in notification database. Skipping email.`)
      return
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
}
