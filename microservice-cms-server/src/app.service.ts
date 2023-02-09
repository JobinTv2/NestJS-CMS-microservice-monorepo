import { Injectable, Inject, LoggerService, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston/dist/winston.constants';

@Injectable()
export class AppService {
  private client: ClientProxy;
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
  }

  public testService(dto: string) {
    return this.client.send<string, string>('test', dto).pipe();
  }

  taskScheduleTest() {
    this.logger.log('Task scheduling call on 30th second of each minute');
  }
}
