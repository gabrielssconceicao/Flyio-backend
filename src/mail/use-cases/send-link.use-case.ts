import { Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '@/common/utils/use-case';

@Injectable()
export class SendLinkUseCase extends UseCase<
  { email: string },
  { authLinkId: string }
> {
  async execute({ email }: { email: string }): Promise<{ authLinkId: string }> {
    const user = await this.getUserFromEmail(email);
    if (!user) {
      throw new NotFoundException('Email not registered');
    }
    const authLink = await this.prisma.authLinks.create({
      data: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    });
    return { authLinkId: authLink.id };
  }

  private async getUserFromEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: { id: true },
    });

    return user;
  }
}
