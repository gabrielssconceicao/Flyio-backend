import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CurrentUserEntity } from '../entities/current-user.entity';

export const GetMeSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Get current user' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User found successfully',
      type: CurrentUserEntity,
    })(target, propertyKey, descriptor);
  };
};
