import { FindOneUserEntity } from '../entities/find-one-user.entity';

export const userMock = (): FindOneUserEntity => {
  return {
    name: 'John Doe',
    username: 'johndoe',
    bio: 'bio',
    profileImg: null,
    createdAt: new Date('2000-01-01T00:00:00.000Z'),
    isActive: true,
  };
};
