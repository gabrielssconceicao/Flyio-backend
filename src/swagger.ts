import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function docsSwagger(app: INestApplication) {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Flyio API')
    .setDescription('Flyio API Documentation')
    .setVersion('1.0')
    .addCookieAuth('access_token', {
      type: 'http',
      in: 'cookie',
      name: 'access_token',
      description: 'JWT access token stored in the cookie',
    })
    .addCookieAuth('refresh_token', {
      type: 'http',
      in: 'cookie',
      name: 'refresh_token',
      description: 'JWT refresh token stored in the cookie',
    })
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('doc/api', app, document);
  return app;
}
