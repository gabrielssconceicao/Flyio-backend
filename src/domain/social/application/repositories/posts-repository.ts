import { Post } from '../../enterprise/entities/post';
import { User } from '../../enterprise/entities/user';

export interface PostWithAuthor {
  post: Post;
  author: User;
}

export abstract class PostsRepository {
  abstract create(post: Post): Promise<PostWithAuthor>;
}
