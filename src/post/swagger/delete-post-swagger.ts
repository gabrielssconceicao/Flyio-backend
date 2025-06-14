import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const DeletePostSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Deletes a poster' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Post deleted successfully',
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
