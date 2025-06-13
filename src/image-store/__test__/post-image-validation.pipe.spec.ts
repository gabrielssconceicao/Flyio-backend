import {
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { fileMock } from '../mock/file.mock';
import { PostImageValidatorPipe } from '../pipes/post-image-validatitor.pipe';

describe('PostImageValidatorPipe', () => {
  let pipe: PostImageValidatorPipe;
  let files: Express.Multer.File[];
  let mimetype: string[];
  beforeEach(() => {
    mimetype = ['image/jpeg', 'image/png'];
    pipe = new PostImageValidatorPipe();
    files = [fileMock()];
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });
  it('should return the files', () => {
    const result = pipe.transform(files, {} as any);
    expect(result).toEqual(files);
    expect(result).toMatchSnapshot();
  });
  it('should return an empty array if the files is empty', () => {
    const result = pipe.transform([], {} as any);
    expect(result).toEqual([]);
    expect(result).toMatchSnapshot();
  });

  it('should throw an error if the file is too big/small', () => {
    files[0].size = 11 * 1024 * 1024;
    expect(() => pipe.transform(files, {} as any)).toThrow(
      PayloadTooLargeException,
    );
    expect(() => pipe.transform(files, {} as any)).toThrow(
      'File too large. Maximum size: 10 MB',
    );
  });

  it('should throw an error if the file type is not allowed', () => {
    files[0].mimetype = 'application/pdf';
    expect(() => pipe.transform(files, {} as any)).toThrow(
      UnsupportedMediaTypeException,
    );
    expect(() => pipe.transform(files, {} as any)).toThrow(
      `Invalid file type. Allowed types: ${mimetype.join(', ')}`,
    );
  });
});
