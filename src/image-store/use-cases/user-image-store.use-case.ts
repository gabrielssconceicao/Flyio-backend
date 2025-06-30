import { Injectable } from '@nestjs/common';
import { DeleteImage, ImageStoreUseCase } from './image-store.use-case';
import { ImageStoreTypeFolder } from '../image-store.constants';

type UploadUserImage = {
  file: Express.Multer.File;
  folder: ImageStoreTypeFolder;
};
type UpdateUserImage = UploadUserImage & {
  filename: string;
};

@Injectable()
export class UserImageStoreUseCase extends ImageStoreUseCase {
  async uploadUserImage({ file, folder }: UploadUserImage): Promise<string> {
    const { buffer, originalname } = file;
    return this.uploadToCloudinary(buffer, {
      resource_type: 'image',
      folder: this.getImageStoreFolder(folder),
      public_id: this.renameFile(originalname),
    });
  }

  async updateUserImage({
    filename,
    folder,
    file,
  }: UpdateUserImage): Promise<string> {
    const { buffer } = file;
    const fileId = this.extractIdFromImageUrl(filename);
    return this.uploadToCloudinary(buffer, {
      resource_type: 'image',
      folder: this.getImageStoreFolder(folder),
      public_id: fileId,
      overwrite: true,
    });
  }

  async deleteUserImage({
    fileUrl,
    folder,
  }: DeleteImage): Promise<{ result: string }> {
    return this.deleteImage({ fileUrl, folder });
  }
}
