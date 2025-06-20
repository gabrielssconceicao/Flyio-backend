import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { ProtectedRouteSwaggerDocFunc } from '@/common/utils/protected-route-swagger';

export const GetUserRepliesSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Get user replies' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiParam({
      name: 'username',
      type: String,
      required: true,
    })(target, propertyKey, descriptor);

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
      description: 'Replies found successfully',
    })(target, propertyKey, descriptor);
    ApiCookieAuth('access_token')(target, propertyKey, descriptor);
    ProtectedRouteSwaggerDocFunc()(target, propertyKey, descriptor);
  };
};
