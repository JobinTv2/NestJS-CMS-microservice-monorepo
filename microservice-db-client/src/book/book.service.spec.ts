import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';

describe('BookService', () => {
  let service: BookService;
  const books = [
    {
      id: Date.now(),
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
      createdAt: Date.now(),
    },
  ];
  const mockBookRepository = {
    save: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
        createdAt: Date.now(),
      };
    }),
    find: jest.fn(() => {
      return books;
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a book', async () => {
    expect(
      await service.create({
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
      createdAt: expect.any(Number),
    });
  });

  it('should return all books', async () => {
    expect(await service.findAll()).toEqual([
      {
        id: expect.any(Number),
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
        createdAt: expect.any(Number),
      },
    ]);
  });
});
