import { Either, left, right } from '@/core/either/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { User } from '../../enterprise/entities/user';
import { Username } from '../../enterprise/value-obj/username';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UsersRepository } from '../repository/users-repository';

export class UserFinder {
  constructor(private readonly usersRepository: UsersRepository) {}
  async findById(id: UniqueEntityId): Promise<Either<UserNotFoundError, User>> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return left(new UserNotFoundError());
    }

    return right(user);
  }

  async findByUsername(username: Username): Promise<Either<UserNotFoundError, User>> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      return left(new UserNotFoundError());
    }

    return right(user);
  }
}
