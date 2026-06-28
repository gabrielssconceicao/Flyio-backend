import { PostsRepository } from '@/domain/social/application/repository/post-repository';
import { Post } from '@/domain/social/enterprise/entity/post';

export class InMemoryPostsRepository implements PostsRepository {
  items: Post[] = [];

  async create(post: Post): Promise<void> {
    this.items.push(post);
    return Promise.resolve();
  }
}
