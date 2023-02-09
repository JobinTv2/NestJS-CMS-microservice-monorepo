import { IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  transaction_id: string;

  @IsNumber()
  user_id: number;

  @IsNumber()
  book_id: number;

  @IsString()
  address: string;
}
