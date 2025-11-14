import { Router } from 'express';
import CustomerController from '../controllers/CustomerController';
import AuthMiddleware from '@shared/middlewares/AuthMiddleware';
import {
  createCustomerSchema,
  idParamsValidation,
  updateCustomerSchema,
} from '../schemas/customer.schema';

const customersRouter = Router();
const customerController = new CustomerController();

customersRouter.use(AuthMiddleware.execute);
customersRouter.get('/', customerController.index);
customersRouter.get('/:id', idParamsValidation, customerController.show);
customersRouter.post('/', createCustomerSchema, customerController.create);
customersRouter.patch(
  '/:id',
  idParamsValidation,
  updateCustomerSchema,
  customerController.update,
);
customersRouter.delete('/:id', idParamsValidation, customerController.delete);

export default customersRouter;
