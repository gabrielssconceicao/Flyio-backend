import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

export type Follow = {
  payload: JwtPayload;
  username: string;
};
