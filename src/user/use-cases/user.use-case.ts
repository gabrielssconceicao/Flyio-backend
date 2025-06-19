import { Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '@/common/utils/use-case';

@Injectable()
export abstract class UserUseCase<P, R> extends UseCase<P, R> {
  protected async userExists(username: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
}
