import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { User } from '@/domain/social/enterprise/entities/user';

import { UsersRepository } from '../../repositories/users-repository';

interface GetUserProfileUseCaseRequest {
  id: string;
}

type GetUserProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User;
  }
>;
export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    return right({
      user,
    });
  }
}
