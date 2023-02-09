import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    MulterModule.register({
      dest: './uploads/csv',
    }),
  ],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
