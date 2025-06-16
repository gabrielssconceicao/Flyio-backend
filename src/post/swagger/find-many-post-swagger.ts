import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { FindManyPostEntity } from '../entities/find-many.entity';
import { ProtectedRouteSwaggerDocFunc } from '@/common/utils/protected-route-swagger';

export const FindManyPostSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Search Posts by text or get limited posts' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Posts found successfully',
      type: FindManyPostEntity,
    })(target, propertyKey, descriptor);
    ApiCookieAuth('access_token')(target, propertyKey, descriptor);
    ProtectedRouteSwaggerDocFunc()(target, propertyKey, descriptor);
  };
};
