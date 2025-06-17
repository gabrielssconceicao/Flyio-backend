import { Injectable } from '@nestjs/common';
import { MeUseCase } from './me.use-case';
import { CurrentUserEntity } from '../entities/current-user.entity';
import { MeMapper } from '../me.mapper';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';
import {
  Count,
  UpdateProfileImageAndMeParams,
  UpdateProfileImageParams,
} from './types';

@Injectable()
export class UpdateMeUseCase extends MeUseCase {
  async execute({
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
    const updatedUser = await this.prisma.user.update({
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
    });

    const { _count, ...userWithoutCount } = updatedUser as CurrentUserEntity &
      Count;

    return {
      user: { ...userWithoutCount, ...MeMapper.separateCount({ _count }) },
    };
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
