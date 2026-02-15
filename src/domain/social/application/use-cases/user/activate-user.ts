import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UserAlreadyActiveError } from '@/core/errors/user/user-already-active-error';

import { UserRepository } from '../../repository/user-repository';

interface ActivateUserUseCaseRequest {
  userId: string;
}

type ActivateUserUseCaseResponse = Either<
  ResourceNotFoundError | UserAlreadyActiveError,
  null
>;

export class ActivateUserUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    userId,
  }: ActivateUserUseCaseRequest): Promise<ActivateUserUseCaseResponse> {
    const user = await this.usersRepository.findById(
      new UniqueEntityId(userId),
    );

    if (!user) {
      return left(new ResourceNotFoundError('User'));
    }

    if (user.is_active) {
      return left(new UserAlreadyActiveError());
    }

    user.activate();

    await this.usersRepository.save(user);

    return right(null);
  }
}
