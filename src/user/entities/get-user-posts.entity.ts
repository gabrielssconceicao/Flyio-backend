import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from '@/post/entities';
import { createFindManyDto } from '@/common/dto/find-many.dto';
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

class UserPost extends PostEntity {
  @ApiProperty({
    type: PostAuthor,
    description: 'Parent author',
    nullable: true,
  })
  parent: PostAuthor | null;
}
export class GetUserPostsEntity extends createFindManyDto(UserPost) {}
