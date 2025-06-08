import { BadRequestException, Injectable } from '@nestjs/common';
import { ImageStoreFolders, ImageFolder } from './image-store.constants';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/env';

@Injectable()
export class ImageStoreService {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  private uploadToCloudinary(
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
        console.log('Then', result);
        return result;
      })
      .catch(() => {
        throw new BadRequestException('Error uploading image');
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
    return parts[parts.length - 1].split('.')[0];
  }

  async uploadProfileImage({
    file,
    folder,
  }: {
    file: Express.Multer.File;
    folder: ImageFolder;
  }): Promise<string> {
    const { buffer, originalname } = file;
    return this.uploadToCloudinary(buffer, {
      resource_type: 'image',
      folder: this.getImageStoreFolder(folder),
      public_id: this.renameFile(originalname),
    });
  }

  async updateProfileImage({
    filename,
    folder,
    file,
  }: {
    filename: string;
    folder: ImageFolder;
    file: Express.Multer.File;
  }): Promise<string> {
    const { buffer } = file;
    const fileId = this.extractIdFromImageUrl(filename);
    return this.uploadToCloudinary(buffer, {
      resource_type: 'image',
      folder: this.getImageStoreFolder(folder),
      public_id: `${fileId}`,
      overwrite: true,
    });
  }

  private getImageStoreFolder(key: ImageFolder) {
    switch (key) {
      case 'BANNER':
        return ImageStoreFolders.BANNER;
      case 'PROFILE':
        return ImageStoreFolders.PROFILE;
    }
  }
}
