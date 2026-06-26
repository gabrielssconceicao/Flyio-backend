import { Either, right } from '@/core/either/either';

import { UserDto } from '../../dto/user-dto';
import { UsersQuery } from '../../queries/user-queries';

type SearchUsersParams = {
  query: string;
  viewerId?: string;
  limit?: number;
  page?: number;
};

type SearchUsersResponse = Either<
  void,
  {
    users: UserDto[];
    total: number;
  }
>;

export class SearchUsersUseCase {
  constructor(private readonly userQuery: UsersQuery) {}
  async execute({ query, viewerId, limit = 50, page = 1 }: SearchUsersParams): Promise<SearchUsersResponse> {
    const { users, total } = await this.userQuery.fetchUsersByNameOrUsername(
      {
        query,
        viewerId: viewerId || '',
      },
      {
        limit,
        page,
      },
    );

    return right({ users, total });
  }
}
