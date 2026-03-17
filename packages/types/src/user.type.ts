import { UserRole } from '@pointflow/contracts'

export interface User {
  id: string
  email: string
  phoneNumber?: string
  name?: string
  tenantId: string
  role: UserRole
  passwordHash: string
  twoFactorSecret?: string
  twoFactorEnabled?: boolean
  createdAt?: Date
  updatedAt?: Date
}
