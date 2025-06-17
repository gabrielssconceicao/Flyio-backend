import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

export const payloadMock: JwtPayload = {
  id: '1',
  username: 'johndoe',
  iat: 1,
  exp: 2,
  aud: '1',
  iss: '1',
};
