import 'reflect-metadata'
import { Type } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator'

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string

  @IsNotEmpty()
  @IsString()
  password!: string

  @IsNotEmpty()
  @IsString()
  tenantId!: string
}

export class LoginUserDto {
  @IsString()
  id!: string

  @IsEmail()
  email!: string

  @IsString()
  role!: string

  @IsString()
  tenantId!: string

  @IsString()
  name!: string
}

export class LoginResponseDto {
  @IsString()
  accessToken!: string

  @IsString()
  refreshToken!: string

  @ValidateNested()
  @Type(() => LoginUserDto)
  user!: LoginUserDto
}
