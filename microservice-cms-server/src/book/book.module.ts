import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BullModule } from '@nestjs/bull';
import { UploadProcessor } from './processors/upload.processor';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          redis: {
            host: config.get('REDIS_HOST'),
            port: Number(config.get('REDIS_PORT')),
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: 'file-upload-queue',
    }),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [BookService, UploadProcessor],
  controllers: [BookController],
  exports: [BullModule, UploadProcessor],
})
export class BookModule {}
