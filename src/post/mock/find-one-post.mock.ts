import { FindOnePostEntity } from '../entities';
import { postMock } from './post.mock';

export const findOnePostMock = (): FindOnePostEntity => {
  return {
    ...postMock(),
    comments: [],
    parent: null,
  };
};
