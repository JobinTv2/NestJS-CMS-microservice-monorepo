import { Exclude } from 'class-transformer';
import { IsEmail, IsMobilePhone, IsOptional, IsString } from 'class-validator';

export class SerializedUser {
  @IsString()
  name: string;

  @IsMobilePhone()
  phone: number;

  @Exclude()
  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  role: string;
}
