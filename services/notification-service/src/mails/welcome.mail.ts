import { UserCreatedEvent } from '@pointflow/contracts'

export const getWelcomeEmailHtml = (data: UserCreatedEvent) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; color: #1f2937;">
    <h2 style="color: #10b981;">Welcome to PointFlow! 🎉</h2>
    <p>Hi ${data.name || 'there'},</p>
    <p>We're excited to have you on board. You can now start earning points and rewards at your favorite locations.</p>
    <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
      <p style="margin: 5px 0;">Registered email: <strong>${data.email}</strong></p>
    </div>
    <p>See you soon!</p>
    <div style="font-size: 12px; color: #6b7280; border-top: 1px solid #eee; padding-top: 10px; margin-top: 20px;">
      <p style="margin: 2px 0;">This is an automated message from PointFlow.</p>
    </div>
  </div>
`
