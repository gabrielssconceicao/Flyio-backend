import { BadRequestException, Injectable } from '@nestjs/common';
import { differenceInDays } from 'date-fns';
import { UseCase } from '@/common/utils/use-case';

@Injectable()
export class ReactivateAccountUseCase extends UseCase<{ code: string }, void> {
  async execute({ code }: { code: string }): Promise<void> {
    const data = await this.prisma.authLinks.findUnique({
      where: {
        id: code,
      },
      select: {
        userId: true,
        createdAt: true,
      },
    });

    if (!data) {
      throw new BadRequestException('Link invalid or expired');
    }

    const EXPIRATION_DAYS = 1;
    const daysPassed = differenceInDays(new Date(), new Date(data.createdAt));

    if (daysPassed > EXPIRATION_DAYS) {
      throw new BadRequestException('Link invalid or expired');
    }

    await this.prisma.user.update({
      where: {
        id: data.userId,
      },
      data: {
        isActive: true,
      },
    });
    await this.prisma.authLinks.deleteMany({
      where: {
        userId: data.userId,
      },
    });

    return;
  }
}
