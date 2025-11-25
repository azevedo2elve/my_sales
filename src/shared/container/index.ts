import { container } from 'tsyringe';

// Customers
import type { ICustomersRepositories } from '../../modules/customers/domain/repositories/ICustomersRepositories';
import CustomerRepository from '../../modules/customers/infra/database/repositories/CustomerRepository';

// Products
import type { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import ProductRepository from '@modules/products/infra/database/repositories/ProductRepository';

// Users
import type { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import UserRepository from '@modules/users/infra/database/repositories/UserRepository';

// Orders
import type { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import OrderRepository from '@modules/orders/infra/database/repositories/OrderRepository';

container.registerSingleton<ICustomersRepositories>(
  'CustomerRepository',
  CustomerRepository,
);

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UserRepository,
);

container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrderRepository,
);
