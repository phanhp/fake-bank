import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortDto } from 'src/utils/dto/app.dto';

//----- BASE
export class BaseBankAccountDto {
  //BankAccount
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  userName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  bankNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  balance?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Object)
  custom: any;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;

  //Transaction
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  depositTransactionIds: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  withdrawTransactionIds: number[];
}

//----- CREATE
export class CreateBankAccountDto extends BaseBankAccountDto {}

//----- READ
export class SearchBankAccountDto {
  //BankAccount
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number | number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  userName?: string | string[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  bankNumber?: string | string[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  gteBalance?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lteBalance?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  eqBalance?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  currency?: string;

  //Transaction
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  depositTransactionIds: number | number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  withdrawTransactionIds: number | number[];

  //Otp
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  withdrawTransactionOtpIds: number | number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  depositTransactionOtpIds: number | number[];

  //Pagination and Sort
  @ApiPropertyOptional({
    type: [String],
    default: [
      {
        field: 'example',
        order: 'ASC',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  sortOptions?: string[] | string | SortDto[] | SortDto;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  count?: number;
}
