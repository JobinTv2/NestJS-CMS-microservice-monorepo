import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  const orderMockService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideProvider(OrderService)
      .useValue(orderMockService)
      .compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a order', () =>
    expect(
      controller.create({
        transaction_id: '1000',
        user_id: 1,
        book_id: 10,
        address: 'address',
      }),
    ).toEqual({
      transaction_id: '1000',
      user_id: 1,
      book_id: 10,
      address: 'address',
      id: expect.any(Number),
    }));
});
