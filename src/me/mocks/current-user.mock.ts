import { userEntityMock } from '@/user/mocks/user-entity.mock';

export const currentUserMock = () => {
  return {
    ...userEntityMock(),
    createdAt: new Date('2000-01-01T00:00:00.000Z'),
  };
};
