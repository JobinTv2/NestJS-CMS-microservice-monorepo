import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
// import * as dtoenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

// dtoenv.config();
const microserviceOptions = {
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379,
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOptions,
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
