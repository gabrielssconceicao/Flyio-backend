import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CurrentUserEntity } from '../entities/current-user.entity';

export const UpdateMeSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Updates a user' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);
    ApiBody({
      description: 'Update user',
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the user',
            example: 'John Doe',
          },
          password: {
            type: 'string',
            description: 'Password of the user',
            example: 'password',
          },
          bio: {
            type: 'string',
            description: 'Bio of the user',
            example: 'I am a bio',
          },
          profileImg: {
            type: 'string',
            format: 'binary',
            description: 'Profile image file (PNG or JPEG)',
          },
          bannerImg: {
            type: 'string',
            format: 'binary',
            description: 'Banner image file (PNG or JPEG)',
          },
        },
      },
    })(target, propertyKey, descriptor);

    ApiResponse({
      status: HttpStatus.OK,
      description: 'User updated successfully',
      type: CurrentUserEntity,
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
