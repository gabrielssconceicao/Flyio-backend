import { HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const SignInSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Sign in user' })(target, propertyKey, descriptor);

    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User signed in successfully',
      schema: {
        example: {
          message: 'Login successful',
        },
      },
    })(target, propertyKey, descriptor);

    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid credentials',
      schema: {
        example: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
          error: 'Unauthorized',
        },
      },
    })(target, propertyKey, descriptor);
  };
};
