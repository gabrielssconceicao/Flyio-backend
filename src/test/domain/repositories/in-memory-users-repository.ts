import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { EmailOrUsernameParams, UsersRepository } from '@/domain/identity/application/repository/users-repository';
import { User } from '@/domain/identity/enterprise/entities/user';
import { Username } from '@/domain/identity/enterprise/value-obj/username';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
    return Promise.resolve();
  }

  async save(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(user.id));
    this.items[itemIndex] = user;
    return Promise.resolve();
  }

  async findById(id: UniqueEntityId): Promise<User | null> {
    return Promise.resolve(this.items.find((item) => item.id.equals(id)) || null);
  }

  async findByUsername(username: Username): Promise<User | null> {
    return Promise.resolve(this.items.find((item) => item.username.equals(username)) || null);
  }

  async findByEmailOrUsername(data: EmailOrUsernameParams): Promise<User | null> {
    return Promise.resolve(
      this.items.find((item) => item.email.equals(data.email) || item.username.equals(data.username)) || null,
    );
  }

  async findByLogin(login: string): Promise<User | null> {
    return Promise.resolve(
      this.items.find((item) => item.username.value === login || item.email.value === login) || null,
    );
  }
}
