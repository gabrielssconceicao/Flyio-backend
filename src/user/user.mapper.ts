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
  };
}
