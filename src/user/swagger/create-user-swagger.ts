import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

export const CreateUserSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Creates a new user' })(
      target,
      propertyKey,
      descriptor,
    );

    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User created successfully',
      type: UserEntity,
    })(target, propertyKey, descriptor);

    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'User with this email or username already exists',
      schema: {
        example: {
          statusCode: HttpStatus.CONFLICT,
          message:
            'This email or username is already associated with an existing account',
          error: 'Conflict',
        },
      },
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
