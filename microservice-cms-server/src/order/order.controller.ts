import { Controller, HttpException, UseFilters } from '@nestjs/common';
import { Get, Post, Body } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HttpExceptionFilter } from 'src/filters/exception.filter';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
@UseFilters(HttpExceptionFilter)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  postOrder(@Body() createOrderDto: CreateOrderDto): Observable<string> {
    return this.orderService.postOrder(createOrderDto);
  }
}
