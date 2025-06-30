import { Injectable } from '@nestjs/common';
import { LikePostUseCase, DislikePostUseCase } from './use-cases';
import { Like } from './use-cases/type';

@Injectable()
export class LikesService {
  constructor(
    private readonly likePost: LikePostUseCase,
    private readonly dislike: DislikePostUseCase,
  ) {}

  async like({ payload, postId }: Like): Promise<void> {
    return this.likePost.execute({ payload, postId });
  }

  async deslike({ payload, postId }: Like) {
    return this.dislike.execute({ payload, postId });
  }
}
