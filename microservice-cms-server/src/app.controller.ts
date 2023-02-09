import { Body, Controller, Post, Get, Version } from '@nestjs/common';
import { UseFilters } from '@nestjs/common/decorators';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './filters/exception.filter';
import { Cron } from '@nestjs/schedule';
// import { SkipThrottle, Throttle } from '@nestjs/throttler';
@Controller()
@UseFilters(HttpExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}
  //Version
  @Version('1')
  @Get()
  getHelloV1() {
    return 'Hello World V1!';
  }

  @Version('2')
  @Get()
  getHelloV2() {
    return 'Hello World V2!';
  }

  //Task scheduling
  @Cron('30 * * * * *')
  taskScheduling() {
    this.appService.taskScheduleTest();
  }

  // @SkipThrottle()
  // @Throttle(3, 10)
  @Post('test')
  async create(@Body() dto: string) {
    return 'Response';
  }
}
