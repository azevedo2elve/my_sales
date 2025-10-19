import { Router } from 'express';
import productsRouter from '../../../modules/products/routes/product.routes';
import usersRouter from '../../../modules/users/routes/user.routes';

const routes = Router();

routes.get('/health', (req, res) => {
  return res.json({ message: "Hello Dev! I'm alive!" });
});

routes.use('/products', productsRouter);
routes.use('/users', usersRouter);

export default routes;
