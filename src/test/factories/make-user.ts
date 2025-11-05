import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User, UserProps } from '@/domain/social/enterprise/entities/user';
export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {
  const newUser = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      username: faker.person.firstName(),
      password_hash: faker.internet.password(),
      followersCount: 0,
      followingCount: 0,
      deactivatedAt: null,
      ...override,
    },
    id,
  );

  return newUser;
}
