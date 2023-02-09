import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseFilters,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  Query,
  Version,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Observable } from 'rxjs';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from 'src/auth/auth-guard/jwt-auth-guard';
import { HttpExceptionFilter } from 'src/filters/exception.filter';
import { diskStorage } from 'multer';
import { InjectQueue } from '@nestjs/bull/dist/decorators';
import { Queue } from 'bull';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
@Controller('book')
@UseFilters(HttpExceptionFilter)
export class BookController {
  constructor(
    private readonly bookService: BookService,
    @InjectQueue('file-upload-queue') private fileQueue: Queue,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/form')
  getBookTradeForm() {
    return this.bookService.getBookTradeForm();
  }

  // @Get('/todos/:id')
  // getTodos(@Req() req): Observable<string> {
  //   const { id } = req.params;
  //   return this.bookService.getTodos(id);
  // }

  @Version('1')
  @UseGuards(JwtAuthGuard)
  @Get()
  getBook() {
    return this.bookService.getBook();
  }

  @Version('2')
  @UseGuards(JwtAuthGuard)
  @Get()
  getBookWithPagination(
    @Query('page') page = 1,
    @Query('limit') limit = 2,
    @Query('search') search: string,
  ) {
    limit = limit > 100 ? 100 : limit;
    search = search || null;
    return this.bookService.getBookWithPagination({
      limit,
      page,
      route: `${process.env.BASE_URL}book`,
      search,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createBook(@Body() createBookDto: CreateBookDto): Observable<string> {
    return this.bookService.postBook(createBookDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'csv',
        })
        .addMaxSizeValidator({
          maxSize: 1000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    this.fileQueue.add('csvfilejob', { file: file }, { delay: 2000 });
    return { uploaded: file };
  }
}
