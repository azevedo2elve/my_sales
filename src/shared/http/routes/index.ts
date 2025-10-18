import { Router } from 'express';
import productRouter from '../../../modules/products/routes/product.routes';

const routes = Router();

routes.get('/health', (req, res) => {
  return res.json({ message: "Hello Dev! I'm alive!" });
});

routes.use('/products', productRouter);

export default routes;
