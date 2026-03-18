import { PointsAwardedEvent } from '@pointflow/contracts'

export const getPointsAwardedEmailHtml = (data: PointsAwardedEvent) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; color: #1f2937;">
    <h2 style="color: #10b981;">Hello!</h2>
    <p>We've just registered your visit at our partner location.</p>
    <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
      <p style="margin: 5px 0;">Points earned: <strong style="color: #10b981;">+${data.pointsAwarded}</strong></p>
      <p style="margin: 5px 0;">Current balance: <strong>${data.totalPointsAfter} pts</strong></p>
    </div>
    <div style="font-size: 12px; color: #6b7280; border-top: 1px solid #eee; padding-top: 10px; margin-top: 20px;">
      <p style="margin: 2px 0;">Card: ${data.cardCode}</p>
      <p style="margin: 2px 0;">Visit ID: ${data.visitId}</p>
      <p style="margin: 2px 0;">Date: ${new Date(data.timestamp).toLocaleString()}</p>
    </div>
  </div>
`
