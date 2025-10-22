import { Router } from 'express';
import UserController from '../controllers/UserController';
import { createUserSchema } from '../schemas/user.schema';
import AuthMiddleware from '../../../shared/middlewares/AuthMiddleware';

const usersRouter = Router();
const userController = new UserController();

usersRouter.get('/', AuthMiddleware.execute, userController.index);
usersRouter.post('/', createUserSchema, userController.create);

export default usersRouter;
