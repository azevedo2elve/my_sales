import { Router } from 'express';
import UserController from '../controllers/UserController';
import { createUserSchema } from '../schemas/user.schema';

const usersRouter = Router();
const userController = new UserController();

usersRouter.get('/', userController.index);
usersRouter.post('/', createUserSchema, userController.create);

export default usersRouter;
