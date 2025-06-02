import { SearchUserEntity } from '../entities/search-user.entity';

export const searchUsersResponseMock = (): SearchUserEntity => {
  return {
    count: 1,
    users: [
      {
        name: 'John Doe',
        username: 'johndoe',
        profileImg: null,
      },
    ],
  };
};
