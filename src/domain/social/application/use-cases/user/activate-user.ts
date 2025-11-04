import { Either, left, right } from '@/core/either';
import { ConflictError } from '@/core/errors/conflict-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { UsersRepository } from '../../repositories/users-repository';

interface ActivateUserUseCaseRequest {
  id: string;
}

type ActivateUserUseCaseResponse = Either<ResourceNotFoundError, null>;
export class ActivateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
  }: ActivateUserUseCaseRequest): Promise<ActivateUserUseCaseResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    if (user.isActive) {
      return left(new ConflictError());
    }

    user.activate();
    await this.usersRepository.save(user);

    return right(null);
  }
}
