import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class BaseTransactionDto {
  //Transaction
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedAt?: Date;

  //BankAccount
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  beneficiaryBankAccountId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  remitterBankAccountId?: number;

  //Otp
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  otpId?: number;
}

//----- CREATE
export class CreateTransactionDto extends BaseTransactionDto {
  //BankAccount
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  beneficiaryBankNumber?: string;

  //BankAccount
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  remitterBankNumber?: string;
}
