import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { SendLinkDto } from '../dto/send-link.dto';

export const SendLinkSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Send reactivation link via email' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiBody({
      description: 'Email',
      type: SendLinkDto,
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Reactivation link sent successfully',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'email not registered',
      schema: {
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Email not registered',
          error: 'Not Found',
        },
      },
    })(target, propertyKey, descriptor);
  };
};
