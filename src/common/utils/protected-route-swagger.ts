import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ProtectedRouteSwaggerDoc = () => {
  return (target: any) => {
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid token',
      schema: {
        example: {
          statusCode: HttpStatus.UNAUTHORIZED,
          type: 'TokenExpired/InvalidToken',

          message: 'Invalid token',
          error: 'Unauthorized',
        },
      },
    })(target);
  };
};
export const ProtectedRouteSwaggerDocFunc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid token',
      schema: {
        example: {
          statusCode: HttpStatus.UNAUTHORIZED,
          type: 'TokenExpired/InvalidToken',

          message: 'Invalid token',
          error: 'Unauthorized',
        },
      },
    })(target, propertyKey, descriptor);
  };
};
