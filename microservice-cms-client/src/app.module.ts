import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookController } from './book/book.controller';
import { BookService } from './book/book.service';
import { BookModule } from './book/book.module';
import * as redisStrore from 'cache-manager-redis-store';
@Module({
  imports: [
    BookModule,
    CacheModule.register({
      store: redisStrore,
      socket: { host: 'localhost', port: 6379 },
    }),
  ],
  controllers: [AppController, BookController],
  providers: [AppService, BookService],
})
export class AppModule {}
