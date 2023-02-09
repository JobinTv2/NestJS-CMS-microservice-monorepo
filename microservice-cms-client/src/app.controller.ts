import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('test')
  test(dto: { test: string }): string {
    return this.appService.testService(dto);
  }

  // @MessagePattern('cms/form')
  // getForm(dto: { test: string }): string {
  //   return 'Form';
  // }
}
