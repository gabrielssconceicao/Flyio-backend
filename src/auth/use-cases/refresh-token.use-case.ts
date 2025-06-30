import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { AuthUseCase } from './auth.use-case';

interface NewAccessToken {
  newAccessToken: string;
}

export class RefreshTokenUseCase extends AuthUseCase<
  string,
  NewAccessToken | undefined
> {
  async execute(token: string): Promise<NewAccessToken | undefined> {
    if (!token) {
      this.throwUnauthorizedException('Invalid or missing token');
    }
    try {
      const payload = this.jwt.verify<JwtPayload>(token, this.jwtConfiguration);
      const { accessToken: newAccessToken } = await this.generateAccessToken({
        payload: {
          id: payload.id,
          username: payload.username,
        },
      });
      return { newAccessToken };
    } catch {
      this.throwUnauthorizedException('Invalid or missing token');
    }
  }
}
