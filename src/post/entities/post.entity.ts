import { ApiProperty } from '@nestjs/swagger';

class Author {
  @ApiProperty({
    example: 'John Doe',
    description: 'Author name',
  })
  name: string;
  @ApiProperty({
    example: 'johndoe',
    description: 'Author username',
  })
  username: string;
  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'Author profile image URL',
    nullable: true,
  })
  profileImg: string | null;
}

class Image {
  @ApiProperty({
    example: 'id-10',
    description: 'Image id',
  })
  id: string;
  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Image URL',
  })
  url: string;
}

export class PostEntity {
  @ApiProperty({
    example: 'id-1',
    description: 'Post ID',
  })
  id: string;
  @ApiProperty({
    example: 'This is a post',
    description: 'Post text content',
  })
  text: string;
  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Post creation date',
  })
  createdAt: Date;

  @ApiProperty({ type: Author, description: 'Post author' })
  author: Author;

  @ApiProperty({ type: [Image], description: 'Post images' })
  images: Image[];
}
