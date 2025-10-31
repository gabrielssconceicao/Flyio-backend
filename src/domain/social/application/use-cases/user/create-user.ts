import { Either, left, right } from '@/core/either';
import { ExistingUserError } from '@/core/errors/existing-user-error';
import { User } from '@/domain/social/enterprise/entities/user';

import { Hasher } from '../../cryptography/hasher';
import { UsersRepository } from '../../repositories/users-repository';

interface CreateUserUseCaseRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

type CreateUserUseCaseResponse = Either<ExistingUserError, null>;

export class CreateUserUseCase {
  constructor(
    private hasher: Hasher,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    email,
    name,
    username,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      return left(new ExistingUserError());
    }
    const hashed_password = await this.hasher.hash(password);

    const user = User.create({
      name,
      username,
      email,
      password_hash: hashed_password,
    });
    await this.usersRepository.create(user);

    return right(null);
  }
}
