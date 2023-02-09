import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('db/order')
  create(createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
}
