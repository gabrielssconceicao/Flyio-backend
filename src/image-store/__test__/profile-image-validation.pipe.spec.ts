import {
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { fileMock } from '../mock/file.mock';
import { ProfileImageValidatorPipe } from '../pipes/profile-image-validatitor.pipe';
describe('ProfileImageValidatorPipe', () => {
  let pipe: ProfileImageValidatorPipe;
  let file: Express.Multer.File;
  let mimeType: string[];

  beforeEach(() => {
    pipe = new ProfileImageValidatorPipe();
    file = fileMock();
    mimeType = ['image/jpeg', 'image/png'];
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should validate file', () => {
    const result = pipe.transform(file, {} as any);
    expect(result).toEqual(file);
    expect(result).toMatchSnapshot();
  });

  it('should return null if the file is null', () => {
    const result = pipe.transform(undefined, {} as any);
    expect(result).toBeNull();
    expect(result).toMatchSnapshot();
  });

  it('should throw an PayloadTooLargeException if the file is too small or too big', () => {
    file.size = 9 * 1024;
    expect(() => pipe.transform(file, {} as any)).toThrow(
      PayloadTooLargeException,
    );
    expect(() => pipe.transform(file, {} as any)).toThrow(
      'File too small. Minimum size: 10 KB',
    );

    file.size = 6 * 1024 * 1024;
    expect(() => pipe.transform(file, {} as any)).toThrow(
      PayloadTooLargeException,
    );
    expect(() => pipe.transform(file, {} as any)).toThrow(
      'File too large. Maximum size: 5 MB',
    );
  });

  it('should throw an error if the file type is not allowed', () => {
    file.mimetype = 'application/pdf';
    expect(() => pipe.transform(file, {} as any)).toThrow(
      UnsupportedMediaTypeException,
    );
    expect(() => pipe.transform(file, {} as any)).toThrow(
      `Invalid file type. Allowed types: ${mimeType.join(', ')}`,
    );
  });
});
