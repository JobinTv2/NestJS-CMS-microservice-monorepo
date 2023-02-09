import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  const orderMockRepository = {
    save: jest.fn().mockImplementation((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: orderMockRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a order', async () => {
    expect(
      await service.create({
        transaction_id: '1000',
        user_id: 1,
        book_id: 10,
        address: 'address',
      }),
    ).toEqual({
      id: expect.any(Number),
      transaction_id: '1000',
      user_id: 1,
      book_id: 10,
      address: 'address',
    });
  });
});
