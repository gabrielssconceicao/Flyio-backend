import { Either, left, right } from '@/core/either';
import { InvalidCredentialsError } from '@/core/errors/auth/invalid-credentials-error';
import { User } from '@/domain/social/enterprise/entities/user';

import { Comparator } from '../../cryptography/comparator';
import { UserRepository } from '../../repository/user-repository';

interface LoginUseCaseRequest {
  email: string;
  password: string;
}

type LoginUseCaseResponse = Either<InvalidCredentialsError, User>;

export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private comparator: Comparator,
  ) {}

  async execute({
    email,
    password,
  }: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return left(new InvalidCredentialsError());
    }

    const isPasswordValid = await this.comparator.compare({
      password,
      hash: user.password_hash,
    });

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError());
    }

    return right(user);
  }
}
