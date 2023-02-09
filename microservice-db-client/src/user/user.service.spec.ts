import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

describe('UserService', () => {
  let service: UserService;
  const users = [
    {
      id: 4,
      name: 'User 4',
      phone: 8986898989,
      address: '',
      token: '',
      email: 'abcd@example.com',
      password: '$2b$12$HwHmdS5Z12Tzt6gOI1sZyelY8sSo04Qpw7T1Ln6ID9Z2sZSa4lVLW',
    },
  ];

  const userMockRepository = {
    save: jest.fn().mockImplementation(async (dto) => {
      const { password, ...user } = dto;
      return { id: Date.now(), ...user };
    }),
    findOneBy: jest.fn().mockImplementation((dto) => {
      const user = users.find(
        (usr) => usr.id === dto.id || usr.email === dto.email,
      );

      if (dto.email && !user) {
        return !!user;
      }
      if (dto.email && user) {
        return user;
      }
      if (!user) return { error: 'User not found' };
      const { password, ...rest } = user;
      return rest;
    }),
    validateUser: jest.fn().mockImplementation((email, password) => {
      return Promise.resolve({ email, password });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: userMockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = {
      id: 4,
      name: 'User 4',
      phone: 8986898989,
      address: '',
      token: '',
      email: 'abcd@example.com',
      password: '$2b$12$HwHmdS5Z12Tzt6gOI1sZyelY8sSo04Qpw7T1Ln6ID9Z2sZSa4lVLW',
      role: 'user',
    };
    const { password, ...rest } = user;
    expect(await service.create(user)).toEqual({
      id: expect.any(Number),
      ...rest,
    });
  });

  it('should find a user by id', async () => {
    const user = {
      id: 4,
      name: 'User 4',
      phone: 8986898989,
      address: '',
      token: '',
      email: 'abcd@example.com',
      password: '$2b$12$HwHmdS5Z12Tzt6gOI1sZyelY8sSo04Qpw7T1Ln6ID9Z2sZSa4lVLW',
    };
    const { password, ...rest } = user;
    expect(await service.findOneById(String(4))).toEqual({
      id: expect.any(Number),
      ...rest,
    });
  });

  it('should return error if user not found', async () => {
    expect(await service.findOneById(String(11))).toEqual({
      error: 'User not found',
    });
  });

  it('should return undefined if no matching mail id found', async () => {
    expect(await service.findOneByEmail('falsemail@example.ocm')).toEqual(
      false,
    );
  });

  it('should return user data and token', async () => {
    expect(
      await service.login({
        email: 'abcd@example.com',
        password:
          '$2b$12$HwHmdS5Z12Tzt6gOI1sZyelY8sSo04Qpw7T1Ln6ID9Z2sZSa4lVLW',
      }),
    ).toEqual({
      id: 4,
      name: 'User 4',
      phone: 8986898989,
      address: '',
      email: 'abcd@example.com',
      token: expect.any(String),
    });
  });

  it('should validate a user', async () => {
    expect(
      await service.validateUser({
        email: 'abcd@example.com',
        password: 'user1&123',
      }),
    ).toEqual({
      id: 4,
      name: 'User 4',
      phone: 8986898989,
      address: '',
      token: '',
      email: 'abcd@example.com',
      password: '$2b$12$HwHmdS5Z12Tzt6gOI1sZyelY8sSo04Qpw7T1Ln6ID9Z2sZSa4lVLW',
    });
  });
});
