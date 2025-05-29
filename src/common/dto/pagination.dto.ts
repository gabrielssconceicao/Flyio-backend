import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    name: 'limit',
    type: Number,
    required: false,
  })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    name: 'offset',
    type: Number,
    required: false,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
