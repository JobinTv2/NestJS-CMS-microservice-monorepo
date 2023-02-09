import { Module } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
