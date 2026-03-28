export interface Customer {
  id: string
  tenantId: string
  name: string
  phoneNumber: string
  email?: string | null
  createdAt?: Date
  updatedAt?: Date
}
