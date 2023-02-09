import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  rating: number;

  @IsBoolean()
  is_sold: boolean;

  @IsNumber()
  owner_id: number;

  @IsString()
  category: string;

  @IsString()
  reviews: string;

  // @IsDate()
  // createdAt: Date;

  @IsString()
  author: string;

  @IsNumber()
  price: number;
}
