import { UserRepository } from '@/domain/social/application/repository/user-repository';
import { User } from '@/domain/social/enterprise/entities/user';

export class InMemoryUserRepository extends UserRepository {
  items: User[] = [];

  create(user: User): Promise<void> {
    this.items.push(user);
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
}
