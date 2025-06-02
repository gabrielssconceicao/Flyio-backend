import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { SearchUserEntity } from '../entities/search-user.entity';

const msgs = (string: 'followings' | 'followed') => {
  if (string === 'followings') {
    return 'Get users that are following a by user';
  } else {
    return 'Get Users that follows a user';
  }
};

export const FollowUsersSwaggerDoc = (string: 'followings' | 'followed') => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: msgs(string) })(target, propertyKey, descriptor);
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
      description: 'Users found successfully',
      type: SearchUserEntity,
    })(target, propertyKey, descriptor);
  };
};
