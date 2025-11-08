import { Post } from '../../enterprise/entities/post';

export abstract class PostsRepository {
  abstract create(post: Post): Promise<Post>;
}
