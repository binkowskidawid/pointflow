export const KAFKA_TOPICS = {
  VISIT_REGISTERED: 'visit.registered',
  POINTS_AWARDED: 'points.awarded',
  TIER_CHANGED: 'tier.changed',
  NOTIFICATION_REQUESTED: 'notification.requested',
  CARD_CREATED: 'card.created',
} as const

export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS]
