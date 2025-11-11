import AppDataSource from '../../../../shared/infra/typeorm/data-source';
import { Order } from '../entities/Order';
import { Customer } from '../../../customers/database/entities/Customer';
import { OrdersProducts } from '../entities/OrdersProducts';
import { Product } from '../../../products/database/entities/Product';

interface IOrderProduct {
  product_id: number;
  quantity: number;
  price: number;
}

interface ICreateOrder {
  customer: Customer;
  products: IOrderProduct[];
}

export const orderRepository = AppDataSource.getRepository(Order).extend({
  async findById(id: number): Promise<Order | null> {
    const order = await this.findOne({
      where: { id },
      relations: ['order_products', 'customer'],
    });

    return order;
  },

  async createOrder({ customer, products }: ICreateOrder): Promise<Order> {
    const order = this.create({
      customer,
    });

    await this.save(order);

    return order;
  },
});
