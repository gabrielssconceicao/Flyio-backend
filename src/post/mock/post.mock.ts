import { PostEntity } from '../entities/post.entity';

export const postMock = (): PostEntity => {
  return {
    id: 'id-1',
    text: 'This is a post',
    createdAt: new Date('2000-01-01T00:00:00.000Z'),
    author: {
      name: 'John Doe',
      username: 'johndoe',
      profileImg: null,
    },
    images: [
      {
        id: 'id-1',
        url: 'https://example.com/image1.jpg',
      },
    ],
    likes: 0,
    replies: 0,
    isLiked: false,
    parentId: null,
  };
};
