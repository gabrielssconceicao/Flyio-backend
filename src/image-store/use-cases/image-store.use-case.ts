import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/env';
import {
  ImageStoreFolders,
  ImageStoreTypeFolder,
} from '../image-store.constants';

export type DeleteImage = {
  fileUrl: string;
  folder: ImageStoreTypeFolder;
};

@Injectable()
export class ImageStoreUseCase {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  protected async uploadToCloudinary(
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

  protected async deleteFromCloudinary(
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

  protected renameFile(fileName: string): string {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileNameWithoutExtension = fileName
      .split('.')
      .slice(0, -1)
      .join('.')
      .toLowerCase();
    return `file_${uniqueSuffix}_${fileNameWithoutExtension}`;
  }

  protected extractIdFromImageUrl(imageUrl: string): string {
    const parts = imageUrl.split('/');
    const fileId = parts[parts.length - 1].split('.')[0];
    return fileId;
  }

  protected getImageStoreFolder(key: ImageStoreTypeFolder): string {
    switch (key) {
      case ImageStoreTypeFolder.BANNER:
        return ImageStoreFolders.BANNER;
      case ImageStoreTypeFolder.PROFILE:
        return ImageStoreFolders.PROFILE;
      default:
        return ImageStoreFolders.POST;
    }
  }

  protected async deleteImage({
    fileUrl,
    folder,
  }: DeleteImage): Promise<{ result: string }> {
    const fileId = this.extractIdFromImageUrl(fileUrl);
    return this.deleteFromCloudinary(
      `${this.getImageStoreFolder(folder)}/${fileId}`,
    );
  }
}
