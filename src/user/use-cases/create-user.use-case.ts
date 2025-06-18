import { ConflictException, Injectable } from '@nestjs/common';

import { HashingService } from '@/hash/hashing.service';
import { UserImageStoreUseCase } from '@/image-store/use-cases';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';
import { PrismaService } from '@/prisma/prisma.service';

import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../user.mapper';
import { CreateUserParams } from './types';
import { UserUseCase } from './user.use-case';

type CheckUserParams = {
  username?: string;
  email?: string;
};

@Injectable()
export class CreateUserUseCase extends UserUseCase {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly hashing: HashingService,
    private readonly imageStore: UserImageStoreUseCase,
  ) {
    super(prisma);
  }
  async execute({
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
      avatar = await this.imageStore.uploadUserImage({
        file: profileImage,
        folder: ImageStoreTypeFolder.PROFILE,
      });
    }

    let banner: string | null = null;

    if (bannerImage) {
      banner = await this.imageStore.uploadUserImage({
        file: bannerImage,
        folder: ImageStoreTypeFolder.BANNER,
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
    console.log({ existingUser });
    return !!existingUser;
  }
}
