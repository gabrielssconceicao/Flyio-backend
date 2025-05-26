import { UnauthorizedException, Inject, Injectable } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { HashingService } from '@/hash/hashing.service';
import jwtConfig from './jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
    private readonly jwt: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async signIn(userLoginDto: UserLoginDto) {
    const { password, login } = userLoginDto;
    const { user } = await this.userExists(login);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordCorrect = await this.hashing.compare({
      password,
      hash: user.password,
    });
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { accessToken } = await this.generateAccessToken({
      id: user.id,
      username: user.username,
    });
    return {
      accessToken,
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

    return { user };
  }

  private async generateAccessToken(payload: { id: string; username: string }) {
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.jwtConfiguration.secret,
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      expiresIn: this.jwtConfiguration.accessTokenExpiresIn,
    });

    return { accessToken };
  }
}
