import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { User } from '@/domain/social/enterprise/entities/user';

import { UserRepository } from '../../repository/user-repository';

interface GetProfileUseCaseRequest {
  userId: string;
}

type GetProfileUseCaseResponse = Either<ResourceNotFoundError, { user: User }>;

export class GetProfileUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    userId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(
      new UniqueEntityId(userId),
    );

    if (!user) {
      return left(new ResourceNotFoundError('User'));
    }

    return right({ user });
  }
}
