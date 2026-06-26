import { Pagination } from '@/core/types/pagination';
import { UserDto } from '@/domain/identity/application/dto/user-dto';
import { QueryParams, UsersQuery } from '@/domain/identity/application/queries/user-queries';

export class InMemoryUsersQuery implements UsersQuery {
  public items: UserDto[] = [];

  async findProfileByUsername({ query }: QueryParams): Promise<UserDto | null> {
    return Promise.resolve(this.items.find((item) => item.username === query) ?? null);
  }

  async fetchUsersByNameOrUsername(
    params: QueryParams,
    pagination: Pagination,
  ): Promise<{ users: UserDto[]; total: number }> {
    const query = params.query.toLowerCase();

    const filteredItems = this.items.filter(
      (item) => item.username.toLowerCase().includes(query) || item.name.toLowerCase().includes(query),
    );

    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;

    return Promise.resolve({
      users: filteredItems.slice(start, end),
      total: filteredItems.length,
    });
  }
}
