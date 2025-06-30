import { BadRequestException, Injectable } from '@nestjs/common';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';
import { MeUseCase } from './me.use-case';
import { Id } from './types';
@Injectable()
export class DeleteProfileImageUseCase extends MeUseCase<Id, void> {
  async execute({ id }: Id): Promise<void> {
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
