import { Injectable } from '@nestjs/common';
import { ImageStoreUseCase } from './image-store.use-case';
import { ImageStoreTypeFolder } from '../image-store.constants';

type PostImages = {
  files: Express.Multer.File[];
  folder: ImageStoreTypeFolder;
};

type DeletePostImages = {
  files: string[];
};
@Injectable()
export class PostImageStoreUseCase extends ImageStoreUseCase {
  async uploadPostImages({ files, folder }: PostImages): Promise<string[]> {
    const uploadedFiles: string[] = [];
    try {
      const promises = files.map(async (file) => {
        const { buffer, originalname } = file;
        const image = await this.uploadToCloudinary(buffer, {
          resource_type: 'image',
          folder: this.getImageStoreFolder(folder),
          public_id: this.renameFile(originalname),
        });
        uploadedFiles.push(image);
      });
      await Promise.all(promises);
    } catch {
      await Promise.all(
        uploadedFiles.map((file) =>
          this.deleteImage({ fileUrl: file, folder }),
        ),
      );
    }
    return uploadedFiles;
  }

  deletePostImages({ files }: DeletePostImages) {
    const promises = files.map((file) =>
      this.deleteImage({ fileUrl: file, folder: ImageStoreTypeFolder.POST }),
    );
    return Promise.all(promises);
  }
}
