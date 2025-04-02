import { ApiProperty } from '@dataui/crud/lib/crud';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class SortDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  field: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  order: string = 'ASC';
}
