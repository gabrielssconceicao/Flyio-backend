import { FindOneUserEntity } from '../entities/find-one-user.entity';
import { UserMapper } from '../user.mapper';
import { Count, GetUserParam } from './types';
import { UserUseCase } from './user.use-case';

export class GetUserUseCase extends UserUseCase {
  async execute({ username }: GetUserParam) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: UserMapper.findUserFields,
    });

    if (!user) {
      this.throwNotFoundException('User not found');
    }

    const { _count, ...rest } = user as FindOneUserEntity & Count;

    return {
      user: {
        ...rest,
        ...UserMapper.separateCount({ _count }),
      },
    };
  }
}
