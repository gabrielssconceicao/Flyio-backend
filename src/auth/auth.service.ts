import { Injectable } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { SignInUseCase } from './use-cases/sign-in.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  signIn(userLoginDto: UserLoginDto) {
    return this.signInUseCase.execute(userLoginDto);
  }

  refresh(token: string): Promise<{ newAccessToken: string }> {
    return this.refreshTokenUseCase.execute(token) as Promise<{
      newAccessToken: string;
    }>;
  }
}
