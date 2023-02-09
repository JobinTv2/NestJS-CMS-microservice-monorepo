import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

describe('AuthService', () => {
  let service: AuthService;
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
  const userMockRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: getRepositoryToken(User), useValue: userMockRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a token', async () => {
    expect(await service.generateJWT(user)).toEqual(expect.any(String));
  });
});
