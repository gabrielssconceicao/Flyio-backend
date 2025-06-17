import { MeUseCase } from './me.use-case';
import { Id } from './types';

export class DesactivateMeUserCase extends MeUseCase {
  async execute({ id }: Id) {
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
