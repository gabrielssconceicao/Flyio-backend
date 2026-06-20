import { Either, left, right } from '@/core/either/either';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

import { Comparer, HashComparer } from '../cryptography/comparer';
import { UsersRepository } from '../repository/users-repository';

type LoginRequest = {
  login: string;
  password: string;
};

type LoginResponse = Either<UnauthorizedError, null>;

export class LoginUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly comparer: HashComparer,
  ) {}

  async handle({ login, password }: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findByLogin({ login });

    if (!user) {
      return left(new UnauthorizedError());
    }

    // compare password

    if (!(await this.comparer.compare(password, user.password_hash))) {
      return left(new UnauthorizedError());
    }

    // generate token, refresh token
    // save refresh token

    // return token, refresh token bg id

    return right(null);
  }
}
