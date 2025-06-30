import { Injectable } from '@nestjs/common';
import { MeUseCase } from './me.use-case';
import { Id } from './types';

@Injectable()
export class DesactivateMeUserCase extends MeUseCase<Id, void> {
  async execute({ id }: Id): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        isActive: false,
      },
    });
    return;
  }
}
