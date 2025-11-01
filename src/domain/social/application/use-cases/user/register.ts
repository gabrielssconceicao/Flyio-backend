import { Either, left, right } from '@/core/either';
import { UserAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { User } from '@/domain/social/enterprise/entities/user';

import { Hasher } from '../../cryptography/hasher';
import { UsersRepository } from '../../repositories/users-repository';

interface RegisterUseCaseRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

type RegisterUseCaseResponse = Either<UserAlreadyExistError, null>;

export class RegisterUseCase {
  constructor(
    private hasher: Hasher,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    email,
    name,
    username,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    const userWithSameUsername =
      await this.usersRepository.findByUsername(username);

    if (userWithSameEmail || userWithSameUsername) {
      return left(new UserAlreadyExistError());
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
