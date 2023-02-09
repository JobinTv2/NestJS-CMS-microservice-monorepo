import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @MessagePattern('book')
  getForm() {
    return this.bookService.getForm();
  }

  // @MessagePattern('book/todos')
  // getTodos(id: string) {
  //   return this.bookService.getTodos(id);
  // }
}
