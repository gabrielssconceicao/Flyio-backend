import { ErrorCode } from './error-code';

export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: ErrorCode;
  abstract readonly identifier: string;
}
