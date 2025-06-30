import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { GetUserPostsEntity } from '../entities';

export const GetUserPostsSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Get posts of a user' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiParam({
      name: 'username',
      type: String,
      required: true,
      example: 'jdoe',
    })(target, propertyKey, descriptor);

    ApiQuery({ name: 'limit', required: false })(
      target,
      propertyKey,
      descriptor,
    );
    ApiQuery({ name: 'offset', required: false })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Users found successfully',
      type: GetUserPostsEntity,
    })(target, propertyKey, descriptor);
  };
};
