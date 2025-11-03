import { UsersRepository } from '@/domain/social/application/repositories/users-repository';
import { User } from '@/domain/social/enterprise/entities/user';

export class InMemoryUsersRepository extends UsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
    return;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);

    return user || null;
  }
  async findByUsername(username: string): Promise<User | null> {
    const user = this.items.find((item) => item.username === username);

    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id);

    return user || null;
  }
}
