import { userEntityMock } from '@/user/mocks/user-entity.mock';

export const currentUserMock = () => {
  return {
    ...userEntityMock(),
    bannerImg: null,
    createdAt: new Date('2000-01-01T00:00:00.000Z'),
    followers: 0,
    following: 0,
  };
};
