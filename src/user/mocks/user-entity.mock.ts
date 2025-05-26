import { UserEntity } from '../entities/user.entity';

export function userEntityMock(): UserEntity {
  return {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    bio: 'bio',
    profileImg: null,
    createdAt: new Date('2000-01-01T00:00:00.000Z'),
  };
}
