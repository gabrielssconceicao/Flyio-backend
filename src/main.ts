import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { env } from '@/env';
import { ValidationPipe } from '@nestjs/common';
import { docsSwagger } from './swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(env.COOKIE_SECRET));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  docsSwagger(app);
  await app.listen(env.APP_PORT);
}
bootstrap();
