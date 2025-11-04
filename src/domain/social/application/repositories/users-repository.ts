import { PaginationParams } from '@/core/repositories/pagination-params';

import { User } from '../../enterprise/entities/user';

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;

  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByNameOrUsername(
    query: string,
    params: PaginationParams,
  ): Promise<User[]>;
}
