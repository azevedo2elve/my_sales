import 'reflect-metadata';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import { container } from 'tsyringe';
import '@shared/container';

import routes from './routes';
import ErrorHandleMiddleware from '@shared/middlewares/ErrorHandleMiddleware';
import AppDataSource from '@shared/infra/typeorm/data-source';
import rateLimiter from '@shared/middlewares/rateLimiter';

const createApp = async () => {
  await AppDataSource.initialize();
  console.log('✓ Connected to the database');

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(rateLimiter);

  app.use(routes);
  app.use(errors());
  app.use(ErrorHandleMiddleware.handleError);

  return app;
};

if (process.env.NODE_ENV !== 'test') {
  createApp()
    .then(app => {
      app.listen(3333, () => {
        console.log('✓ Server is running on port 3333');
      });
    })
    .catch(error => {
      console.error('✗ Failed to connect to the server:', error);
    });
}

export default createApp;
