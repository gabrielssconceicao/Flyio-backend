import { FindOneUserEntity } from '../entities';

export const userMock = (): FindOneUserEntity => {
  return {
    name: 'John Doe',
    username: 'johndoe',
    bio: 'bio',
    profileImg: null,
    createdAt: new Date('2000-01-01T00:00:00.000Z'),
    isActive: true,
    followers: 0,
    following: 0,
  };
};
