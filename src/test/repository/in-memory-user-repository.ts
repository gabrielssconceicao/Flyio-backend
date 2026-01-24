import { PaginationParams } from '@/core/repository/pagination-params';
import { UserRepository } from '@/domain/social/application/repository/user-repository';
import { User } from '@/domain/social/enterprise/entities/user';

export class InMemoryUserRepository extends UserRepository {
  items: User[] = [];

  create(user: User): Promise<void> {
    this.items.push(user);
    return Promise.resolve();
  }

  save(user: User): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.value === user.id.value,
    );
    this.items[index] = user;
    return Promise.resolve();
  }

  findByEmailOrUsername(data: {
    email: string;
    username: string;
  }): Promise<User | null> {
    const user = this.items.find(
      (item) =>
        item.email.value === data.email ||
        item.username.value === data.username,
    );

    if (!user) {
      return Promise.resolve(null);
    }

    return Promise.resolve(user);
  }

  findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email.value === email);

    if (!user) {
      return Promise.resolve(null);
    }

    return Promise.resolve(user);
  }
  findByUsername(username: string): Promise<User | null> {
    const user = this.items.find((item) => item.username.value === username);

    if (!user) {
      return Promise.resolve(null);
    }

    return Promise.resolve(user);
  }

  findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.value === id);

    if (!user) {
      return Promise.resolve(null);
    }

    return Promise.resolve(user);
  }

  fetch(search: string, pagination: PaginationParams): Promise<User[]> {
    const { page, limit } = pagination;

    const normalizedSearch = search.toLowerCase();

    const filteredUsers = this.items.filter((item) => {
      return (
        item.username.value.toLowerCase().includes(normalizedSearch) ||
        item.name.toLowerCase().includes(normalizedSearch)
      );
    });

    const start = (page - 1) * limit;
    const end = start + limit;

    const users = filteredUsers.slice(start, end);

    return Promise.resolve(users);
  }

  findManyByIds(ids: string[]): Promise<User[]> {
    const users = this.items.filter((item) => ids.includes(item.id.value));

    return Promise.resolve(users);
  }
}
