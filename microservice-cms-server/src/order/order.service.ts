import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
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

  postOrder(createOrderDto: CreateOrderDto) {
    return this.client
      .send<string, CreateOrderDto>('db/order', createOrderDto)
      .pipe();
  }
}
