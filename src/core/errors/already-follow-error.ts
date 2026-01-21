export class AlreadyFollowingError extends Error {
  constructor() {
    super('You are already following this user.');
  }
}

export class NotFollowingError extends Error {
  constructor() {
    super('You are not following this user.');
  }
}
