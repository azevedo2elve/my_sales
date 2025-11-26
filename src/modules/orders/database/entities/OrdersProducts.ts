import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './Order';
import type { Product } from '@modules/products/database/entities/Product';
import type { IOrdersProducts } from '../../domain/models/IOrdersProducts';

@Entity('orders_products')
export class OrdersProducts implements IOrdersProducts {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.order_products)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'integer' })
  order_id: number;

  @ManyToOne('Product', 'order_products')
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'integer' })
  product_id: number;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
