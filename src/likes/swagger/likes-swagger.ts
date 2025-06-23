import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const LikePostSwaggerDoc = (type: 'like' | 'dislike') => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: `${type} a user` })(
      target,
      propertyKey,
      descriptor,
    );
    ApiParam({
      name: 'postId',
      type: String,
      required: true,
    })(target, propertyKey, descriptor);

    ApiResponse({
      status: type === 'like' ? HttpStatus.CREATED : HttpStatus.NO_CONTENT,
      description: `Post ${type}d successfully`,
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: `Error ${type} post`,
      schema: {
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: `Post already ${type}d`,
        },
      },
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Post not found',
      schema: {
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Post not found',
          error: 'Not Found',
        },
      },
    })(target, propertyKey, descriptor);
  };
};
