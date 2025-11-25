import { Product } from '../../../database/entities/Product';
import type { ICreateProduct } from '../../models/ICreateProduct';
import type { IProduct } from '../../models/IProduct';
import type {
  IFindProducts,
  IProductsRepository,
} from '../IProductsRepository';

export default class FakeProductsRepository implements IProductsRepository {
  private products: IProduct[] = [];

  public async create({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<IProduct> {
    const product = new Product();

    product.id = this.products.length + 1;
    product.name = name;
    product.price = price;
    product.quantity = quantity;
    product.created_at = new Date();
    product.updated_at = new Date();

    this.products.push(product);

    return product;
  }

  public async save(
    product: IProduct | IProduct[],
  ): Promise<IProduct | IProduct[]> {
    if (Array.isArray(product)) {
      return Promise.all(
        product.map(async p => {
          const findIndex = this.products.findIndex(
            findProduct => findProduct.id === p.id,
          );
          if (findIndex >= 0) {
            this.products[findIndex] = p;
          }
          return p;
        }),
      );
    }

    const findIndex = this.products.findIndex(
      findProduct => findProduct.id === product.id,
    );

    if (findIndex >= 0) {
      this.products[findIndex] = product;
    }

    return product;
  }

  public async remove(product: IProduct): Promise<void> {
    const findIndex = this.products.findIndex(
      findProduct => findProduct.id === product.id,
    );

    if (findIndex >= 0) {
      this.products.splice(findIndex, 1);
    }
  }

  public async find(): Promise<IProduct[]> {
    return this.products;
  }

  public async findByName(name: string): Promise<IProduct | null> {
    const product = this.products.find(
      findProduct => findProduct.name === name,
    );

    return product || null;
  }

  public async findById(id: number): Promise<IProduct | null> {
    const product = this.products.find(findProduct => findProduct.id === id);

    return product || null;
  }

  public async findAllByIds(products: IFindProducts[]): Promise<IProduct[]> {
    const productIds = products.map(p => p.id);
    const foundProducts = this.products.filter(product =>
      productIds.includes(product.id),
    );

    return foundProducts;
  }
}
