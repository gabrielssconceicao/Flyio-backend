import { Post } from '../../enterprise/entities/post';
import { User } from '../../enterprise/entities/user';

export interface FetchPostDTO {
  post: Post;
  author: User;
  isLiked: boolean;
}
