import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';

describe('BookController', () => {
  let controller: BookController;
  const bookMockService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    findAll: jest.fn(() => {
      return books;
    }),
  };

  const books = [
    {
      name: 'Book 2',
      title: 'Book 2',
      description: 'Description',
      rating: 2,
      is_sold: false,
      owner_id: 1,
      categroy: 'Romantic',
      author: 'Author 2',
      price: 130,
      reviews: 'reviews',
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService],
    })
      .overrideProvider(BookService)
      .useValue(bookMockService)
      .compile();

    controller = module.get<BookController>(BookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create a book', () => {
    expect(
      controller.Create({
        name: 'Book 2',
        title: 'Book 2',
        description: 'Description',
        rating: 2,
        is_sold: false,
        owner_id: 1,
        category: 'Romantic',
        author: 'Author 2',
        price: 130,
        reviews: 'reviews',
      }),
    ).toEqual({
      id: expect.any(Number),
      name: 'Book 2',
      title: 'Book 2',
      description: 'Description',
      rating: 2,
      is_sold: false,
      owner_id: 1,
      category: 'Romantic',
      author: 'Author 2',
      price: 130,
      reviews: 'reviews',
    });
  });

  it('should return all books', () => {
    expect(controller.Get()).toEqual([
      {
        name: 'Book 2',
        title: 'Book 2',
        description: 'Description',
        rating: 2,
        is_sold: false,
        owner_id: 1,
        categroy: 'Romantic',
        author: 'Author 2',
        price: 130,
        reviews: 'reviews',
      },
    ]);
    expect(bookMockService.findAll).toHaveBeenCalled();
  });
});
