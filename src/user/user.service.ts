import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
import { FindOneUserEntity } from './entities/find-one-user.entity';
import { QueryParamDto } from '@/common/dto/query-param.dto';
import { SearchUserEntity } from './entities/search-user.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';

import { PostMapper } from '@/post/post.mapper';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { GetLikedPostEntity } from './entities/get-liked-post-entity';
import { FindManyPostEntity } from '@/post/entities/find-many.entity';
import { GetUserCommentsEntity } from './entities/get-user-comments.entity';
import { CreateUserParams, GetFollowingsParam } from './use-cases/types';
import {
  CreateUserUseCase,
  GetFollowersUseCase,
  GetUserUseCase,
  SearchUserUseCase,
} from './use-cases';
import { GetFollowingsUseCase } from './use-cases/get-followings.use-case';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getUser: GetUserUseCase,
    private readonly createUser: CreateUserUseCase,
    private readonly searchUser: SearchUserUseCase,
    private readonly getFollowing: GetFollowingsUseCase,
    private readonly getFollower: GetFollowersUseCase,
  ) {}

  async create({
    createUserDto,
    bannerImage,
    profileImage,
  }: CreateUserParams): Promise<UserEntity> {
    return this.createUser.execute({
      createUserDto,
      bannerImage,
      profileImage,
    });
  }

  async search(query: QueryParamDto): Promise<SearchUserEntity> {
    return this.searchUser.execute(query);
  }

  async findOne(username: string): Promise<{ user: FindOneUserEntity }> {
    return this.getUser.execute({ username });
  }

  async getFollowings({
    username,
    query,
  }: GetFollowingsParam): Promise<SearchUserEntity> {
    return this.getFollowing.execute({ username, query });
  }

  async getFollowers({
    username,
    query,
  }: GetFollowingsParam): Promise<SearchUserEntity> {
    return this.getFollower.execute({ username, query });
  }

  async getLikedPosts({
    query,
    username,
    payload,
  }: {
    username: string;
    query: PaginationDto;
    payload: JwtPayload;
  }): Promise<GetLikedPostEntity> {
    const { limit = 50, offset = 0 } = query;
    const posts = await this.prisma.likePost.findMany({
      where: {
        user: {
          username,
        },
      },
      select: {
        post: {
          select: {
            ...PostMapper.defautFields,
            ...PostMapper.likeFields(payload.id),
            ...PostMapper.countField,
            parent: {
              select: {
                author: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
    const count = await this.prisma.likePost.count({
      where: {
        user: {
          username,
        },
      },
    });
    return {
      count,
      items: posts.map(({ post: { _count, likes, ...post } }) => ({
        ...post,
        ...PostMapper.separate({ _count, likes }),
      })),
    };
  }

  async getPosts({
    query,
    username,
    payload,
  }: {
    username: string;
    query: PaginationDto;
    payload: JwtPayload;
  }): Promise<FindManyPostEntity> {
    const { limit = 50, offset = 0 } = query;
    const posts = await this.prisma.post.findMany({
      where: {
        author: {
          username,
        },
      },
      select: {
        ...PostMapper.defautFields,
        ...PostMapper.likeFields(payload.id),
        ...PostMapper.countField,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const count = await this.prisma.post.count({
      where: {
        author: {
          username,
        },
      },
    });
    return {
      count,
      items: posts.map(({ _count, likes, ...post }) => ({
        ...post,
        ...PostMapper.separate({ _count, likes }),
      })),
    };
  }

  async getComments({
    username,
    query,
    payload,
  }: {
    username: string;
    query: PaginationDto;
    payload: JwtPayload;
  }): Promise<GetUserCommentsEntity> {
    const { limit = 50, offset = 0 } = query;
    const posts = await this.prisma.post.findMany({
      where: {
        author: {
          username,
        },
        parentId: {
          not: null,
        },
      },
      select: {
        ...PostMapper.defautFields,
        ...PostMapper.likeFields(payload.id),
        ...PostMapper.countField,
        parent: {
          select: {
            author: {
              select: {
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
    const count = await this.prisma.post.count({
      where: {
        author: {
          username,
        },
        parentId: {
          not: null, // Somente comentários (posts que são respostas)
        },
      },
    });
    return {
      count,
      items: posts.map(({ _count, likes, ...post }) => ({
        ...post,
        ...PostMapper.separate({ _count, likes }),
      })),
    };
  }
}
