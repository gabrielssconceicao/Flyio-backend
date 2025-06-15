import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from './post.entity';

export class FindOnePostEntity extends PostEntity {
  @ApiProperty({
    description: "Post's comments",
    type: [PostEntity],
  })
  comments: PostEntity[];
  @ApiProperty({
    description: "Post's parent",
    type: PostEntity,
    nullable: true,
  })
  parent: PostEntity | null;
}
