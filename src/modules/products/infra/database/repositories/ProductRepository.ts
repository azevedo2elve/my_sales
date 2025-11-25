import AppDataSource from '@shared/infra/typeorm/data-source';
import { Product } from '@modules/products/database/entities/Product';
import type { IProduct } from '../../../domain/models/IProduct';
import type { ICreateProduct } from '../../../domain/models/ICreateProduct';
import type {
  IProductsRepository,
  IFindProducts,
} from '../../../domain/repositories/IProductsRepository';
import { Repository, In } from 'typeorm';

export default class ProductRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Product);
  }

  async findByName(name: string): Promise<IProduct | null> {
    const product = await this.ormRepository.findOneBy({ name });
    return product;
  }

  async findById(id: number): Promise<IProduct | null> {
    const product = await this.ormRepository.findOneBy({ id });
    return product;
  }

  async findAllByIds(products: IFindProducts[]): Promise<IProduct[]> {
    const productsIds = products.map(product => product.id);

    const existentProducts = await this.ormRepository.find({
      where: { id: In(productsIds) },
    });

    return existentProducts;
  }

  async create({ name, price, quantity }: ICreateProduct): Promise<IProduct> {
    const product = this.ormRepository.create({ name, price, quantity });
    await this.ormRepository.save(product);
    return product;
  }

  async save(product: IProduct | IProduct[]): Promise<IProduct | IProduct[]> {
    const result = await this.ormRepository.save(product as any);
    return result;
  }

  async remove(product: IProduct): Promise<void> {
    await this.ormRepository.remove(product as Product);
  }

  async find(): Promise<IProduct[]> {
    const products = await this.ormRepository.find();
    return products;
  }
}
