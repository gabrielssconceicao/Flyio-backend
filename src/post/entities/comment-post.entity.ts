import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from './post.entity';

class Username {
  @ApiProperty({
    type: String,
    example: 'John Doe',
    description: 'Author name',
  })
  username: string;
}
class Author {
  @ApiProperty({
    type: Username,
    example: 'johndoe',
    description: 'Author username',
  })
  author: Username;
}
export class CommentPostEntity extends PostEntity {
  @ApiProperty({ type: Author, description: 'Comment author' })
  parent: Author | null;
}
