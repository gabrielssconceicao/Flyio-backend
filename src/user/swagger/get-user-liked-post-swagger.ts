import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { ProtectedRouteSwaggerDocFunc } from '@/common/utils/protected-route-swagger';
import { GetLikedPostEntity } from '../entities';

export const GetUserLikedPostSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Get liked post by a user' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiParam({
      name: 'username',
      type: String,
      required: true,
    })(target, propertyKey, descriptor);
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
      type: GetLikedPostEntity,
    })(target, propertyKey, descriptor);
    ApiCookieAuth('access_token')(target, propertyKey, descriptor);
    ProtectedRouteSwaggerDocFunc()(target, propertyKey, descriptor);
  };
};
