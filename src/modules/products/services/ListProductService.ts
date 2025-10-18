import { Product } from '../database/entities/Product';
import { productsRepositories } from '../database/repositories/ProductRepositories';

export default class ListProductService {
  async execute(): Promise<Product[]> {
    const products = await productsRepositories.find();
    return products;
  }
}
