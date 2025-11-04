import { Either, left, right } from '@/core/either';
import { ConflictError } from '@/core/errors/conflict-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { UsersRepository } from '../../repositories/users-repository';

interface DeactivateUserUseCaseRequest {
  id: string;
}

type DeactivateUserUseCaseResponse = Either<
  ResourceNotFoundError | ConflictError,
  null
>;
export class DeactivateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
  }: DeactivateUserUseCaseRequest): Promise<DeactivateUserUseCaseResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    if (!user.isActive) {
      return left(new ConflictError());
    }

    user.deactivate();
    await this.usersRepository.save(user);

    return right(null);
  }
}
