import { User } from '../../enterprise/entities/user';
import { Email } from '../../enterprise/value-obj/email';
import { Username } from '../../enterprise/value-obj/username';

export type ExistsByEmailOrUsernameParams = {
  email: Email;
  username: Username;
};

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;

  abstract existsByEmailOrUsername(data: ExistsByEmailOrUsernameParams): Promise<boolean>;
}
