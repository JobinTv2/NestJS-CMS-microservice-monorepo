import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

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
  await app.listen();
}
bootstrap();
