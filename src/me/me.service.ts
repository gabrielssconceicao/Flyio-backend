import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { MeMapper } from './me.mapper';

@Injectable()
export class MeService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: MeMapper.defaultFields,
    });

    return { user };
  }
}
