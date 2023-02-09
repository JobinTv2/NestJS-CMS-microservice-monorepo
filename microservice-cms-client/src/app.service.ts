import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  testService(dto: { test: string }) {
    return `${dto.test} hit on microservice`;
  }
}
