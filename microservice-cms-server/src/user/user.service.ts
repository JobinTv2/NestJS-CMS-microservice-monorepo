import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  private client: ClientProxy;
  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const response: { error: any } | any = await firstValueFrom(
      this.client.send<string, CreateUserDto>('db/user', createUserDto).pipe(),
    );

    if (Object.prototype.hasOwnProperty.call(response, 'error')) {
      throw new BadRequestException(response.error);
    }
    return response;
  }

  login(loginUserDto: LoginUserDto) {
    return this.client.send<string, LoginUserDto>(
      '/db/user/login',
      loginUserDto,
    );
  }

  async findOne(id: string) {
    const user = await firstValueFrom(
      this.client.send<string, string>('db/user/get', id),
    );
    if (Object.prototype.hasOwnProperty.call(user, 'error')) {
      throw new HttpException(
        'User not found, provide a valid id',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }
}
