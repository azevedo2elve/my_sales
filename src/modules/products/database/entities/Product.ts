import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { OrdersProducts } from '../../../orders/database/entities/OrdersProducts';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany('OrdersProducts', 'product')
  order_products: OrdersProducts[];

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
