import { Injectable } from '@nestjs/common';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { PrismaService } from '@/prisma/prisma.service';
import { HashingService } from '@/hash/hashing.service';
import { MeMapper } from './me.mapper';
import { UpdateMeDto } from './dto/update-me.dto';
import { CurrentUserEntity } from './entities/current-user.entity';
import { ImageStoreService } from '@/image-store/image-store.service';

type Count = { _count: { followers: number; following: number } };

type UpdateMeParams = {
  profileImage: Express.Multer.File | null;
  bannerImage: Express.Multer.File | null;
  payload: JwtPayload;
  updateMeDto: UpdateMeDto;
};
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
  }: UpdateMeParams): Promise<{ user: CurrentUserEntity }> {
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
        avatar = await this.imageStore.uploadProfileImage(
          profileImage,
          'profile',
        );
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
        banner = await this.imageStore.uploadProfileImage(
          bannerImage,
          'banner',
        );
      }
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
}
