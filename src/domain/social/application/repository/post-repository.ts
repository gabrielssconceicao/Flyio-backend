import { Post } from '../../enterprise/entities/post';

export abstract class PostRepository {
  abstract create(post: Post): Promise<Post>;
}
