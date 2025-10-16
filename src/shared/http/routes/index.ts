import { Router } from 'express';
import productsRouter from '../../../modules/products/routes/ProductRoutes';

const routes = Router();

routes.get('/health', (req, res) => {
  return res.json({ message: "Hello Dev! I'm alive!" });
});

routes.use('/products', productsRouter);

export default routes;
