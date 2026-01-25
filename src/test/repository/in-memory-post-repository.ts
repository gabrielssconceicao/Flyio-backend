import { PostRepository } from '@/domain/social/application/repository/post-repository';
import { Post } from '@/domain/social/enterprise/entities/post';

export class InMemoryPostRepository extends PostRepository {
  items: Post[] = [];

  create(post: Post): Promise<Post> {
    this.items.push(post);
    return Promise.resolve(post);
  }
}
