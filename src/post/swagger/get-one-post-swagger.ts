import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { PostEntity } from '../entities/post.entity';

export const GetOnePostSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Get a poster by Id' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Post deleted successfully',
      type: PostEntity,
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Post not found',
      schema: {
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Post not found',
          error: 'Post not found',
        },
      },
    })(target, propertyKey, descriptor);
  };
};
