import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from '@/hash/hashing.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserMapper } from './user.mapper';
import { UserEntity } from './entities/user.entity';
import { FindOneUserEntity } from './entities/find-one-user.entity';
import { QueryParamDto } from '@/common/dto/query-param.dto';
import { SearchUserEntity } from './entities/search-user.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { ImageStoreService } from '@/image-store/image-store.service';

type CheckUserParams = {
  username?: string;
  email?: string;
};

type CreateUserParams = {
  createUserDto: CreateUserDto;
  profileImage: Express.Multer.File | null;
  bannerImage: Express.Multer.File | null;
};

@Injectable()
export class UserService {
  constructor(
    private readonly hashing: HashingService,
    private readonly prisma: PrismaService,
    private readonly imageStore: ImageStoreService,
  ) {}

  async create({
    createUserDto,
    bannerImage,
    profileImage,
  }: CreateUserParams): Promise<UserEntity> {
    const { email, name, username, bio, password } = createUserDto;

    const isTaken = await this.isUserOrEmailTaken({
      username,
      email,
    });

    if (isTaken) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }
    const hashedPassword = await this.hashing.hash(password);

    let avatar: string | null = null;

    if (profileImage) {
      avatar = await this.imageStore.uploadProfileImage({
        file: profileImage,
        folder: 'profile',
      });
    }

    let banner: string | null = null;

    if (bannerImage) {
      banner = await this.imageStore.uploadProfileImage({
        file: bannerImage,
        folder: 'banner',
      });
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        username,
        bio,
        password: hashedPassword,
        profileImg: avatar,
        bannerImg: banner,
      },
      select: UserMapper.createUserFields,
    });

    return user;
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

    return { count, users };
  }

  async findOne(username: string): Promise<{ user: FindOneUserEntity }> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: UserMapper.findUserFields,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { _count, ...rest } = user;

    return {
      user: {
        ...rest,
        followers: _count.followers,
        following: _count.following,
      },
    };
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
      users: following.map((follow) => follow.followed),
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
      users: followers.map((follow) => follow.follower),
    };
  }

  private async isUserOrEmailTaken(params: CheckUserParams): Promise<boolean> {
    const conditions: any[] = [];

    if (params.username) {
      conditions.push({ username: params.username });
    }

    if (params.email) {
      conditions.push({ email: params.email });
    }

    if (conditions.length === 0) {
      return false;
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: conditions,
      },
    });

    return !!existingUser;
  }
}
