import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { User } from '@/domain/social/enterprise/entities/user';

import { UsersRepository } from '../../repositories/users-repository';

interface GetUserUseCaseRequest {
  username: string;
}

type GetUserUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User;
  }
>;
export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    username,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    return right({
      user,
    });
  }
}
