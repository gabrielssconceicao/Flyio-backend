import { UserDto } from '@/domain/identity/application/dto/user-dto';
import { UsersQuery } from '@/domain/identity/application/queries/user-queries';

export class InMemoryUsersQuery implements UsersQuery {
  public items: UserDto[] = [];

  async findProfileByUsername({ username }: { username: string; viewerId?: string }): Promise<UserDto | null> {
    return Promise.resolve(this.items.find((item) => item.username === username) ?? null);
  }
}
