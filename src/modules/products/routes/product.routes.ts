import { Router } from 'express';
import ProductsControllers from '../controllers/ProductController';
import {
  createProductSchema,
  idParamsValidation,
  updateProductSchema,
} from '../schemas/product.schema';

const productsRouter = Router();
const productsController = new ProductsControllers();

productsRouter.get('/', productsController.index);
productsRouter.get('/:id', idParamsValidation, productsController.show);
productsRouter.post('/', createProductSchema, productsController.create);
productsRouter.put('/:id', updateProductSchema, productsController.update);
productsRouter.delete('/:id', idParamsValidation, productsController.delete);

export default productsRouter;
