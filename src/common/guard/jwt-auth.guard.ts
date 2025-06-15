import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, ctx: ExecutionContext) {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          message: 'Access token expired',
          type: 'TokenExpired',
          error: 'Unauthorized',
          statusCode: 401,
        });
      }

      throw new UnauthorizedException({
        message: 'Invalid or missing token',
        type: 'InvalidToken',
        error: 'Unauthorized',
        statusCode: 401,
      });
    }

    return user;
  }
}
