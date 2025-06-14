export class PostMapper {
  static defautFields = {
    id: true,
    text: true,
    author: {
      select: {
        id: true,
        name: true,
        username: true,
        profileImg: true,
      },
    },
    images: {
      select: {
        id: true,
        url: true,
      },
    },
    createdAt: true,
  };

  static likeFields(id: string) {
    return {
      likes: {
        where: {
          userId: id,
        },

        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    };
  }

  static separate({
    _count,
    likes,
  }: {
    likes: { userId: string }[];
    _count: { likes: number };
    userId?: string;
  }) {
    return {
      likes: _count.likes,
      isLiked: !!likes.length,
    };
  }
}
