import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const DeleteImageSwaggerDoc = (type: 'profile' | 'banner') => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: `Delete ${type} image` })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: `${type} image deleted successfully`,
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: `Error deleting ${type} image`,
      schema: {
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Error deleting ${type} image`,
          error: 'Bad Request',
        },
      },
    })(target, propertyKey, descriptor);
  };
};
