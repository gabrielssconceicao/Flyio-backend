import { ApplicationError } from './application-error';

export class ResourceNotFoundError extends ApplicationError {
  statusCode = 404;
  constructor(resource = 'Resource') {
    super(`${resource} not found.`);
  }
}
