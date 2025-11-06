import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import { updateProductSchema } from '../../products/schemas/product.schema';
import AuthMiddleware from '@shared/middlewares/AuthMiddleware';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(AuthMiddleware.execute);
profileRouter.get('/', profileController.show);
profileRouter.patch('/', updateProductSchema, profileController.update);

export default profileRouter;
