import { UserEntity } from '@/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserEntity extends UserEntity {
  @ApiProperty({
    description: 'User creation date',
    type: Date,
    example: '2000-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
