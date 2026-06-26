import { Either, left, right } from '@/core/either/either';
import { NotFoundError } from '@/core/errors/not-found-error';

import { UserDto } from '../../dto/user-dto';
import { UserNotFoundError } from '../../errors/user-not-found-error';
import { UsersQuery } from '../../queries/user-queries';

type GetProfileByUsernameRequest = {
  username: string;
  viwerId?: string;
};

type GetProfileByUsernameResponse = Either<NotFoundError, UserDto>;

export class GetProfileByUsernameUseCase {
  constructor(private readonly userQuery: UsersQuery) {}

  async handle({ username, viwerId }: GetProfileByUsernameRequest): Promise<GetProfileByUsernameResponse> {
    const profile = await this.userQuery.findProfileByUsername({ query: username.trim(), viewerId: viwerId || '' });

    if (!profile) {
      return left(new UserNotFoundError());
    }

    return right(profile);
  }
}
