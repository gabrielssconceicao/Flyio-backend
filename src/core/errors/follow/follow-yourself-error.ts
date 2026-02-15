import { ApplicationError } from '../application-error';

type FollowYourselfMessage = 'follow' | 'unfollow';
export class FollowYourselfError extends ApplicationError {
  statusCode = 409;
  constructor(message: FollowYourselfMessage) {
    super(`You cannot ${message} yourself.`);
  }
}
