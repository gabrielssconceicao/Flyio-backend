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
          message: 'Invalid token',
          error: 'Unauthorized',
        },
      },
    })(target);
  };
};
