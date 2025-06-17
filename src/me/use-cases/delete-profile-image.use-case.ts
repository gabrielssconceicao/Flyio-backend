import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';
import { MeUseCase } from './me.use-case';
import { BadRequestException } from '@nestjs/common';
import { Id } from './types';

export class DeleteProfileImageUseCase extends MeUseCase {
  async execute({ id }: Id) {
    const user = (await this.prisma.user.findUnique({
      where: {
        id: id,
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
        id: id,
      },
      data: {
        profileImg: null,
      },
    });
    return;
  }
}
