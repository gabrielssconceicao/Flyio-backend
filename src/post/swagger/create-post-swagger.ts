import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { PostEntity } from '../entities/post.entity';

class CreateUser extends PostEntity {
  @ApiProperty({
    type: String,
    description: 'Parent post ID',
    nullable: true,
    example: null,
  })
  declare parentId: string | null;
}

export const CreatePostSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Creates a new poster' })(
      target,
      propertyKey,
      descriptor,
    );

    ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);
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
      type: CreateUser,
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
