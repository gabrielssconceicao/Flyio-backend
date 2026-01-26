import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PostRepository } from '@/domain/social/application/repository/post-repository';
import { Post } from '@/domain/social/enterprise/entities/post';

export class InMemoryPostRepository extends PostRepository {
  items: Post[] = [];

  create(post: Post): Promise<Post> {
    this.items.push(post);
    return Promise.resolve(post);
  }

  delete(post: Post): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(post.id));
    this.items.splice(index, 1);
    return Promise.resolve();
  }

  findById(id: UniqueEntityId): Promise<Post | null> {
    const post = this.items.find((item) => item.id.equals(id));

    if (!post) {
      return Promise.resolve(null);
    }

    return Promise.resolve(post);
  }
}
