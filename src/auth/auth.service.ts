import { BadRequestException, Injectable } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { HashingService } from '@/hash/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
  ) {}
  async signIn(userLoginDto: UserLoginDto) {
    const { password, login } = userLoginDto;
    const { user } = await this.userExists(login);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordCorrect = await this.hashing.compare({
      password,
      hash: user.password,
    });
    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid credentials');
    }
    return {
      accessToken: 'accessToken',
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
}
