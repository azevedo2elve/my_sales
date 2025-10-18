import AppError from '@shared/errors/AppError';
import { productRepository } from '../database/repository/product.repository';

interface IDeleteProduct {
  id: string;
}

export default class DeleteProductService {
  async execute({ id }: IDeleteProduct): Promise<void> {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await productRepository.remove(product);
  }
}
