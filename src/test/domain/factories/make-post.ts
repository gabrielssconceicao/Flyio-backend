import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Post, PostProps } from '@/domain/social/enterprise/entity/post';

export function makePost(override: Partial<PostProps> = {}, id?: UniqueEntityId): Post {
  return Post.create(
    {
      ...override,
      content: faker.lorem.sentence({ min: 3, max: 10 }),
      authorId: new UniqueEntityId(),
      createdAt: new Date(),
      deletedAt: null,
      likesCount: faker.number.int(),
      commentsCount: faker.number.int(),
    },
    id,
  );
}
