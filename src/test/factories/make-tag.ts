import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Tag, TagProps } from '@/domain/social/enterprise/entities/tag';
export function makeTag(override: Partial<TagProps> = {}, id?: UniqueEntityId) {
  const newTag = Tag.create(
    {
      name: faker.lorem.word(),
      ...override,
    },
    id,
  );

  return newTag;
}
