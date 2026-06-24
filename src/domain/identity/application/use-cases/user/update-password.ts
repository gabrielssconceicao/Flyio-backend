import { Either, left, right } from '@/core/either/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { ValidationError } from '@/core/errors/validation-error';

import { Password } from '../../../enterprise/value-obj/password';
import { HashComparer } from '../../cryptography/comparer';
import { HashGenerator } from '../../cryptography/hasher';
import { InvalidCredentialsError } from '../../errors/invalid-credentials-error';
import { UserNotFoundError } from '../../errors/user-not-found-error';
import { UsersRepository } from '../../repository/users-repository';

export type UpdatePasswordRequest = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};

type UpdatePasswordResponse = Either<UserNotFoundError | ValidationError | UnauthorizedError, void>;

export class UpdatePasswordUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hasher: HashGenerator,
    private readonly comparer: HashComparer,
  ) {}

  async handle({ userId, currentPassword, newPassword }: UpdatePasswordRequest): Promise<UpdatePasswordResponse> {
    const user = await this.usersRepository.findById(UniqueEntityId.createFromText(userId));
    if (!user) {
      return left(new UserNotFoundError());
    }

    const isPasswordValid = await this.comparer.compare(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError());
    }

    const passwordOrError = Password.create(newPassword);

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const hashedPassword = await this.hasher.hash(passwordOrError.value.value);

    user.passwordHash = hashedPassword;

    await this.usersRepository.save(user);

    return right(undefined);
  }
}
