import { postMock } from '@/post/mock';
import { GetLikedPostEntity } from '../entities';

export const getLikesMock = (): GetLikedPostEntity => {
  return {
    count: 1,
    items: [{ ...postMock(), parent: null }],
  };
};
