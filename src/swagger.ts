import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function docsSwagger(app: INestApplication) {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Flyio API')
    .setDescription('Flyio API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('doc/api', app, document);
  return app;
}
