import express, { Router } from 'express';
import productsRouter from '../../../modules/products/routes/product.routes';
import usersRouter from '../../../modules/users/routes/user.routes';
import sessionRouter from '../../../modules/users/routes/session.route';
import avatarRouter from '../../../modules/users/routes/avatar.route';
import uploadConfig from '@config/upload';

const routes = Router();

routes.get('/health', (req, res) => {
  return res.json({ message: "Hello Dev! I'm alive!" });
});

routes.use('/products', productsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionRouter);
routes.use('/avatar', avatarRouter);
routes.use('/files', express.static(uploadConfig.directory));

export default routes;
