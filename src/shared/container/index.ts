import { container } from 'tsyringe';

import type { ICustomersRepositories } from '../../modules/customers/domain/repositories/ICustomersRepositories';
import CustomerRepository from '../../modules/customers/infra/database/repositories/CustomerRepository';
import type { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import ProductRepository from '@modules/products/infra/database/repositories/ProductRepository';
import type { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import UserRepository from '@modules/users/infra/database/repositories/UserRepository';
import type { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/database/repositories/UserTokensRepository';
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

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrderRepository,
);
