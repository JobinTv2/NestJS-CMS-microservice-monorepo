import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { LoggingInerceptor } from './interceptors/logging.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston/dist/winston.constants';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInerceptor());
  app.enableVersioning({
    type: VersioningType.MEDIA_TYPE,
    key: 'v=',
  });
  await app.listen(3000);
}
bootstrap();
