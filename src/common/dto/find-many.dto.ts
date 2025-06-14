// common/dto/find-many.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export function createFindManyDto<TModel extends new (...args: any) => any>(
  model: TModel,
) {
  class FindManyDto {
    @ApiProperty({
      example: 1,
      description: 'Total count of items',
    })
    count: number;

    @ApiProperty({
      type: () => [model],
      description: 'List of items',
    })
    items: InstanceType<TModel>[];
  }

  return FindManyDto;
}
