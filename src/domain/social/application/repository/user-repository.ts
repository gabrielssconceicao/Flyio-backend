import { User } from '../../enterprise/entities/user';

export abstract class UserRepository {
  abstract create(user: User): Promise<void>;

  abstract findByEmailOrUsername(data: {
    email: string;
    username: string;
  }): Promise<User | null>;
}
