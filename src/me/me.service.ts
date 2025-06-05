import { Injectable } from '@nestjs/common';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { PrismaService } from '@/prisma/prisma.service';
import { HashingService } from '@/hash/hashing.service';
import { MeMapper } from './me.mapper';
import { UpdateMeDto } from './dto/update-me.dto';
import { CurrentUserEntity } from './entities/current-user.entity';
import { ImageStoreService } from '@/image-store/image-store.service';

type Count = { _count: { followers: number; following: number } };

type UpdateProfileImageParams = {
  profileImage: Express.Multer.File | null;
  bannerImage: Express.Multer.File | null;
};
type UpdateMeParams = {
  payload: JwtPayload;
  updateMeDto: UpdateMeDto;
};

type UpdateProfileImageAndMeParams = UpdateMeParams & UpdateProfileImageParams;
@Injectable()
export class MeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
    private readonly imageStore: ImageStoreService,
  ) {}

  async getMe(payload: JwtPayload): Promise<{ user: CurrentUserEntity }> {
    const user = (await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: { ...MeMapper.defaultFields, ...MeMapper.followCountFields },
    })) as CurrentUserEntity & Count;

    const { _count, ...userWithoutCount } = user;
    return {
      user: { ...userWithoutCount, ...MeMapper.separateCount({ _count }) },
    };
  }

  async updateMe({
    payload,
    updateMeDto,
    bannerImage,
    profileImage,
  }: UpdateProfileImageAndMeParams): Promise<{ user: CurrentUserEntity }> {
    const { bio, name, password } = updateMeDto;
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await this.hashing.hash(password);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        bannerImg: true,
        profileImg: true,
      },
    });

    const { avatar, banner } = await this.updateImages({
      bannerImage,
      profileImage,
      user: {
        bannerImg: user?.bannerImg,
        profileImg: user?.profileImg,
      },
    });

    const updatedUser = (await this.prisma.user.update({
      where: {
        id: payload.id,
      },
      data: {
        bio,
        name,
        password: hashedPassword,
        bannerImg: banner,
        profileImg: avatar,
      },
      select: { ...MeMapper.defaultFields, ...MeMapper.followCountFields },
    })) as CurrentUserEntity & Count;

    const { _count, ...userWithoutCount } = updatedUser;

    return {
      user: { ...userWithoutCount, ...MeMapper.separateCount({ _count }) },
    };
  }

  async desactivateMe(payload: JwtPayload) {
    await this.prisma.user.update({
      where: {
        id: payload.id,
      },
      data: {
        isActive: false,
      },
    });

    return;
  }

  private async updateImages({
    bannerImage,
    profileImage,
    user,
  }: UpdateProfileImageParams & {
    user: {
      bannerImg: string | null | undefined;
      profileImg: string | null | undefined;
    };
  }) {
    // separate into separate functions
    let banner: string | undefined = undefined;
    let avatar: string | undefined = undefined;

    if (profileImage) {
      if (user?.profileImg) {
        avatar = await this.imageStore.updateProfileImage({
          file: profileImage,
          folder: 'profile',
          filename: user.profileImg,
        });
      } else {
        avatar = await this.imageStore.uploadProfileImage({
          file: profileImage,
          folder: 'profile',
        });
      }
    }

    if (bannerImage) {
      if (user?.bannerImg) {
        banner = await this.imageStore.updateProfileImage({
          file: bannerImage,
          folder: 'banner',
          filename: user.bannerImg,
        });
      } else {
        banner = await this.imageStore.uploadProfileImage({
          file: bannerImage,
          folder: 'banner',
        });
      }
    }

    return {
      banner,
      avatar,
    };
  }
}
