import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { SearchUserEntity } from '../entities';

export const SearchUsersSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Search users by name or username' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiQuery({ name: 'search', required: false })(
      target,
      propertyKey,
      descriptor,
    );
    ApiQuery({ name: 'limit', required: false })(
      target,
      propertyKey,
      descriptor,
    );
    ApiQuery({ name: 'offset', required: false })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Users found successfully',
      type: SearchUserEntity,
    })(target, propertyKey, descriptor);
  };
};
