import { UserEntity } from '../entities';

export function userEntityMock(): UserEntity {
  return {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    bio: 'bio',
    profileImg: null,
  };
}
