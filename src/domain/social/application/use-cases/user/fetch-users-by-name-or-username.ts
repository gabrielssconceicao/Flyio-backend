import { Either, right } from '@/core/either';
import { User } from '@/domain/social/enterprise/entities/user';

import { UsersRepository } from '../../repositories/users-repository';

export class FetchUsersByNameOrUsernameUseCaseRequest {
  query: string;
  page: number;
}

export type FetchUsersByNameOrUsernameUseCaseResponse = Either<
  null,
  {
    users: User[];
  }
>;

export class FetchUsersByNameOrUsernameUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({
    query,
    page,
  }: FetchUsersByNameOrUsernameUseCaseRequest): Promise<FetchUsersByNameOrUsernameUseCaseResponse> {
    const users = await this.usersRepository.findByNameOrUsername(query, {
      page,
    });
    return right({ users });
  }
}
