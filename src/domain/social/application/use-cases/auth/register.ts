import { Either, left, right } from '@/core/either';
import { UserAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { User } from '@/domain/social/enterprise/entities/user';
import { Email } from '@/domain/social/enterprise/entities/value-obj/email';
import { Username } from '@/domain/social/enterprise/entities/value-obj/username';

import { Hasher } from '../../cryptography/hasher';
import { UserRepository } from '../../repository/user-repository';

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
    private userRepository: UserRepository,
  ) {}

  async execute(
    data: RegisterUseCaseRequest,
  ): Promise<RegisterUseCaseResponse> {
    const { email, name, password, username } = data;
    const userexists = await this.userRepository.findByEmailOrUsername({
      email,
      username,
    });

    if (userexists) {
      return left(new UserAlreadyExistError());
    }

    const hashed_password = await this.hasher.hash(password);

    const user = User.create({
      name,
      username: Username.create(username),
      email: Email.create(email),
      password_hash: hashed_password,
    });
    await this.userRepository.create(user);
    return right(null);
  }
}
