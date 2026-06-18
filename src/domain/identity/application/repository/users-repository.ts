import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { User } from '../../enterprise/entities/user';
import { Email } from '../../enterprise/value-obj/email';
import { Username } from '../../enterprise/value-obj/username';

export type EmailOrUsernameParams = {
  email: Email;
  username: Username;
};

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;

  abstract findById(id: UniqueEntityId): Promise<User | null>;
  abstract findByEmailOrUsername(data: EmailOrUsernameParams): Promise<User | null>;
}
