import { Post } from '../../enterprise/entity/post';

export abstract class PostsRepository {
  abstract create(post: Post): Promise<void>;
}
