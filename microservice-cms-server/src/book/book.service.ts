import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateBookDto } from './dto/create-book.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

interface Options extends IPaginationOptions {
  search: string;
}
@Injectable()
export class BookService {
  private client: ClientProxy;
  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
  }

  async getBookTradeForm() {
    const result = await firstValueFrom(
      this.client.send<string, string>('book', 'Test').pipe(),
    );
    if (Object.prototype.hasOwnProperty.call(result, 'error')) {
      throw new InternalServerErrorException(
        'The server encountered an error and could not complete your request',
      );
    }
    return result;
  }

  async getBook() {
    const result = await firstValueFrom(
      this.client.send<string, string>('db/book/get', '').pipe(),
    );
    return result;
  }

  async getBookWithPagination(options: Options) {
    const result = await firstValueFrom(
      this.client
        .send<string, Options>('db/book/get/paginated', options)
        .pipe(),
    );
    return result;
  }

  getTodos(id: string) {
    return this.client.send<string, string>('book/todos', id).pipe();
  }

  postBook(createBookDto) {
    return this.client.send<string, CreateBookDto>('db/book', createBookDto);
  }

  uploadFile(file) {
    return this.client.send<string, any>('/book/upload', file);
  }
}
