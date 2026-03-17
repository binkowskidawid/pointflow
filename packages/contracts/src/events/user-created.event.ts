import { UserRole } from '../enums'

export interface UserCreatedEvent {
  id: string
  email: string
  name: string
  phoneNumber?: string
  tenantId: string
  role: UserRole
  passwordHash: string
  twoFactorSecret?: string
  twoFactorEnabled?: boolean
}
