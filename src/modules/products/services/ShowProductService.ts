import AppError from '../../../shared/errors/AppError';
import type { Product } from '../database/entities/Product';
import { productRepository } from '../database/repository/product.repository';

interface IShowProduct {
  id: string;
}

export default class ShowProductService {
  async execute({ id }: IShowProduct): Promise<Product> {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    return product;
  }
}
