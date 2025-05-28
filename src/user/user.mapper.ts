export class UserMapper {
  static readonly defaultFields = {
    id: true,
    name: true,
    username: true,
    profileImg: true,
    bio: true,
  };

  static readonly findUserFields = {
    ...this.defaultFields,
    createdAt: true,
    isActive: true,
    id: false,
  };
}
