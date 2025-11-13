import { Router } from 'express';
import OrderController from '../controller/OrderController';
import AuthMiddleware from '@shared/middlewares/AuthMiddleware';
import { createOrderValidate, idParamsValidate } from '../schemas/order.schema';

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.use(AuthMiddleware.execute);

orderRouter.get('/:id', idParamsValidate, orderController.show);
orderRouter.post('/', createOrderValidate, orderController.create);

export default orderRouter;
