import { User } from '../../enterprise/entities/user';
import { Email } from '../../enterprise/value-obj/email';
import { Username } from '../../enterprise/value-obj/username';

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract existsByEmailOrUsername(data: { email: Email; username: Username }): Promise<boolean>;
}
