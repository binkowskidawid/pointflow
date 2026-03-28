import { Type } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator'

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  identifier!: string // email or phoneNumber

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  password!: string

  @IsNotEmpty()
  @IsUUID()
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
