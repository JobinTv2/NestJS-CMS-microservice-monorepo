import { IsBoolean, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  rating: number;

  @IsBoolean()
  @IsNotEmpty()
  is_sold: boolean;

  @IsNumber()
  owner_id: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  reviews: string;

  // @IsDate()
  // createdAt: Date;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
