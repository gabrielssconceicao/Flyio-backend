import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CommentPostEntity } from '../entities';

export const CommentPostSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Comments a poster' })(
      target,
      propertyKey,
      descriptor,
    );

    ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);
    ApiParam({
      name: 'postId',
      type: String,
      required: true,
    })(target, propertyKey, descriptor);
    ApiBody({
      description: 'Poster body creation',
      schema: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            description: 'Post content',
            example: 'This is a post',
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
            description: 'Image files (PNG or JPEG)',
          },
        },
        required: ['content'],
      },
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Post created successfully',
      type: CommentPostEntity,
    })(target, propertyKey, descriptor);

    ApiResponse({
      status: HttpStatus.PAYLOAD_TOO_LARGE,
      description: 'File is too large/small',
      schema: {
        example: {
          statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
          message: 'Payload too large',
          error: 'Payload too large',
        },
      },
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      description: 'Unsupported media type',
      schema: {
        example: {
          statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          message: 'Unsupported media type',
          error: 'Unsupported Media Type',
        },
      },
    })(target, propertyKey, descriptor);
  };
};
