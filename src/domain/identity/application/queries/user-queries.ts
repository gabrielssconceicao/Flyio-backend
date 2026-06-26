import { Pagination } from '@/core/types/pagination';

import { UserDto } from '../dto/user-dto';

export type QueryParams = {
  query: string;
  viewerId?: string;
};

export abstract class UsersQuery {
  abstract findProfileByUsername(params: QueryParams): Promise<UserDto | null>;
  abstract fetchUsersByNameOrUsername(
    params: QueryParams,
    pagination: Pagination,
  ): Promise<{ users: UserDto[]; total: number }>;
}
