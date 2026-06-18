import { Either, left, right } from '@/core/either/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { User } from '../../enterprise/entities/user';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { EmailOrUsernameParams, UsersRepository } from '../repository/users-repository';

export class UserFinder {
  constructor(private readonly usersRepository: UsersRepository) {}
  async findById(id: UniqueEntityId): Promise<Either<UserNotFoundError, User>> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return left(new UserNotFoundError());
    }

    return right(user);
  }

  async existsByUsernameOrEmail(data: EmailOrUsernameParams): Promise<boolean> {
    const user = await this.usersRepository.findByEmailOrUsername(data);
    return !!user;
  }
}
