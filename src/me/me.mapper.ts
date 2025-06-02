export class MeMapper {
  static defaultFields = {
    id: true,
    name: true,
    username: true,
    bio: true,
    profileImg: true,
    createdAt: true,
  };

  static followCountFields = {
    _count: {
      select: {
        followers: true,
        following: true,
      },
    },
  };

  static separateCount(count: {
    _count: { followers: number; following: number };
  }) {
    return {
      followers: count._count.followers,
      following: count._count.following,
    };
  }
}
