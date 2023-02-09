import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transaction_id: string;

  @Column()
  user_id: number;

  @Column()
  book_id: number;

  @Column()
  address: string;
}
