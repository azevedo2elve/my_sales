import type { Customer } from '../../../customers/infra/database/entities/Customer';
import type { OrdersProducts } from '../../database/entities/OrdersProducts';

export interface IOrder {
  id: number;
  customer: Customer;
  order_products: OrdersProducts[];
  created_at: Date;
  updated_at: Date;
}
