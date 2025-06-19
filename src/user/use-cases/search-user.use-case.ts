import { Injectable } from '@nestjs/common';
import { UserMapper } from '../user.mapper';
import { UserUseCase } from './user.use-case';
import { QueryParamDto } from '@/common/dto/query-param.dto';
import { SearchUserEntity } from '../entities/search-user.entity';

@Injectable()
export class SearchUserUseCase extends UserUseCase<
  QueryParamDto,
  SearchUserEntity
> {
  async execute(query: QueryParamDto): Promise<SearchUserEntity> {
    const { search = '', limit = 20, offset = 0 } = query;
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      },
      take: limit,
      skip: offset,
      select: UserMapper.searchUserFields,
    });

    const count = await this.prisma.user.count();

    return { count, items: users };
  }
}
