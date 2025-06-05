import { BadRequestException, Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import {
  BANNER_IMAGE_FOLDER,
  PROFILE_IMAGE_FOLDER,
  UserImageFolder,
} from './image-store.constants';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
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
      try {
        // Create a Readable stream from the buffer
        const bufferStream = Readable.from(buffer);

        // Upload config to Cloudinary

        const uploadStream = cloudinary.uploader.upload_stream(
          uploadConfig,
          (error, result: UploadApiResponse) => {
            if (error) {
              reject(
                new BadRequestException(
                  'Error uploading/updating profile picture.',
                ),
              );
            } else {
              // Retornar a URL segura da imagem após o upload
              resolve(result.secure_url);
            }
          },
        );

        // Passar o stream para o upload
        bufferStream.pipe(uploadStream);
      } catch (error) {
        console.error(error);
        reject(new BadRequestException('Error uploading profile picture.'));
      }
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
    folder: UserImageFolder;
  }): Promise<string> {
    const { buffer, originalname } = file;
    return this.uploadToCloudinary(buffer, {
      resource_type: 'image',
      folder: folder === 'profile' ? PROFILE_IMAGE_FOLDER : BANNER_IMAGE_FOLDER,
      public_id: this.renameFile(originalname),
    });
  }

  async updateProfileImage({
    filename,
    folder,
    file,
  }: {
    filename: string;
    folder: UserImageFolder;
    file: Express.Multer.File;
  }): Promise<string> {
    const { buffer } = file;
    const fileId = this.extractIdFromImageUrl(filename);
    return this.uploadToCloudinary(buffer, {
      resource_type: 'image',
      folder: folder === 'profile' ? PROFILE_IMAGE_FOLDER : BANNER_IMAGE_FOLDER,
      public_id: fileId,
      overwrite: true,
    });
  }
}
