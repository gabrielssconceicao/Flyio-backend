import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';
import { MeUseCase } from './me.use-case';
import { BadRequestException } from '@nestjs/common';
import { Id } from './types';

export class DeleteBannerImageUseCase extends MeUseCase {
  async execute({ id }: Id) {
    const user = (await this.prisma.user.findUnique({
      where: {
        id: id,
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
        id: id,
      },
      data: {
        bannerImg: null,
      },
    });

    return;
  }
}
