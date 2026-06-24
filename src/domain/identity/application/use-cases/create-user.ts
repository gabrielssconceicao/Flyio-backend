import { Either, left, right } from '@/core/either/either';
import { ConflictError } from '@/core/errors/conflict-error';
import { ValidationError } from '@/core/errors/validation-error';

import { User } from '../../enterprise/entities/user';
import { Email } from '../../enterprise/value-obj/email';
import { Password } from '../../enterprise/value-obj/password';
import { Username } from '../../enterprise/value-obj/username';
import { HashGenerator } from '../cryptography/hasher';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { UsersRepository } from '../repository/users-repository';

export interface CreateUserRquest {
  name: string;
  bio?: string;
  username: string;
  email: string;
  password: string;
}

type CreateUserResponse = Either<ValidationError | ConflictError, void>;

export class CreateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hasher: HashGenerator,
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
    const userExists = await this.usersRepository.findByEmailOrUsername({
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
      passwordHash: hash,
    });
    await this.usersRepository.create(user);

    return right(undefined);
  }
}
