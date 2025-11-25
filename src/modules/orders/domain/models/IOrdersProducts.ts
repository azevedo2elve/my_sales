import type { Product } from '../../../products/database/entities/Product';
import type { Order } from '../../database/entities/Order';

export interface IOrdersProducts {
  id: number;
  order: Order;
  order_id: number;
  product: Product;
  product_id: number;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}
