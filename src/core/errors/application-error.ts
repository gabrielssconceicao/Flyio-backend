export abstract class ApplicationError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
  }
}
