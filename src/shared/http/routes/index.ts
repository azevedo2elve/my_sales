import { Router } from 'express';
import productsRouter from '../../../modules/products/routes/product.routes';
import usersRouter from '../../../modules/users/routes/user.routes';
import sessionRouter from '../../../modules/users/routes/session.route';
import avatarRouter from '../../../modules/users/routes/avatar.route';

const routes = Router();

routes.get('/health', (req, res) => {
  return res.json({ message: "Hello Dev! I'm alive!" });
});

routes.use('/products', productsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionRouter);
routes.use('/avatar', avatarRouter);

export default routes;
