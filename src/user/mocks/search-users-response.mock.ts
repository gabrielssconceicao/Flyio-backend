import { SearchUserEntity } from '../entities';

export const searchUsersResponseMock = (): SearchUserEntity => {
  return {
    count: 1,
    items: [
      {
        name: 'John Doe',
        username: 'johndoe',
        profileImg: null,
      },
    ],
  };
};
