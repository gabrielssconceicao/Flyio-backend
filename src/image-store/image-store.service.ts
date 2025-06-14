import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/env';
import {
  ImageStoreFolders,
  ImageStoreTypeFolder,
} from './image-store.constants';

type UploadUserImage = {
  file: Express.Multer.File;
  folder: ImageStoreTypeFolder;
};
type UpdateUserImage = UploadUserImage & {
  filename: string;
};

type DeleteImage = {
  fileUrl: string;
  folder: ImageStoreTypeFolder;
};

type PostImages = {
  files: Express.Multer.File[];
  folder: ImageStoreTypeFolder;
};

type DeletePostImages = {
  files: string[];
};

@Injectable()
export class ImageStoreService {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  private async uploadToCloudinary(
    buffer: Buffer,
    uploadConfig: any,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(uploadConfig, (error, uploadResult) => {
          if (error) {
            reject(error);
          }
          return resolve(uploadResult && uploadResult.secure_url);
        })
        .end(buffer);
    })
      .then((result: string) => {
        return result;
      })
      .catch(() => {
        throw new BadRequestException('Error uploading image');
      });
  }

  private async deleteFromCloudinary(
    publicId: string,
  ): Promise<{ result: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        }
        return resolve(result);
      });
    })
      .then((result: { result: string }) => {
        return result;
      })
      .catch(() => {
        throw new BadRequestException('Error deleting image');
      });
  }

  private renameFile(fileName: string): string {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileNameWithoutExtension = fileName
      .split('.')
      .slice(0, -1)
      .join('.')
      .toLowerCase();
    return `file_${uniqueSuffix}_${fileNameWithoutExtension}`;
  }

  private extractIdFromImageUrl(imageUrl: string): string {
    const parts = imageUrl.split('/');
    const fileId = parts[parts.length - 1].split('.')[0];
    return fileId;
  }

  private getImageStoreFolder(key: ImageStoreTypeFolder): string {
    switch (key) {
      case ImageStoreTypeFolder.BANNER:
        return ImageStoreFolders.BANNER;
      case ImageStoreTypeFolder.PROFILE:
        return ImageStoreFolders.PROFILE;
      default:
        return ImageStoreFolders.POST;
    }
  }

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

  async deleteImage({
    fileUrl,
    folder,
  }: DeleteImage): Promise<{ result: string }> {
    const fileId = this.extractIdFromImageUrl(fileUrl);
    return this.deleteFromCloudinary(
      `${this.getImageStoreFolder(folder)}/${fileId}`,
    );
  }

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
