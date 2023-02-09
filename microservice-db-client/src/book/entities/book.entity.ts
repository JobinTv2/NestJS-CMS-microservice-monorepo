import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  rating: number;
  @Column()
  is_sold: boolean;
  @Column()
  owner_id: number;
  @Column({ nullable: true })
  category: string;
  @Column()
  reviews: string;
  @Column({ nullable: true })
  createdAt: Date | null;
  @Column()
  author: string;
  @Column()
  price: number;
}
