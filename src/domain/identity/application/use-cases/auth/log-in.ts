import { Either, left, right } from '@/core/either/either';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

import { RefreshToken } from '../../../enterprise/entities/refresh-token';
import { HashComparer } from '../../cryptography/comparer';
import { InvalidCredentialsError } from '../../errors/invalid-credentials-error';
import { UserNotActiveError } from '../../errors/user-not-active';
import { TokenGenerator } from '../../jwt/token-genetator';
import { RefreshTokensRepository } from '../../repository/refresh-tokens-repository';
import { UsersRepository } from '../../repository/users-repository';

type LoginRequest = {
  login: string;
  password: string;
};

type LoginResponse = Either<
  UnauthorizedError,
  {
    accessToken: string;
    refreshToken: string;
  }
>;

export class LoginUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly comparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async handle({ login, password }: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findByLogin(login);

    if (!user) {
      return left(new InvalidCredentialsError());
    }

    if (!(await this.comparer.compare(password, user.passwordHash))) {
      return left(new InvalidCredentialsError());
    }

    if (!user.isActive) {
      return left(new UserNotActiveError());
    }

    const accessToken = await this.tokenGenerator.sign({ sub: user.id.toValue() });
    const refreshToken = await this.tokenGenerator.signRefreshToken({ sub: user.id.toValue() });

    await this.refreshTokensRepository.create(
      RefreshToken.create({ expiresAt: refreshToken.expiresAt, token: refreshToken.token, userId: user.id }),
    );

    return right({ accessToken: accessToken.token, refreshToken: refreshToken.token });
  }
}
