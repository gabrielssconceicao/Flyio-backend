import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Post, PostProps } from '@/domain/social/enterprise/entities/post';
export function makePost(
  override: Partial<PostProps> = {},
  id?: UniqueEntityId,
) {
  const newPost = Post.create(
    {
      author_id: new UniqueEntityId(),
      content: faker.lorem.sentence(),
      created_at: new Date(),
      tags: [],
      ...override,
    },
    id,
  );

  return newPost;
}
