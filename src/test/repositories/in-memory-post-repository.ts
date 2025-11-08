import { PostsRepository } from '@/domain/social/application/repositories/posts-repository';
import { Post } from '@/domain/social/enterprise/entities/post';

export class InMemoryPostRepository extends PostsRepository {
  items: any[] = [];

  async create(post: Post) {
    this.items.push(post);
    return post;
  }
}
