import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { FindOneUserEntity } from '../entities/find-one-user.entity';

export const GetUserSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Get user by username' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiParam({
      name: 'username',
      type: String,
      required: true,
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User found successfully',
      type: FindOneUserEntity,
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found',
      schema: {
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not Found',
        },
      },
    })(target, propertyKey, descriptor);
  };
};
