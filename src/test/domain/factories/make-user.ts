import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User, UserProps } from '@/domain/identity/enterprise/entities/user';
import { Email } from '@/domain/identity/enterprise/value-obj/email';
import { Username } from '@/domain/identity/enterprise/value-obj/username';

export function makeUser(override: Partial<UserProps> = {}, id?: UniqueEntityId): User {
  return User.create(
    {
      name: faker.person.fullName(),
      bio: faker.lorem.sentence(),
      username: makeUsername(faker.internet.username()),
      email: makeEmail(faker.internet.email()),
      password_hash: faker.internet.password(),
      ...override,
    },
    id,
  );
}

export function makeUsername(string: string): Username {
  const username = Username.create(string);

  if (username.isRight()) {
    return username.value;
  }
}

export function makeEmail(string: string): Email {
  const email = Email.create(string);

  if (email.isRight()) {
    return email.value;
  }
}
