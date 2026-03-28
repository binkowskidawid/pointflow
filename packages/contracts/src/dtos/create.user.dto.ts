import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MinLength,
} from 'class-validator'
import { UserRole } from '../enums/user-role.enum'

// Roles that staff accounts can be assigned — CUSTOMER/SYSTEM_ADMIN are excluded
export const ASSIGNABLE_STAFF_ROLES = [
  UserRole.RECEPTIONIST,
  UserRole.MANAGER,
  UserRole.OWNER,
] as const

export type AssignableStaffRole = (typeof ASSIGNABLE_STAFF_ROLES)[number]

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string

  @IsUUID()
  @IsNotEmpty()
  tenantId!: string

  @IsEmail({}, { message: 'Wrong email format' })
  email!: string

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string

  @IsNumberString({}, { message: 'Phone number must contain only digits' })
  @Length(9, 9, { message: 'Phone number must be exactly 9 digits' })
  @IsOptional()
  phoneNumber?: string | null

  // When omitted the service defaults to RECEPTIONIST
  @IsIn(ASSIGNABLE_STAFF_ROLES, { message: 'Role must be one of: RECEPTIONIST, MANAGER, OWNER' })
  @IsOptional()
  role?: AssignableStaffRole
}
