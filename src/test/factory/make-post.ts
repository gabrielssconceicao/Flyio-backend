import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Post, PostProps } from '@/domain/social/enterprise/entities/post';

export function makePost(
  overrides: Partial<PostProps> = {},
  id?: UniqueEntityId,
) {
  const post = Post.create(
    {
      content: faker.lorem.paragraph(),
      author_id: new UniqueEntityId(),
      ...overrides,
    },
    id,
  );

  return post;
}
