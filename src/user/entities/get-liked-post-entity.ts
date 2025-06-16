import { createFindManyDto } from '@/common/dto/find-many.dto';
import { CommentPostEntity } from '@/post/entities/comment-post.entity';

export class GetLikedPostEntity extends createFindManyDto(CommentPostEntity) {}
