import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator'
import { Currency } from '../enums'

export class CreateVisitDto {
  @IsUUID()
  @IsOptional()
  cardId?: string

  @IsUUID()
  @IsOptional()
  userId?: string

  @IsUUID()
  @IsNotEmpty()
  tenantId!: string

  @IsString()
  @IsNotEmpty({ message: 'Identifier (email, phone or code) is required' })
  identifier!: string

  @IsNumber()
  @Min(0)
  receiptAmount!: number

  @IsEnum(Currency)
  receiptCurrency!: Currency
}
