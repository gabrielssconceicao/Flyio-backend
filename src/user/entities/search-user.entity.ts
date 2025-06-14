import { createFindManyDto } from '@/common/dto/find-many.dto';
import { ApiProperty } from '@nestjs/swagger';

class User {
  @ApiProperty({
    type: String,
    example: 'johndoe',
    description: 'User username',
  })
  username: string;
  @ApiProperty({ type: String, example: 'John Doe', description: 'User name' })
  name: string;
  @ApiProperty({
    type: String,
    example: 'https://example.com/profile.jpg',
    description: 'User profile image URL',
    nullable: true,
  })
  profileImg: string | null;
}
export class SearchUserEntity extends createFindManyDto(User) {}
