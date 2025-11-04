import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UserAlreadyExistError } from '@/core/errors/user-already-exist-error';

import { Hasher } from '../../cryptography/hasher';
import { UsersRepository } from '../../repositories/users-repository';

interface EditProfileUseCaseRequest {
  id: string;
  name?: string;
  email?: string;
  password?: string;
}

type EditProfileUseCaseResponse = Either<
  UserAlreadyExistError | ResourceNotFoundError,
  null
>;

export class EditProfileUseCase {
  constructor(
    private hasher: Hasher,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    id,
    email,
    name,
    password,
  }: EditProfileUseCaseRequest): Promise<EditProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      const existingUser = await this.usersRepository.findByEmail(email);

      if (existingUser && existingUser.id !== user.id) {
        return left(new UserAlreadyExistError());
      }

      user.email = email;
    }

    if (password) {
      const hashed_password = await this.hasher.hash(password);
      user.password_hash = hashed_password;
    }

    await this.usersRepository.save(user);

    return right(null);
  }
}
