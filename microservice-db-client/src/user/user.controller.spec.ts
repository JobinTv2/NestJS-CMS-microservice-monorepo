import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const users = [
    {
      id: 2,
      name: 'User 2',
      phone: 8956895689,
      email: 'user2@gmail.com',
      address: 'test address',
      password: 'user2&123',
      token: 'test token',
    },
  ];

  const userMockService = {
    create: jest.fn((dto) => {
      const { password, ...rest } = dto;
      return {
        id: Date.now(),
        ...rest,
        token: '',
      };
    }),
    findOneById: jest.fn((id) => {
      const { password, token, ...user } = users.find(
        (usr) => usr.id === Number(id),
      );
      return user;
    }),
    getUser: jest.fn((id) => {
      return id;
    }),
    login: jest.fn((dto) => {
      const { password, ...user } = users.find(
        (usr) => usr.email === dto.email && usr.password === dto.password,
      );
      return user;
    }),
    validateUser: jest.fn((dto) => {
      const result = users.find(
        (usr) => usr.email === dto.email && usr.password === dto.password,
      );
      if (result) {
        const { password, token, ...user } = result;
        return user;
      }
      return !!result;
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, AuthService, JwtService],
    })
      .overrideProvider(UserService)
      .useValue(userMockService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    expect(
      controller.create({
        name: 'User 2',
        phone: 8956895689,
        email: 'user2@gmail.com',
        address: 'test address',
        password: 'user2&123',
        role: 'user',
      }),
    ).toEqual({
      id: expect.any(Number),
      name: 'User 2',
      phone: 8956895689,
      email: 'user2@gmail.com',
      address: 'test address',
      token: '',
      role: 'user',
    });
    expect(userMockService.create).toHaveBeenCalledWith({
      name: 'User 2',
      phone: 8956895689,
      email: 'user2@gmail.com',
      address: 'test address',
      password: 'user2&123',
      role: 'user',
    });
  });

  it('should get a user by id', () => {
    expect(controller.getUser(String(2))).toEqual({
      id: expect.any(Number),
      name: 'User 2',
      phone: 8956895689,
      email: 'user2@gmail.com',
      address: 'test address',
    });
  });

  it('should return token and user details if credentails are correct', () =>
    expect(
      controller.login({ email: 'user2@gmail.com', password: 'user2&123' }),
    ).toEqual({
      id: expect.any(Number),
      name: 'User 2',
      phone: 8956895689,
      email: 'user2@gmail.com',
      address: 'test address',
      token: 'test token',
    }));

  it('should return if credentails are matching', () => {
    expect(
      controller.validateUser({
        email: 'user2@gmail.com',
        password: 'user2&123',
      }),
    ).toEqual({
      id: expect.any(Number),
      name: 'User 2',
      phone: 8956895689,
      email: 'user2@gmail.com',
      address: 'test address',
    });
    expect(userMockService.validateUser).toHaveBeenCalledWith({
      email: 'user2@gmail.com',
      password: 'user2&123',
    });
  });

  it('should return false if credentails are not matching', () =>
    expect(
      controller.validateUser({
        email: 'fakeuser@example.com',
        password: 'fakepassword',
      }),
    ).toEqual(false));
});
