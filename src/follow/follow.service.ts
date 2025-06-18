import { Injectable } from '@nestjs/common';
import { FollowUseCase, UnfollowUseCase } from './use-cases';
import { Follow } from './use-cases/type';

@Injectable()
export class FollowService {
  constructor(
    private readonly followUseCase: FollowUseCase,
    private readonly unfollowUseCase: UnfollowUseCase,
  ) {}

  async follow({ username, payload }: Follow) {
    return this.followUseCase.execute({ username, payload });
  }
  async unfollow({ username, payload }: Follow) {
    return this.unfollowUseCase.execute({ username, payload });
  }
}
