import { Either, left, right } from '@/core/either/either';
import { ConflictError } from '@/core/errors/conflict-error';
import { ValidationError } from '@/core/errors/validation-error';

import { User } from '../../enterprise/entities/user';
import { UserAlreadyExistsError } from '../../enterprise/errors/user-already-exists-error';
import { Email } from '../../enterprise/value-obj/email';
import { Password } from '../../enterprise/value-obj/password';
import { Username } from '../../enterprise/value-obj/username';
import { HashGenerator } from '../cryptography/hasher';
import { UsersRepository } from '../repository/users-repository';

interface CreateUserRquest {
  name: string;
  bio?: string;
  username: string;
  email: string;
  password: string;
}

type CreateUserResponse = Either<ValidationError | ConflictError, void>;

export class CreateUser {
  constructor(
    private readonly hasher: HashGenerator,
    private readonly usersRepository: UsersRepository,
  ) {}
  async handle(data: CreateUserRquest): Promise<CreateUserResponse> {
    const username = Username.create(data.username);
    const email = Email.create(data.email);
    const password = Password.create(data.password);

    if (username.isLeft()) {
      return left(username.value);
    }

    if (email.isLeft()) {
      return left(email.value);
    }

    if (password.isLeft()) {
      return left(password.value);
    }

    const userExists = await this.usersRepository.existsByEmailOrUsername({
      email: email.value,
      username: username.value,
    });

    if (userExists) {
      return left(new UserAlreadyExistsError());
    }

    const hash = await this.hasher.hash(password.value.value);
    const user = User.create({
      name: data.name,
      bio: data.bio,
      username: username.value,
      email: email.value,
      password_hash: hash,
    });

    await this.usersRepository.create(user);

    return right(undefined);
  }
}
