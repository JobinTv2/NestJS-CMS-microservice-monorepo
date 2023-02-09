import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user: User): Promise<string> {
    const { password, ...userData } = user;
    return this.jwtService.signAsync(
      { userData },
      { secret: process.env.JWT_SECRET },
    );
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  comparePassword(password: string, passwordhash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordhash).then((match) => {
      return match;
    });
  }
}
