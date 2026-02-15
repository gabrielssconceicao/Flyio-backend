import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UserAlreadyInactiveError } from '@/core/errors/user/user-already-inactive-error';

import { UserRepository } from '../../repository/user-repository';

interface DeactivateUserUseCaseRequest {
  userId: string;
}

type DeactivateUserUseCaseResponse = Either<
  ResourceNotFoundError | UserAlreadyInactiveError,
  null
>;

export class DeactivateUserUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    userId,
  }: DeactivateUserUseCaseRequest): Promise<DeactivateUserUseCaseResponse> {
    const user = await this.usersRepository.findById(
      new UniqueEntityId(userId),
    );

    if (!user) {
      return left(new ResourceNotFoundError('User'));
    }

    if (!user.is_active) {
      return left(new UserAlreadyInactiveError());
    }

    user.deactivate();

    await this.usersRepository.save(user);

    return right(null);
  }
}
