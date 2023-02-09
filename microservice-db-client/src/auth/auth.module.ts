import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '10000s' },
      }),
    }),
  ],
  providers: [AuthService, UserService],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
