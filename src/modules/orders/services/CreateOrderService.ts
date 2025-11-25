import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import type { ICustomersRepositories } from '../../customers/domain/repositories/ICustomersRepositories';
import type { IProductsRepository } from '../../products/domain/repositories/IProductsRepository';
import type { IOrdersRepository } from '../domain/repositories/IOrdersRepository';
import type { IOrder } from '../domain/models/IOrder';
import type { ICreateOrder } from '../domain/models/ICreateOrder';

@injectable()
export default class CreateOrderService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomersRepositories,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  public async execute({
    customer_id,
    products,
  }: ICreateOrder): Promise<IOrder> {
    const customerExists = await this.customerRepository.findById(
      Number(customer_id),
    );

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id.');
    }

    const existsProducts = await this.productsRepository.findAllByIds(products);

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

    const order = await this.ordersRepository.createOrder({
      customer: customerExists,
      products: serializeProducts,
    });

    const { order_products } = order;

    const updateProductQuantity = order_products.map(product => {
      const existingProduct = existsProducts.find(
        p => p.id === product.product_id,
      )!;
      return {
        ...existingProduct,
        quantity: existingProduct.quantity - product.quantity,
      };
    });

    await this.productsRepository.save(updateProductQuantity);

    return order;
  }
}
