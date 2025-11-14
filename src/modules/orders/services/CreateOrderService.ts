import AppError from '../../../shared/errors/AppError';
import { customerRepository } from '../../customers/infra/database/repositories/customer.repository';
import type { Product } from '../../products/database/entities/Product';
import { productRepository } from '../../products/database/repository/product.repository';
import type { Order } from '../database/entities/Order';
import { orderRepository } from '../database/repositories/order.repository';

interface IOrderProduct {
  id: number;
  quantity: number;
}

interface ICreateOrder {
  customer_id: number;
  products: IOrderProduct[];
}

export default class CreateOrderService {
  async execute({ customer_id, products }: ICreateOrder): Promise<Order> {
    const customerExists = await customerRepository.findById(
      Number(customer_id),
    );

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id.');
    }

    const existsProducts = await productRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError('Could not find any products with the given ids.');
    }

    const existsProductsIds = existsProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}.`,
        404,
      );
    }

    const quantityAvailable = products.filter(product => {
      const existentProduct = existsProducts.find(
        productExisten => productExisten.id === product.id,
      );
      return existentProduct && existentProduct.quantity < product.quantity;
    });

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}.`,
        409,
      );
    }

    const serializeProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.find(p => p.id === product.id)!.price,
    }));

    const order = await orderRepository.createOrder({
      customer: customerExists,
      products: serializeProducts,
    });

    const { order_products } = order;

    const updateProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.find(p => p.id === product.product_id)!.quantity -
        product.quantity,
    }));

    await productRepository.save(updateProductQuantity);

    return order;
  }
}
