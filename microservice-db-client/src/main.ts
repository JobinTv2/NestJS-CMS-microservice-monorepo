import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
// import * as dtoenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

// dtoenv.config();
const microserviceOptions = {
  transport: Transport.REDIS,
  options: {
    host: String(process.env.REDIS_HOST),
    port: Number(process.env.REDIS_PORT),
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
