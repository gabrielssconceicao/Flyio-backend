type FollowYourselfMessage = 'follow' | 'unfollow';
export class FollowYourselfError extends Error {
  constructor(message: FollowYourselfMessage) {
    super(`You cannot ${message} yourself.`);
  }
}
