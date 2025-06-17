import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { AuthUseCase } from './auth.use-case';

export class RefreshTokenUseCase extends AuthUseCase {
  async execute(token: string) {
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
