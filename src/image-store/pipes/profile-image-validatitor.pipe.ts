import { ArgumentMetadata, Injectable } from '@nestjs/common';
import { FileValidatorPipe } from './file-validator.pipe';
@Injectable()
export class ProfileImageValidatorPipe extends FileValidatorPipe {
  constructor() {
    super(10 * 1024, 5 * 1024 * 1024, ['image/jpeg', 'image/png']);
  }
  transform(
    value: Express.Multer.File | undefined,
    metadata: ArgumentMetadata,
  ): null | Express.Multer.File {
    if (!value) {
      return null;
    }
    this.validateFile(value);
    return value;
  }
}
