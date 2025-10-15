import { Product } from '../database/entities/Products';
import { productsRepositories } from '../database/repositories/ProductsRepositories';

export default class ListProductService {
  async execute(): Promise<Product[]> {
    const products = await productsRepositories.find();
    return products;
  }
}
