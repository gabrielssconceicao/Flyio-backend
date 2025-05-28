import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { MeMapper } from './me.mapper';
import { UpdateMeDto } from './dto/update-me.dto';
import { HashingService } from '@/hash/hashing.service';

@Injectable()
export class MeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
  ) {}

  async getMe(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: MeMapper.defaultFields,
    });

    return { user };
  }

  async updateMe({
    user,
    updateMeDto,
  }: {
    user: JwtPayload;
    updateMeDto: UpdateMeDto;
  }) {
    const { bio, name, password } = updateMeDto;
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await this.hashing.hash(password);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: { bio, name, password: hashedPassword },
      select: MeMapper.defaultFields,
    });

    return { user: updatedUser };
  }
}
