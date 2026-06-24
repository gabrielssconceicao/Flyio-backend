import { Either, left, right } from '@/core/either/either';
import { NotFoundError } from '@/core/errors/not-found-error';
import { ValidationError } from '@/core/errors/validation-error';

import { User } from '../../enterprise/entities/user';
import { Username } from '../../enterprise/value-obj/username';
import { UserFinder } from '../service/user-finder';

type GetUserByUsernameRequest = {
  username: string;
};

type GetUserByUsernameResponse = Either<NotFoundError | ValidationError, User>;

export class GetUserByUsernameUseCase {
  constructor(private readonly userFinder: UserFinder) {}

  async handle({ username }: GetUserByUsernameRequest): Promise<GetUserByUsernameResponse> {
    const usernameOrError = Username.create(username);

    if (usernameOrError.isLeft()) {
      return left(usernameOrError.value);
    }
    const userOrError = await this.userFinder.findByUsername(usernameOrError.value);
    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    return right(userOrError.value);
  }
}
