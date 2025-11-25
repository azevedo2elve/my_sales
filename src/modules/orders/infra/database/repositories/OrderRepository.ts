import AppDataSource from '@shared/infra/typeorm/data-source';
import { Order } from '@modules/orders/database/entities/Order';
import { OrdersProducts } from '@modules/orders/database/entities/OrdersProducts';
import { Product } from '@modules/products/database/entities/Product';
import type { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import type { IOrder } from '@modules/orders/domain/models/IOrder';
import type { Customer } from '@modules/customers/infra/database/entities/Customer';
import type { Repository } from 'typeorm';

interface IOrderProduct {
  product_id: number;
  quantity: number;
  price: number;
}

interface ICreateOrderData {
  customer: Customer;
  products: IOrderProduct[];
}

export default class OrderRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Order);
  }

  async findById(id: number): Promise<IOrder | null> {
    const order = await this.ormRepository.findOne({
      where: { id },
      relations: ['order_products', 'customer'],
    });

    return order;
  }

  async createOrder({ customer, products }: ICreateOrderData): Promise<IOrder> {
    const order = this.ormRepository.create({
      customer,
    });

    await this.ormRepository.save(order);

    // Criar os OrdersProducts separadamente
    const orderProductsRepository = AppDataSource.getRepository(OrdersProducts);
    const productRepository = AppDataSource.getRepository(Product);

    const orderProducts = await Promise.all(
      products.map(async productData => {
        const product = await productRepository.findOneBy({
          id: productData.product_id,
        });
        if (!product) {
          throw new Error(
            `Product with id ${productData.product_id} not found`,
          );
        }

        return orderProductsRepository.create({
          order,
          product,
          order_id: order.id,
          product_id: productData.product_id,
          quantity: productData.quantity,
          price: productData.price,
        });
      }),
    );

    await orderProductsRepository.save(orderProducts);

    // Recarregar o order com as relações
    const completeOrder = await this.findById(order.id);
    return completeOrder!;
  }
}
