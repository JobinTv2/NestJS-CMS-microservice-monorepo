import { Module, CacheModule } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import * as redisStrore from 'cache-manager-redis-store';
@Module({
  imports: [
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
