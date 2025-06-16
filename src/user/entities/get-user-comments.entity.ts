import { createFindManyDto } from '@/common/dto/find-many.dto';
import { CommentPostEntity } from '@/post/entities/comment-post.entity';

//GetReplies
export class GetUserCommentsEntity extends createFindManyDto(
  CommentPostEntity,
) {}
