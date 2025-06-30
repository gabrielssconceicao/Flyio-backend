import { BadRequestException, Injectable } from '@nestjs/common';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';
import { MeUseCase } from './me.use-case';
import { Id } from './types';

@Injectable()
export class DeleteBannerImageUseCase extends MeUseCase<Id, void> {
  async execute({ id }: Id): Promise<void> {
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
