import type { IOrder } from '../models/IOrder';
import type { Customer } from '@modules/customers/infra/database/entities/Customer';

interface IOrderProduct {
  product_id: number;
  quantity: number;
  price: number;
}

interface ICreateOrderData {
  customer: Customer;
  products: IOrderProduct[];
}

export interface IOrdersRepository {
  findById(id: number): Promise<IOrder | null>;
  createOrder(data: ICreateOrderData): Promise<IOrder>;
}
