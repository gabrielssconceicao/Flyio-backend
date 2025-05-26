import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({
    example: '1',
    description: 'User ID',
  })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
  name: string;

  @ApiProperty({ example: 'johndoe', description: 'Username of the user' })
  username: string;

  @ApiProperty({
    example: 'This is my bio',
    description: 'Biography of the user',
    nullable: true,
  })
  bio: string | null;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'User Profile image URL',
    nullable: true,
  })
  profileImg: string | null;
}
