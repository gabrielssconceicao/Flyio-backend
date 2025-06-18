import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

const msg = (type: 'follow' | 'unfollow') => {
  return type === 'follow'
    ? 'You are already following'
    : 'You are not following';
};

export const FollowUserSwaggerDoc = (type: 'follow' | 'unfollow') => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ description: `${type} a user` })(
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
      status: HttpStatus.CREATED,
      description: `User ${type}ed successfully`,
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: `Error ${type}ing user`,
      schema: {
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `${msg(type)} this user/ You cannot ${type} yourself`,
          error: 'Bad Request',
        },
      },
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
