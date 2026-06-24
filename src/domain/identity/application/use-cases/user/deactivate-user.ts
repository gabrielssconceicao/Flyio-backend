import { Either, left, right } from '@/core/either/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotFoundError } from '@/core/errors/not-found-error';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

import { HashComparer } from '../../cryptography/comparer';
import { InvalidCredentialsError } from '../../errors/invalid-credentials-error';
import { UserNotFoundError } from '../../errors/user-not-found-error';
import { UsersRepository } from '../../repository/users-repository';

type DeactiveUserRequest = {
  userId: string;
  password: string;
};

type DeactiveUserResponse = Either<NotFoundError | UnauthorizedError, void>;

export class DeactivateUser {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: HashComparer,
  ) {}

  async handle({ userId, password }: DeactiveUserRequest): Promise<DeactiveUserResponse> {
    const user = await this.usersRepository.findById(UniqueEntityId.createFromText(userId));

    if (!user) {
      return left(new UserNotFoundError());
    }

    const isPasswordValid = await this.hasher.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError());
    }

    user.deactivate();

    await this.usersRepository.save(user);

    return right(undefined);
  }
}
