import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserMapper } from './user.mapper';
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
import { GetUserUseCase } from './use-cases/get-user.use-case';
import { CreateUserParams } from './use-cases/types';
import { CreateUserUseCase } from './use-cases/create-user.use-case';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getUser: GetUserUseCase,
    private readonly createUser: CreateUserUseCase,
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

  async findOne(username: string): Promise<{ user: FindOneUserEntity }> {
    return this.getUser.execute({ username });
  }

  async getFollowings({
    username,
    query,
  }: {
    username: string;
    query: PaginationDto;
  }): Promise<SearchUserEntity> {
    const { limit = 20, offset = 0 } = query;

    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const following = await this.prisma.follow.findMany({
      where: {
        userId: user.id,
      },
      select: {
        followed: {
          select: UserMapper.searchUserFields,
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const count = await this.prisma.follow.count({
      where: {
        userId: user.id,
      },
    });

    return {
      count,
      items: following.map((follow) => follow.followed),
    };
  }

  async getFollowers({
    username,
    query,
  }: {
    username: string;
    query: PaginationDto;
  }): Promise<SearchUserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const followers = await this.prisma.follow.findMany({
      where: {
        followingUserId: user.id,
      },
      select: {
        follower: {
          select: UserMapper.searchUserFields,
        },
      },
      take: query.limit,
      skip: query.offset,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const count = await this.prisma.follow.count({
      where: {
        followingUserId: user.id,
      },
    });

    return {
      count,
      items: followers.map((follow) => follow.follower),
    };
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
