import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export class UserUseCase {
  constructor(protected readonly prisma: PrismaService) {}

  protected async userExists(username: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      this.throwNotFoundException('User not found');
    }
  }

  protected throwNotFoundException(msg: string) {
    throw new NotFoundException(msg);
  }
}
