import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator'
import { UserRole } from '../enums/user-role.enum'

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

  @IsUUID()
  @IsOptional()
  id?: string

  @IsPhoneNumber(undefined, { message: 'Wrong phone number format' })
  @IsOptional()
  phoneNumber?: string | null

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole

  @IsString()
  @IsOptional()
  twoFactorSecret?: string | null

  @IsOptional()
  twoFactorEnabled?: boolean

  @IsOptional()
  createdAt?: Date

  @IsOptional()
  updatedAt?: Date
}
