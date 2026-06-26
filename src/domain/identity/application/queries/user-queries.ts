import { UserDto } from '../dto/user-dto';

type GetUserProfileParams = {
  username: string;
  viewerId?: string;
};

export abstract class UsersQuery {
  abstract findProfileByUsername(params: GetUserProfileParams): Promise<UserDto | null>;
}
