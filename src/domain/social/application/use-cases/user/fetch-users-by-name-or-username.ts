import { Either, right } from '@/core/either';
import { User } from '@/domain/social/enterprise/entities/user';

import { UserRepository } from '../../repository/user-repository';

interface FetchUsersByNameOrUsernameUseCaseRequest {
  search: string;
  page: number;
  limit?: number;
}

type FetchUsersByNameOrUsernameUseCaseResponse = Either<
  null,
  { users: User[] }
>;

export class FetchUsersByNameOrUsernameUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    search,
    page,
    limit = 50,
  }: FetchUsersByNameOrUsernameUseCaseRequest): Promise<FetchUsersByNameOrUsernameUseCaseResponse> {
    const users = await this.userRepository.fetch(search, { page, limit });
    // TODO: add if viwer is following
    return right({ users });
  }
}
