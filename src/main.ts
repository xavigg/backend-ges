import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const APP_PORT = process.env.APP_PORT || 4444;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('E-commerce')
    .setDescription('The e-commerce docs')
    .setVersion('1.0')
    .addTag('E-Commerce App Docs')
    .addCookieAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors({
    origin: 'http://localhost:3000', // Asegúrate de reemplazar esto con la URL de tu frontend
    credentials: true, // Para permitir el envío de cookies y autenticación basada en sesiones
  });

  await app.listen(APP_PORT);

  Logger.log(`🚀 Server en linea [Puerto: ${APP_PORT}]`);
}
bootstrap();
