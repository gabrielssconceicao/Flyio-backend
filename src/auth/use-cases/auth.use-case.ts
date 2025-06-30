import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { HashingService } from '@/hash/hashing.service';
import { UseCase } from '@/common/utils/use-case';
import jwtConfig from '../jwt.config';

type Payload = { id: string; username: string };
type PayloadBody = {
  payload: Payload;
};
type Token = { accessToken: string; refreshToken?: string };

@Injectable()
export abstract class AuthUseCase<T, R> extends UseCase<T, R> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly hashing: HashingService,
    protected readonly jwt: JwtService,
    @Inject(jwtConfig.KEY)
    protected readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super(prisma);
  }

  protected async generateAccessToken({
    payload,
  }: PayloadBody): Promise<Token> {
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.jwtConfiguration.secret,
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      expiresIn: this.jwtConfiguration.accessTokenExpiresIn,
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.jwtConfiguration.secret,
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      expiresIn: this.jwtConfiguration.refreshTokenExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  protected throwUnauthorizedException(msg: string) {
    throw new UnauthorizedException(msg);
  }
}
