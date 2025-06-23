import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

export type Like = {
  postId: string;
  payload: JwtPayload;
};
