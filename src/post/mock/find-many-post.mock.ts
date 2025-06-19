import { postMock } from './post.mock';
import { FindManyPostEntity } from '../entities';

export const findManyPostMock = (): FindManyPostEntity => {
  return {
    count: 1,
    items: [postMock()],
  };
};
