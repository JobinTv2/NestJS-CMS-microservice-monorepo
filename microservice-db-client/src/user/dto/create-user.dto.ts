import { IsEmail, IsMobilePhone, IsOptional, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  name: string;

  @IsMobilePhone()
  phone: number;

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
