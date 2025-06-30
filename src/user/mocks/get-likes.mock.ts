import { postMock } from '@/post/mock';
import { GetLikedPostEntity } from '../entities';

export const getLikesMock = (): GetLikedPostEntity => {
  return {
    count: 1,
    items: [
      {
        ...postMock(),
        parentId: 'id-2',
        parent: {
          author: {
            username: 'johndoe',
          },
        },
      },
    ],
  };
};
