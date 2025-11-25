import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

const port = process.env.DB_PORT as number | undefined;

const baseDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: port || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postgres',
  entities: ['./src/modules/**/database/entities/*.{ts,js}'],
  migrations: ['./src/shared/infra/typeorm/migrations/*.{ts,js}'],
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

// Export default para o CLI do TypeORM
export default AppDataSource;
