import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class FindOneUserEntity extends OmitType(UserEntity, ['id']) {
  @ApiProperty({
    type: Date,
    example: '2000-01-01T00:00:00.000Z',
    description: 'User creation date',
  })
  createdAt: Date;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'User active status',
  })
  isActive: boolean;
}
