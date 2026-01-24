import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { Hasher } from '../../cryptography/hasher';
import { UserRepository } from '../../repository/user-repository';

interface EditPasswordUseCaseRequest {
  userId: string;
  password: string;
}

type EditPasswordUseCaseResponse = Either<ResourceNotFoundError, void>;

export class EditPasswordUseCase {
  constructor(
    private hash: Hasher,
    private usersRepository: UserRepository,
  ) {}

  async execute({
    userId,
    password,
  }: EditPasswordUseCaseRequest): Promise<EditPasswordUseCaseResponse> {
    const user = await this.usersRepository.findById(
      new UniqueEntityId(userId),
    );

    if (!user) {
      return left(new ResourceNotFoundError('User'));
    }

    const passwordHash = await this.hash.hash(password);

    user.password_hash = passwordHash;

    await this.usersRepository.save(user);

    return right(undefined);
  }
}
