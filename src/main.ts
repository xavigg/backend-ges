import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

const APP_PORT = process.env.APP_PORT || 4444;

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );
  app.enableCors();

  await app.listen(APP_PORT);

  Logger.log(`🚀 Server en linea [Puerto: ${APP_PORT}]`);
}
bootstrap();
