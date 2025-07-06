import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const ReactivateAccountSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Reactivate account' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiQuery({
      name: 'code',
      required: true,
      type: String,
      example: '123456',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Account reactivated successfully',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Link invalid or expired',
      schema: {
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Link invalid or expired',
          error: 'Bad Request',
        },
      },
    })(target, propertyKey, descriptor);
  };
};
