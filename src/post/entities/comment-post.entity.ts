import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from './post.entity';

class Username {
  @ApiProperty({
    type: String,
    example: 'jdoe',
    description: 'Author name',
  })
  username: string;
}
export class PostAuthor {
  @ApiProperty({
    type: Username,
    description: 'Author username',
  })
  author: Username;
}
export class CommentPostEntity extends PostEntity {
  @ApiProperty({
    type: PostAuthor,
    description: 'Comment author',
    nullable: true,
  })
  parent: PostAuthor | null;
}
