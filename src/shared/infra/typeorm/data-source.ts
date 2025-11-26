import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { User } from '@modules/users/database/entities/User';
import { UserToken } from '@modules/users/database/entities/UserToken';
import { Product } from '@modules/products/database/entities/Product';
import { Customer } from '@modules/customers/infra/database/entities/Customer';
import { Order } from '@modules/orders/database/entities/Order';
import { OrdersProducts } from '@modules/orders/database/entities/OrdersProducts';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.DB_PORT as number | undefined;

const baseDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: port || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postgres',
  entities: [User, UserToken, Product, Customer, Order, OrdersProducts],
  migrations: [join(__dirname, './migrations/*.{ts,js}')],
  synchronize: false,
  logging: false,
};

const baseDataSourceTestOptions: DataSourceOptions = {
  ...baseDataSourceOptions,
  database: process.env.DB_NAME_TEST || 'postgres',
};

const AppDataSource = new DataSource(
  process.env.NODE_ENV === 'test'
    ? baseDataSourceTestOptions
    : baseDataSourceOptions,
);

export default AppDataSource;
