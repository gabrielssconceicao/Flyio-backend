export class UserMapper {
  static readonly defaultFields = {
    name: true,
    username: true,
    profileImg: true,
    bio: true,
  };

  static readonly createUserFields = {
    ...this.defaultFields,
    id: true,
  };

  static readonly findUserFields = {
    ...this.defaultFields,
    createdAt: true,
    isActive: true,
    _count: {
      select: {
        followers: true,
        following: true,
      },
    },
  };

  static readonly searchUserFields = {
    username: true,
    name: true,
    profileImg: true,
  };
}
