import {
  ExistsByEmailOrUsernameParams,
  UsersRepository,
} from '@/domain/identity/application/repository/users-repository';
import { User } from '@/domain/identity/enterprise/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async existsByEmailOrUsername(data: ExistsByEmailOrUsernameParams): Promise<boolean> {
    return this.items.some((item) => item.email.equals(data.email) || item.username.equals(data.username));
  }
}
