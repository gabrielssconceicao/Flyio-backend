import { PaginationParams } from '@/core/repository/pagination-params';

import { User } from '../../enterprise/entities/user';

export abstract class UserRepository {
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;

  abstract findByEmailOrUsername(data: {
    email: string;
    username: string;
  }): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;

  abstract fetch(search: string, pagination: PaginationParams): Promise<User[]>;
  abstract findManyByIds(
    ids: string[],
  ): Promise<Array<{ user: User; following: boolean }>>;
}
