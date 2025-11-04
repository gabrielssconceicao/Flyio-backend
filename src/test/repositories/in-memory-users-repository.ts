import { PaginationParams } from '@/core/repositories/pagination-params';
import { UsersRepository } from '@/domain/social/application/repositories/users-repository';
import { User } from '@/domain/social/enterprise/entities/user';

export class InMemoryUsersRepository extends UsersRepository {
  public items: User[] = [];

  async create(user: User) {
    this.items.push(user);
    return;
  }

  async save(user: User) {
    const userIndex = this.items.findIndex((item) => item.id === user.id);
    this.items[userIndex] = user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    return user || null;
  }
  async findByUsername(username: string) {
    const user = this.items.find((item) => item.username === username);

    return user || null;
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id.toString() === id);

    return user || null;
  }

  async findByNameOrUsername(query: string, params: PaginationParams) {
    const queryLowerCase = query.toLowerCase();
    const users = this.items
      .filter((item) => {
        return (
          item.username.toLowerCase().includes(queryLowerCase) ||
          item.name.toLowerCase().includes(queryLowerCase)
        );
      })
      .slice((params.page - 1) * 20, params.page * 20);

    return users;
  }
}
