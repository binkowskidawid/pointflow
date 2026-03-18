import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator'
import { CardTier } from '../enums'

export class CreateLoyaltyCardDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string

  @IsUUID()
  @IsNotEmpty()
  tenantId!: string

  @IsInt()
  @Min(0)
  @IsOptional()
  pointsBalance?: number

  @IsString()
  @IsOptional()
  code?: string

  @IsEnum(CardTier)
  @IsOptional()
  tier?: CardTier

  @IsOptional()
  createdAt?: Date

  @IsOptional()
  updatedAt?: Date
}
