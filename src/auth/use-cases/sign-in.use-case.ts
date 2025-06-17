import { Injectable } from '@nestjs/common';
import { AuthUseCase } from './auth.use-case';
import { UserLoginDto } from '../dto/user-login.dto';
type User = {
  id: string;
  username: string;
  password: string;
};
@Injectable()
export class SignInUseCase extends AuthUseCase {
  async execute(userLoginDto: UserLoginDto) {
    const { password, login } = userLoginDto;
    const user = await this.userExists(login);

    const isPasswordCorrect = await this.hashing.compare({
      password,
      hash: user.password,
    });
    if (!isPasswordCorrect) {
      this.throwUnauthorizedException('Invalid credentials');
    }
    const { accessToken, refreshToken } = await this.generateAccessToken({
      payload: {
        id: user.id,
        username: user.username,
      },
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  private async userExists(login: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: login }, { email: login }],
      },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      this.throwUnauthorizedException('Invalid credentials');
    }

    return user as User;
  }
}
