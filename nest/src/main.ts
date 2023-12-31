import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  const logger = new Logger('NestApplication');

  await app.listen(process.env.PORT || 3000, () => {
    logger.log(`Server started on port ${process.env.PORT || 3000}`);
  });
}
bootstrap();
