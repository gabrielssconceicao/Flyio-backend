import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User, UserProps } from '@/domain/social/enterprise/entities/user';
import { Email } from '@/domain/social/enterprise/value-obj/email';
import { Username } from '@/domain/social/enterprise/value-obj/username';

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {
  const newUser = User.create(
    {
      name: faker.person.fullName(),
      email: Email.create(faker.internet.email()),
      username: Username.create(faker.person.firstName()),
      password_hash: faker.internet.password(),
      ...override,
    },
    id,
  );

  return newUser;
}

export function makeEmail(email: string) {
  return Email.create(email);
}

export function makeUsername(username: string) {
  return Username.create(username);
}
