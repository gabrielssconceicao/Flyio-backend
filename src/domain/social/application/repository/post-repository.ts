import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { Post } from '../../enterprise/entities/post';

export abstract class PostRepository {
  abstract create(post: Post): Promise<Post>;
  abstract delete(post: Post): Promise<void>;

  abstract findById(id: UniqueEntityId): Promise<Post | null>;
}
