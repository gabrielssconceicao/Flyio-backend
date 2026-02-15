import { Either, left, right } from '@/core/either';
import { InvalidEmailOrUsernameError } from '@/core/errors/InvalidEmailOrUsernameError';
import { UserAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { User } from '@/domain/social/enterprise/entities/user';
import { Email } from '@/domain/social/enterprise/entities/value-obj/email';
import { InvalidEmailError } from '@/domain/social/enterprise/entities/value-obj/errors/invalid-email-error';
import { InvalidUsernameError } from '@/domain/social/enterprise/entities/value-obj/errors/invalid-username-error';
import { Username } from '@/domain/social/enterprise/entities/value-obj/username';

import { Hasher } from '../../cryptography/hasher';
import { UserRepository } from '../../repository/user-repository';

interface RegisterUseCaseRequest {
  name: string;
  bio?: string;
  username: string;
  email: string;
  password: string;
}

type RegisterUseCaseResponse = Either<
  UserAlreadyExistError | InvalidEmailOrUsernameError,
  null
>;

export class RegisterUseCase {
  constructor(
    private hasher: Hasher,
    private userRepository: UserRepository,
  ) {}

  async execute(
    data: RegisterUseCaseRequest,
  ): Promise<RegisterUseCaseResponse> {
    const { email, name, password, username, bio } = data;
    try {
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
        bio,
      });
      await this.userRepository.create(user);
      return right(null);
    } catch (error) {
      if (
        error instanceof InvalidUsernameError ||
        error instanceof InvalidEmailError
      ) {
        return left(new InvalidEmailOrUsernameError());
      }

      return left(error);
    }
    // trycatch username and email unique constraint
  }
}
