import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { COOKIE_ACCESS_TOKEN } from '@/auth/cookie.constant';

export const CookieTokenParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request: Request = ctx.switchToHttp().getRequest();

    const cookies = request.cookies[COOKIE_ACCESS_TOKEN] as string;
    return cookies;
  },
);
