import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { User } from '../../enterprise/entities/user';

export type EmailOrUsernameParams = {
  email: string;
  username: string;
};

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;

  abstract findById(id: UniqueEntityId): Promise<User | null>;
  abstract findByLogin(login: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findByEmailOrUsername(data: EmailOrUsernameParams): Promise<User | null>;
}
