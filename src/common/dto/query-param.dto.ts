import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';
import { IsOptional } from 'class-validator';

export class QueryParamDto extends PaginationDto {
  @ApiProperty({ name: 'search', type: String, required: true })
  @IsOptional()
  search?: string;
}
