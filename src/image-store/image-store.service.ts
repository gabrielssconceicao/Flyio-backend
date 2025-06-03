import { Injectable } from '@nestjs/common';
import { configuration } from './image-store.config';
import { ConfigOptions } from 'cloudinary';

@Injectable()
export class ImageStoreService {
  private config: ConfigOptions;
  constructor() {
    this.config = configuration;
  }
}
