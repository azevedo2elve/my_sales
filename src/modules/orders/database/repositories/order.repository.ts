import AppDataSource from '../../../../shared/infra/typeorm/data-source';
import { Order } from '../entities/Order';
import { Customer } from '../../../customers/infra/database/entities/Customer';
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
  },
});
