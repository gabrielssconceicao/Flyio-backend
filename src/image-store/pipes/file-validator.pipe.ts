import {
  ArgumentMetadata,
  Injectable,
  PayloadTooLargeException,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

@Injectable()
export abstract class FileValidatorPipe implements PipeTransform {
  constructor(
    private readonly minSize = 10 * 1024,
    private readonly maxSize = 15 * 1024 * 1024,
    private readonly allowedMimeTypes: string[] = [],
  ) {}

  protected validateFileSize(size: number): void {
    if (size < this.minSize)
      throw new PayloadTooLargeException(
        `File too small. Minimum size: ${this.minSize / 1024} KB`,
      );
    if (size > this.maxSize)
      throw new PayloadTooLargeException(
        `File too large. Maximum size: ${this.maxSize / (1024 * 1024)} MB`,
      );
  }
  protected validateMimeType(mimetype: string): void {
    if (!this.allowedMimeTypes.includes(mimetype)) {
      throw new UnsupportedMediaTypeException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }
  }

  protected validateFile(value: Express.Multer.File): void {
    const { size, mimetype } = value;
    this.validateFileSize(size);
    this.validateMimeType(mimetype);
  }

  abstract transform(
    value: Express.Multer.File | Express.Multer.File[] | undefined,
    metadata: ArgumentMetadata,
  );
}
