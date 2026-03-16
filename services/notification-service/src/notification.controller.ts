import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { KAFKA_TOPICS, PointsAwardedEvent } from '@pointflow/contracts'
import { MailerService } from '@nestjs-modules/mailer'
import { getPointsAwardedEmailHtml } from './mails'

@Controller()
export class NotificationsController {
  constructor(private readonly mailerService: MailerService) {}

  @EventPattern(KAFKA_TOPICS.POINTS_AWARDED)
  async handlePointsAwarded(@Payload() data: PointsAwardedEvent) {
    this.mailerService
      .sendMail({
        to: process.env.DEMO_EMAIL,
        subject: '🎉 New points on your account!',
        html: getPointsAwardedEmailHtml(data),
      })
      .catch((err) => console.error('Error sending email:', err))
  }
}
