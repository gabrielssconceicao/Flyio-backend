import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { PrismaService } from '@/prisma/prisma.service';
import { HashingService } from '@/hash/hashing.service';
import { ImageStoreService } from '@/image-store/image-store.service';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';
import { MeMapper } from './me.mapper';
import { UpdateMeDto } from './dto/update-me.dto';
import { CurrentUserEntity } from './entities/current-user.entity';

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

    let avatar: string | undefined = undefined;
    let banner: string | undefined = undefined;
    if (bannerImage || profileImage) {
      const data = await this.updateImages({
        bannerImage,
        profileImage,
        userId: payload.id,
      });

      banner = data.banner;
      avatar = data.avatar;
    }
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

  async deleteProfileImage({
    payload,
  }: {
    payload: JwtPayload;
  }): Promise<void> {
    const user = (await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        profileImg: true,
      },
    })) as { profileImg: string };
    const { result } = await this.imageStore.deleteUserImage({
      fileUrl: user?.profileImg,
      folder: ImageStoreTypeFolder.PROFILE,
    });

    if (result !== 'ok') {
      throw new BadRequestException('Error deleting profile image');
    }

    await this.prisma.user.update({
      where: {
        id: payload.id,
      },
      data: {
        profileImg: null,
      },
    });
  }

  async deleteBannerImage({ payload }: { payload: JwtPayload }): Promise<void> {
    const user = (await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        bannerImg: true,
      },
    })) as { bannerImg: string };
    const { result } = await this.imageStore.deleteUserImage({
      fileUrl: user?.bannerImg,
      folder: ImageStoreTypeFolder.BANNER,
    });

    if (result !== 'ok') {
      throw new BadRequestException('Error deleting banner image');
    }

    await this.prisma.user.update({
      where: {
        id: payload.id,
      },
      data: {
        bannerImg: null,
      },
    });
  }

  private async updateImages({
    bannerImage,
    profileImage,
    userId,
  }: UpdateProfileImageParams & {
    userId: string;
  }) {
    let banner: string | undefined = undefined;
    let avatar: string | undefined = undefined;

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        bannerImg: true,
        profileImg: true,
      },
    });
    if (profileImage) {
      if (user?.profileImg) {
        avatar = await this.imageStore.updateUserImage({
          file: profileImage,
          folder: ImageStoreTypeFolder.PROFILE,
          filename: user.profileImg,
        });
      } else {
        avatar = await this.imageStore.uploadUserImage({
          file: profileImage,
          folder: ImageStoreTypeFolder.PROFILE,
        });
      }
    }

    if (bannerImage) {
      if (user?.bannerImg) {
        banner = await this.imageStore.updateUserImage({
          file: bannerImage,
          folder: ImageStoreTypeFolder.BANNER,
          filename: user.bannerImg,
        });
      } else {
        banner = await this.imageStore.uploadUserImage({
          file: bannerImage,
          folder: ImageStoreTypeFolder.BANNER,
        });
      }
    }

    return {
      banner,
      avatar,
    };
  }
}
