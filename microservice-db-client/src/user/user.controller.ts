import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('db/user/get')
  getUser(id: string) {
    return this.userService.findOneById(id);
  }

  @MessagePattern('db/user')
  create(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern('/db/user/login')
  login(loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @MessagePattern('db/validate/user')
  validateUser(loginUserDto: LoginUserDto) {
    return this.userService.validateUser(loginUserDto);
  }
}
