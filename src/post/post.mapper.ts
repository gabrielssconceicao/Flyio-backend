export class PostMapper {
  static defautFields = {
    id: true,
    text: true,
    parentId: true,
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
    };
  }

  static commentField(id: string) {
    return {
      replies: {
        select: {
          ...this.defautFields,
          ...this.likeFields(id),
          ...this.commentField,
          ...this.countField,
        },
      },
    };
  }

  static countField = {
    _count: {
      select: {
        likes: true,
        replies: true,
      },
    },
  };

  static separate({
    _count,
    likes,
  }: {
    likes: { userId: string }[];
    _count: { likes: number; replies: number };
    userId?: string;
  }) {
    return {
      likes: _count.likes,
      replies: _count.replies,
      isLiked: !!likes.length,
    };
  }
}
