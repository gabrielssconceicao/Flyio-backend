import { SearchUserEntity } from '../entities/search-user.entity';

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
