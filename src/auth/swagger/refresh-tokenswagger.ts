import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';

export const RefreshTokenSwaggerDoc = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiOperation({ summary: 'Refresh access token' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiCookieAuth('refresh_token')(target, propertyKey, descriptor);
  };
};
