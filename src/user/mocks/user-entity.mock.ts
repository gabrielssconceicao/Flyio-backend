import { UserEntity } from '../entities/user.entity';

export function userEntityMock(): UserEntity {
  return {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    bio: 'bio',
    profileImg: null,
  };
}
